import { createClient, type SupabaseClient } from "@supabase/supabase-js";

import { env, isSupabaseAdminConfigured, isSupabaseConfigured } from "@/lib/env";
import { defaultSettings } from "@/lib/seed";
import { normalizeServiceGroup } from "@/lib/service-groups";
import type {
  ContactSubmission,
  Faq,
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
  StoreNotWritableError,
  type DataStore,
  type DashboardStats,
  type Edit,
  type ListOptions,
  type New,
} from "./types";

/**
 * Supabase-backed store (PostgreSQL + Row Level Security).
 *
 * Server-side reads/writes use the service-role key when available so the
 * admin dashboard can manage unpublished content. Public browser access is
 * still governed by the RLS policies in `supabase/migrations`.
 */

let cached: SupabaseClient | null = null;

function serverClient(): SupabaseClient {
  if (!isSupabaseConfigured()) {
    throw new Error("Supabase is not configured.");
  }
  if (cached) return cached;
  // Prefer the service role on the server; fall back to the anon key.
  const key = isSupabaseAdminConfigured()
    ? env.supabaseServiceRoleKey!
    : env.supabaseAnonKey!;
  cached = createClient(env.supabaseUrl!, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return cached;
}

function fail(error: { message: string } | null, context: string): never {
  throw new Error(`${context}: ${error?.message ?? "unknown error"}`);
}

async function listRows<T>(
  table: string,
  opts: ListOptions = {},
  filters?: Record<string, string | boolean>,
): Promise<T[]> {
  const client = serverClient();
  let query = client.from(table).select("*");
  if (filters) {
    for (const [key, value] of Object.entries(filters)) {
      query = query.eq(key, value);
    }
  }
  if (opts.publishedOnly) query = query.eq("published", true);
  if (opts.visibleOnly) query = query.eq("visible", true);
  query = query.order("order_index", { ascending: true });
  const { data, error } = await query;
  if (error) fail(error, `Failed to list ${table}`);
  return (data ?? []) as T[];
}

async function insertRow<T>(table: string, input: object): Promise<T> {
  const client = serverClient();
  const { data, error } = await client
    .from(table)
    .insert(input as never)
    .select("*")
    .single();
  if (error) fail(error, `Failed to create ${table} record`);
  return data as T;
}

async function updateRow<T>(
  table: string,
  id: string,
  input: object,
): Promise<T> {
  const client = serverClient();
  const { data, error } = await client
    .from(table)
    .update({ ...(input as object), updated_at: new Date().toISOString() } as never)
    .eq("id", id)
    .select("*")
    .single();
  if (error) fail(error, `Failed to update ${table} record`);
  return data as T;
}

async function deleteRow(table: string, id: string): Promise<void> {
  const client = serverClient();
  const { error } = await client.from(table).delete().eq("id", id);
  if (error) fail(error, `Failed to delete ${table} record`);
}

async function countRows(
  table: string,
  filters?: Record<string, string | boolean>,
): Promise<number> {
  const client = serverClient();
  let query = client.from(table).select("*", { count: "exact", head: true });
  if (filters) {
    for (const [key, value] of Object.entries(filters)) {
      query = query.eq(key, value);
    }
  }
  const { count, error } = await query;
  if (error) fail(error, `Failed to count ${table}`);
  return count ?? 0;
}

async function findBySlug<T>(
  table: string,
  slug: string,
  opts: ListOptions = {},
): Promise<T | null> {
  const client = serverClient();
  let query = client.from(table).select("*").eq("slug", slug);
  if (opts.publishedOnly) query = query.eq("published", true);
  const { data, error } = await query.maybeSingle();
  if (error) fail(error, `Failed to fetch ${table} by slug`);
  return (data as T) ?? null;
}

async function findById<T>(table: string, id: string): Promise<T | null> {
  const client = serverClient();
  const { data, error } = await client
    .from(table)
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) fail(error, `Failed to fetch ${table} by id`);
  return (data as T) ?? null;
}

