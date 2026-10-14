import { promises as fs } from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";

import {
  defaultSettings,
  seedFaqs,
  seedPartners,
  seedPosts,
  seedServices,
} from "@/lib/seed";
import type {
  ContactSubmission,
  Faq,
  ID,
  Job,
  JobApplication,
  NewsletterSubscriber,
  Partner,
  Post,
  Service,
  SiteSettings,
  Testimonial,
} from "@/lib/types";
import {
  DuplicateSubscriberError,
  type DataStore,
  type DashboardStats,
  type Edit,
  type ListOptions,
  type New,
} from "./types";

/**
 * Local JSON-file store. Used automatically when Supabase is not configured.
 * Data is persisted to `.data/db.json` so the admin dashboard is genuinely
 * functional (not a front-end mock) before a database is provisioned.
 */

interface LocalDb {
  version: 1;
  settings: SiteSettings;
  services: Service[];
  partners: Partner[];
  testimonials: Testimonial[];
  faqs: Faq[];
  posts: Post[];
  jobs: Job[];
  contact_submissions: ContactSubmission[];
  newsletter_subscribers: NewsletterSubscriber[];
  job_applications: JobApplication[];
}

const DATA_DIR = path.join(process.cwd(), ".data");
const DB_FILE = path.join(DATA_DIR, "db.json");

function initialDb(): LocalDb {
  return {
    version: 1,
    settings: { ...defaultSettings },
    services: [...seedServices],
    partners: [...seedPartners],
    testimonials: [],
    faqs: [...seedFaqs],
    posts: [...seedPosts],
    jobs: [],
    contact_submissions: [],
    newsletter_subscribers: [],
    job_applications: [],
  };
}

// Serialise mutations so concurrent writes cannot corrupt the file.
let chain: Promise<unknown> = Promise.resolve();
function withLock<T>(fn: () => Promise<T>): Promise<T> {
  const run = chain.then(fn, fn);
  chain = run.then(
    () => undefined,
    () => undefined,
  );
  return run;
}

async function readDb(): Promise<LocalDb> {
  try {
    const raw = await fs.readFile(DB_FILE, "utf8");
    const parsed = JSON.parse(raw) as Partial<LocalDb>;
    return { ...initialDb(), ...parsed } as LocalDb;
  } catch {
    const db = initialDb();
    await writeDb(db);
    return db;
  }
}

async function writeDb(db: LocalDb): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(DB_FILE, JSON.stringify(db, null, 2), "utf8");
}

function nowIso(): string {
  return new Date().toISOString();
}

function byOrder<T extends { created_at: string; order_index?: number }>(
  a: T,
  b: T,
): number {
  const ao = a.order_index ?? 0;
  const bo = b.order_index ?? 0;
  if (ao !== bo) return ao - bo;
  return a.created_at.localeCompare(b.created_at);
}

type Collection = Exclude<keyof LocalDb, "version" | "settings">;

function list<T extends { created_at: string; order_index?: number }>(
  items: T[],
): T[] {
  return [...items].sort(byOrder);
}

async function insert<
  T extends { id: ID; created_at: string; updated_at: string },
>(collection: Collection, input: New<T>): Promise<T> {
  return withLock(async () => {
    const db = await readDb();
    const record = {
      ...(input as object),
      id: randomUUID(),
      created_at: nowIso(),
      updated_at: nowIso(),
    } as unknown as T;
    (db[collection] as unknown as T[]).push(record);
    await writeDb(db);
    return record;
  });
}

async function patch<
  T extends { id: ID; created_at: string; updated_at: string },
>(collection: Collection, id: ID, input: Edit<T>): Promise<T> {
  return withLock(async () => {
    const db = await readDb();
    const arr = db[collection] as unknown as T[];
    const index = arr.findIndex((item) => item.id === id);
    if (index === -1) throw new Error(`Record not found in ${collection}`);
    const updated = {
      ...arr[index],
      ...(input as object),
      updated_at: nowIso(),
    } as T;
    arr[index] = updated;
    await writeDb(db);
    return updated;
  });
}

async function remove(collection: Collection, id: ID): Promise<void> {
  return withLock(async () => {
    const db = await readDb();
    const arr = db[collection] as unknown as { id: ID }[];
    db[collection] = arr.filter((item) => item.id !== id) as never;
    await writeDb(db);
  });
}

type BaseRecordFields = "id" | "created_at" | "updated_at";

export const localStore: DataStore = {
  kind: "local",

  isWriteEnabled() {
    return true;
  },

  async getSettings() {
    const db = await readDb();
    return { ...defaultSettings, ...db.settings };
  },

  async updateSettings(patchInput) {
    return withLock(async () => {
      const db = await readDb();
      db.settings = { ...defaultSettings, ...db.settings, ...patchInput };
      await writeDb(db);
      return db.settings;
    });
  },

  async listServices(opts: ListOptions = {}) {
    const db = await readDb();
    const items = opts.publishedOnly
      ? db.services.filter((s) => s.published)
      : db.services;
    return list(items);
  },

  async getServiceBySlug(slug, opts = {}) {
    const db = await readDb();
    return (
      db.services.find(
        (s) => s.slug === slug && (!opts.publishedOnly || s.published),
      ) ?? null
    );
  },

  async getServiceById(id) {
    const db = await readDb();
    return db.services.find((s) => s.id === id) ?? null;
  },

  async createService(input: New<Service>) {
    return insert<Service>("services", input);
  },
  async updateService(id, input: Edit<Service>) {
    return patch<Service>("services", id, input);
  },
  async deleteService(id) {
    return remove("services", id);
  },

  async listPartners(opts: ListOptions = {}) {
    const db = await readDb();
    const items = opts.visibleOnly
      ? db.partners.filter((p) => p.visible)
      : db.partners;
    return list(items);
  },
  async createPartner(input: New<Partner>) {
    return insert<Partner>("partners", input);
  },
  async updatePartner(id, input: Edit<Partner>) {
    return patch<Partner>("partners", id, input);
  },
  async deletePartner(id) {
    return remove("partners", id);
  },

  async listTestimonials(opts: ListOptions = {}) {
    const db = await readDb();
    const items = opts.visibleOnly
      ? db.testimonials.filter((t) => t.visible)
      : db.testimonials;
    return list(items);
  },
  async createTestimonial(input: New<Testimonial>) {
    return insert<Testimonial>("testimonials", input);
  },
  async updateTestimonial(id, input: Edit<Testimonial>) {
    return patch<Testimonial>("testimonials", id, input);
  },
  async deleteTestimonial(id) {
    return remove("testimonials", id);
  },

  async listFaqs(opts: ListOptions = {}) {
    const db = await readDb();
    const items = opts.publishedOnly
      ? db.faqs.filter((f) => f.published)
      : db.faqs;
    return list(items);
  },
  async createFaq(input: New<Faq>) {
    return insert<Faq>("faqs", input);
  },
  async updateFaq(id, input: Edit<Faq>) {
    return patch<Faq>("faqs", id, input);
  },
  async deleteFaq(id) {
    return remove("faqs", id);
  },

  async listPosts(opts: ListOptions = {}) {
    const db = await readDb();
    const items = opts.publishedOnly
      ? db.posts.filter((p) => p.published)
      : db.posts;
    return items.sort((a, b) => {
      const da = a.published_at ?? a.created_at;
      const dbb = b.published_at ?? b.created_at;
      return dbb.localeCompare(da);
    });
  },
  async getPostBySlug(slug, opts = {}) {
    const db = await readDb();
    return (
      db.posts.find(
        (p) => p.slug === slug && (!opts.publishedOnly || p.published),
      ) ?? null
    );
  },
  async getPostById(id) {
    const db = await readDb();
    return db.posts.find((p) => p.id === id) ?? null;
  },
  async createPost(input: New<Post>) {
    return insert<Post>("posts", input);
  },
  async updatePost(id, input: Edit<Post>) {
    return patch<Post>("posts", id, input);
  },
  async deletePost(id) {
    return remove("posts", id);
  },

  async listJobs(opts: ListOptions = {}) {
    const db = await readDb();
    const items = opts.publishedOnly
      ? db.jobs.filter((j) => j.published)
      : db.jobs;
    return list(items);
  },
  async getJobById(id) {
    const db = await readDb();
    return db.jobs.find((j) => j.id === id) ?? null;
  },
  async createJob(input: New<Job>) {
    return insert<Job>("jobs", input);
  },
  async updateJob(id, input: Edit<Job>) {
    return patch<Job>("jobs", id, input);
  },
  async deleteJob(id) {
    return remove("jobs", id);
  },

  async createContactSubmission(input: New<ContactSubmission>) {
    return insert<ContactSubmission>("contact_submissions", input);
  },
  async listContactSubmissions() {
    const db = await readDb();
    return [...db.contact_submissions].sort((a, b) =>
      b.created_at.localeCompare(a.created_at),
    );
  },
  async updateContactStatus(id, status) {
    return patch<ContactSubmission>("contact_submissions", id, { status });
  },
  async deleteContactSubmission(id) {
    return remove("contact_submissions", id);
  },

  async createSubscriber(input: New<NewsletterSubscriber>) {
    return withLock(async () => {
      const db = await readDb();
      const exists = db.newsletter_subscribers.some(
        (s) => s.email.toLowerCase() === input.email.toLowerCase(),
      );
      if (exists) throw new DuplicateSubscriberError();
      const record: NewsletterSubscriber = {
        ...input,
        id: randomUUID(),
        created_at: nowIso(),
        updated_at: nowIso(),
      };
      db.newsletter_subscribers.push(record);
      await writeDb(db);
      return record;
    });
  },
  async listSubscribers() {
    const db = await readDb();
    return [...db.newsletter_subscribers].sort((a, b) =>
      b.created_at.localeCompare(a.created_at),
    );
  },
  async updateSubscriberStatus(id, status) {
    return patch<NewsletterSubscriber>("newsletter_subscribers", id, {
      status,
    });
  },
  async deleteSubscriber(id) {
    return remove("newsletter_subscribers", id);
  },

  async createApplication(input: New<JobApplication>) {
    return insert<JobApplication>("job_applications", input);
  },
  async listApplications() {
    const db = await readDb();
    return [...db.job_applications].sort((a, b) =>
      b.created_at.localeCompare(a.created_at),
    );
  },
  async getApplicationById(id) {
    const db = await readDb();
    return db.job_applications.find((a) => a.id === id) ?? null;
  },
  async updateApplicationStatus(id, status) {
    return patch<JobApplication>("job_applications", id, { status });
  },
  async deleteApplication(id) {
    return remove("job_applications", id);
  },

  async getStats(): Promise<DashboardStats> {
    const db = await readDb();
    return {
      services: db.services.filter((s) => s.published).length,
      testimonials: db.testimonials.length,
      posts: db.posts.length,
      faqs: db.faqs.length,
      jobs: db.jobs.filter((j) => j.published).length,
      partners: db.partners.filter((p) => p.visible).length,
      newEnquiries: db.contact_submissions.filter((c) => c.status === "new")
        .length,
      subscribers: db.newsletter_subscribers.filter(
        (s) => s.status === "subscribed",
      ).length,
      applications: db.job_applications.filter((a) => a.status === "new")
        .length,
    };
  },
};