async function orderedListSimple<T>(
  table: string,
  opts: ListOptions = {},
): Promise<T[]> {
  const client = serverClient();
  let query = client.from(table).select("*");
  if (opts.publishedOnly) query = query.eq("published", true);
  if (opts.visibleOnly) query = query.eq("visible", true);
  query = query.order("created_at", { ascending: false });
  const { data, error } = await query;
  if (error) fail(error, `Failed to list ${table}`);
  return (data ?? []) as T[];
}

/**
 * A service row as stored in PostgreSQL.
 *
 * `group` is a reserved word in SQL, so the column is called `service_group`
 * and mapped to the `group` field of the `Service` type here.
 */
type ServiceRow = Omit<Service, "group"> & { service_group?: string | null };

function toService(row: ServiceRow): Service {
  const { service_group, ...rest } = row;
  return { ...rest, group: normalizeServiceGroup(service_group) };
}

/** Map the app-level `group` field onto the `service_group` column. */
function toServiceColumns(input: Partial<Service>): Record<string, unknown> {
  const { group, ...rest } = input;
  return {
    ...rest,
    ...(group === undefined
      ? {}
      : { service_group: normalizeServiceGroup(group) }),
  };
}

export const supabaseStore: DataStore = {
  kind: "supabase",

  isWriteEnabled() {
    return isSupabaseAdminConfigured();
  },

  async getSettings(): Promise<SiteSettings> {
    const client = serverClient();
    const { data, error } = await client
      .from("site_settings")
      .select("data")
      .eq("id", "singleton")
      .maybeSingle();
    if (error) fail(error, "Failed to load site settings");
    return { ...defaultSettings, ...((data?.data as Partial<SiteSettings>) ?? {}) };
  },

  async updateSettings(patchInput) {
    if (!isSupabaseAdminConfigured()) throw new StoreNotWritableError();
    const current = await this.getSettings();
    const next = { ...current, ...patchInput };
    const client = serverClient();
    const { error } = await client.from("site_settings").upsert(
      {
        id: "singleton",
        data: next,
        updated_at: new Date().toISOString(),
      } as never,
    );
    if (error) fail(error, "Failed to save site settings");
    return next;
  },

  listServices: async (o) =>
    (await listRows<ServiceRow>("services", o)).map(toService),
  getServiceBySlug: async (slug, o) => {
    const row = await findBySlug<ServiceRow>("services", slug, o);
    return row ? toService(row) : null;
  },
  getServiceById: async (id) => {
    const row = await findById<ServiceRow>("services", id);
    return row ? toService(row) : null;
  },
  createService: async (input: New<Service>) =>
    toService(
      await insertRow<ServiceRow>("services", toServiceColumns(input)),
    ),
  updateService: async (id, input: Edit<Service>) =>
    toService(
      await updateRow<ServiceRow>("services", id, toServiceColumns(input)),
    ),
  deleteService: (id) => deleteRow("services", id),

  listPartners: (o) => listRows<Partner>("partners", o),
  createPartner: (input: New<Partner>) => insertRow<Partner>("partners", input),
  updatePartner: (id, input: Edit<Partner>) =>
    updateRow<Partner>("partners", id, input),
  deletePartner: (id) => deleteRow("partners", id),

  listTestimonials: (o) => listRows<Testimonial>("testimonials", o),
  createTestimonial: (input: New<Testimonial>) =>
    insertRow<Testimonial>("testimonials", input),
  updateTestimonial: (id, input: Edit<Testimonial>) =>
    updateRow<Testimonial>("testimonials", id, input),
  deleteTestimonial: (id) => deleteRow("testimonials", id),

  listFaqs: (o) => listRows<Faq>("faqs", o),
  createFaq: (input: New<Faq>) => insertRow<Faq>("faqs", input),
  updateFaq: (id, input: Edit<Faq>) => updateRow<Faq>("faqs", id, input),
  deleteFaq: (id) => deleteRow("faqs", id),

  listPosts: (o) => listRows<Post>("posts", o),
  getPostBySlug: (slug, o) => findBySlug<Post>("posts", slug, o),
  getPostById: (id) => findById<Post>("posts", id),
  createPost: (input: New<Post>) => insertRow<Post>("posts", input),
  updatePost: (id, input: Edit<Post>) => updateRow<Post>("posts", id, input),
  deletePost: (id) => deleteRow("posts", id),

  listJobs: (o) => listRows<Job>("jobs", o),
  getJobById: (id) => findById<Job>("jobs", id),
  createJob: (input: New<Job>) => insertRow<Job>("jobs", input),
  updateJob: (id, input: Edit<Job>) => updateRow<Job>("jobs", id, input),
  deleteJob: (id) => deleteRow("jobs", id),

  createContactSubmission: (input: New<ContactSubmission>) =>
    insertRow<ContactSubmission>("contact_submissions", input),
  listContactSubmissions: () =>
    orderedListSimple<ContactSubmission>("contact_submissions"),
  updateContactStatus: async (id, status) => {
    const client = serverClient();
    const { data, error } = await client
      .from("contact_submissions")
      .update({ status } as never)
      .eq("id", id)
      .select("*")
      .single();
    if (error) fail(error, "Failed to update enquiry");
    return data as ContactSubmission;
  },
  deleteContactSubmission: (id) => deleteRow("contact_submissions", id),

  createSubscriber: async (input: New<NewsletterSubscriber>) => {
    const client = serverClient();
    const { data, error } = await client
      .from("newsletter_subscribers")
      .insert(input as never)
      .select("*")
      .single();
    if (error) {
      if (error.code === "23505") throw new DuplicateSubscriberError();
      fail(error, "Failed to save subscriber");
    }
    return data as NewsletterSubscriber;
  },
  listSubscribers: () =>
    orderedListSimple<NewsletterSubscriber>("newsletter_subscribers"),
  updateSubscriberStatus: async (id, status) => {
    const client = serverClient();
    const { data, error } = await client
      .from("newsletter_subscribers")
      .update({ status } as never)
      .eq("id", id)
      .select("*")
      .single();
    if (error) fail(error, "Failed to update subscriber");
    return data as NewsletterSubscriber;
  },
  deleteSubscriber: (id) => deleteRow("newsletter_subscribers", id),

  createApplication: (input: New<JobApplication>) =>
    insertRow<JobApplication>("job_applications", input),
  listApplications: () => orderedListSimple<JobApplication>("job_applications"),
  getApplicationById: (id) => findById<JobApplication>("job_applications", id),
  updateApplicationStatus: async (id, status) => {
    const client = serverClient();
    const { data, error } = await client
      .from("job_applications")
      .update({ status } as never)
      .eq("id", id)
      .select("*")
      .single();
    if (error) fail(error, "Failed to update application");
    return data as JobApplication;
  },
  deleteApplication: (id) => deleteRow("job_applications", id),

  async getStats(): Promise<DashboardStats> {
    const [
      services,
      testimonials,
      posts,
      faqs,
      jobs,
      partners,
      newEnquiries,
      subscribers,
      applications,
    ] = await Promise.all([
      countRows("services", { published: true }),
      countRows("testimonials"),
      countRows("posts"),
      countRows("faqs"),
      countRows("jobs", { published: true }),
      countRows("partners", { visible: true }),
      countRows("contact_submissions", { status: "new" }),
      countRows("newsletter_subscribers", { status: "subscribed" }),
      countRows("job_applications", { status: "new" }),
    ]);
    return {
      services,
      testimonials,
      posts,
      faqs,
      jobs,
      partners,
      newEnquiries,
      subscribers,
      applications,
    };
  },
};
