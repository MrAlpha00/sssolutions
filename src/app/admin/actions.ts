"use server";

import { refresh, updateTag } from "next/cache";
import { redirect } from "next/navigation";

import { assertAdmin } from "@/lib/auth/session";
import { CACHE_TAGS } from "@/lib/content";
import { db } from "@/lib/db";
import type { New } from "@/lib/db/types";
import { normalizeServiceGroup } from "@/lib/service-groups";
import type {
  ApplicationStatus,
  Faq,
  HighlightStat,
  Job,
  Partner,
  Post,
  Service,
  SiteSettings,
  SubmissionStatus,
  SubscriberStatus,
  Testimonial,
} from "@/lib/types";
import { slugify } from "@/lib/utils";

export type ActionResult = { ok: boolean; error?: string } | null;

function str(fd: FormData, key: string): string {
  return String(fd.get(key) ?? "").trim();
}
function optStr(fd: FormData, key: string): string | null {
  const v = str(fd, key);
  return v.length > 0 ? v : null;
}
function bool(fd: FormData, key: string): boolean {
  const v = fd.get(key);
  return v === "on" || v === "true" || v === "1";
}
function num(fd: FormData, key: string, fallback = 0): number {
  const v = Number(fd.get(key));
  return Number.isFinite(v) ? v : fallback;
}
function id(fd: FormData): string {
  return str(fd, "id");
}

function touch(...tags: string[]) {
  for (const tag of tags) updateTag(tag);
  refresh();
}

/* ------------------------------------------------------------------ services */

export async function saveServiceAction(
  _prev: ActionResult,
  fd: FormData,
): Promise<ActionResult> {
  await assertAdmin();
  const title = str(fd, "title");
  const summary = str(fd, "summary");
  const description = str(fd, "description");
  if (!title || !description) {
    return { ok: false, error: "Title and description are required." };
  }
  const slug = str(fd, "slug") || slugify(title);
  const payload = {
    slug,
    title,
    summary: summary || description.slice(0, 160),
    description,
    icon: str(fd, "icon") || "users",
    image_url: optStr(fd, "image_url"),
    group: normalizeServiceGroup(str(fd, "group")),
    published: bool(fd, "published"),
    order_index: num(fd, "order_index"),
  };
  try {
    const existing = id(fd);
    if (existing) await db.updateService(existing, payload);
    else await db.createService(payload as New<Service>);
  } catch (error) {
    return { ok: false, error: (error as Error).message };
  }
  touch(CACHE_TAGS.services);
  redirect("/admin/services");
}

export async function deleteServiceAction(fd: FormData): Promise<void> {
  await assertAdmin();
  await db.deleteService(id(fd));
  touch(CACHE_TAGS.services);
}

export async function toggleServiceAction(fd: FormData): Promise<void> {
  await assertAdmin();
  const service = await db.getServiceById(id(fd));
  if (service) await db.updateService(service.id, { published: !service.published });
  touch(CACHE_TAGS.services);
}

/* ------------------------------------------------------------------ partners */

export async function savePartnerAction(
  _prev: ActionResult,
  fd: FormData,
): Promise<ActionResult> {
  await assertAdmin();
  const name = str(fd, "name");
  if (!name) return { ok: false, error: "Partner name is required." };
  const payload = {
    name,
    logo_url: optStr(fd, "logo_url"),
    website_url: optStr(fd, "website_url"),
    visible: bool(fd, "visible"),
    order_index: num(fd, "order_index"),
  };
  try {
    const existing = id(fd);
    if (existing) await db.updatePartner(existing, payload);
    else await db.createPartner(payload as New<Partner>);
  } catch (error) {
    return { ok: false, error: (error as Error).message };
  }
  touch(CACHE_TAGS.partners);
  redirect("/admin/partners");
}

export async function deletePartnerAction(fd: FormData): Promise<void> {
  await assertAdmin();
  await db.deletePartner(id(fd));
  touch(CACHE_TAGS.partners);
}

export async function togglePartnerAction(fd: FormData): Promise<void> {
  await assertAdmin();
  const list = await db.listPartners();
  const partner = list.find((p) => p.id === id(fd));
  if (partner) await db.updatePartner(partner.id, { visible: !partner.visible });
  touch(CACHE_TAGS.partners);
}

/* -------------------------------------------------------------- testimonials */

export async function saveTestimonialAction(
  _prev: ActionResult,
  fd: FormData,
): Promise<ActionResult> {
  await assertAdmin();
  const quote = str(fd, "quote");
  const author = str(fd, "author_name");
  if (!quote || !author) {
    return { ok: false, error: "Quote and client name are required." };
  }
  const ratingRaw = str(fd, "rating");
  const payload = {
    quote,
    author_name: author,
    author_role: optStr(fd, "author_role"),
    company: optStr(fd, "company"),
    image_url: optStr(fd, "image_url"),
    rating: ratingRaw ? Math.min(5, Math.max(1, Number(ratingRaw) || 5)) : null,
    visible: bool(fd, "visible"),
    order_index: num(fd, "order_index"),
  };
  try {
    const existing = id(fd);
    if (existing) await db.updateTestimonial(existing, payload);
    else await db.createTestimonial(payload as New<Testimonial>);
  } catch (error) {
    return { ok: false, error: (error as Error).message };
  }
  touch(CACHE_TAGS.testimonials);
  redirect("/admin/testimonials");
}

export async function deleteTestimonialAction(fd: FormData): Promise<void> {
  await assertAdmin();
  await db.deleteTestimonial(id(fd));
  touch(CACHE_TAGS.testimonials);
}

export async function toggleTestimonialAction(fd: FormData): Promise<void> {
  await assertAdmin();
  const all = await db.listTestimonials();
  const t = all.find((x) => x.id === id(fd));
  if (t) await db.updateTestimonial(t.id, { visible: !t.visible });
  touch(CACHE_TAGS.testimonials);
}

/* ----------------------------------------------------------------------- faqs */

export async function saveFaqAction(
  _prev: ActionResult,
  fd: FormData,
): Promise<ActionResult> {
  await assertAdmin();
  const question = str(fd, "question");
  const answer = str(fd, "answer");
  if (!question || !answer) {
    return { ok: false, error: "Question and answer are required." };
  }
  const payload = {
    question,
    answer,
    category: optStr(fd, "category"),
    published: bool(fd, "published"),
    order_index: num(fd, "order_index"),
  };
  try {
    const existing = id(fd);
    if (existing) await db.updateFaq(existing, payload);
    else await db.createFaq(payload as New<Faq>);
  } catch (error) {
    return { ok: false, error: (error as Error).message };
  }
  touch(CACHE_TAGS.faqs);
  redirect("/admin/faqs");
}

export async function deleteFaqAction(fd: FormData): Promise<void> {
  await assertAdmin();
  await db.deleteFaq(id(fd));
  touch(CACHE_TAGS.faqs);
}

export async function toggleFaqAction(fd: FormData): Promise<void> {
  await assertAdmin();
  const all = await db.listFaqs();
  const faq = all.find((x) => x.id === id(fd));
  if (faq) await db.updateFaq(faq.id, { published: !faq.published });
  touch(CACHE_TAGS.faqs);
}

/* ---------------------------------------------------------------------- posts */

export async function savePostAction(
  _prev: ActionResult,
  fd: FormData,
): Promise<ActionResult> {
  await assertAdmin();
  const title = str(fd, "title");
  const content = str(fd, "content");
  if (!title || !content) {
    return { ok: false, error: "Title and content are required." };
  }
  const payload = {
    slug: str(fd, "slug") || slugify(title),
    title,
    category: str(fd, "category") || "HR Insights",
    summary: str(fd, "summary") || content.slice(0, 160),
    content,
    cover_image_url: optStr(fd, "cover_image_url"),
    author: optStr(fd, "author"),
    published_at: optStr(fd, "published_at") ?? new Date().toISOString(),
    seo_title: optStr(fd, "seo_title"),
    seo_description: optStr(fd, "seo_description"),
    published: bool(fd, "published"),
    order_index: num(fd, "order_index"),
  };
  try {
    const existing = id(fd);
    if (existing) await db.updatePost(existing, payload);
    else await db.createPost(payload as New<Post>);
  } catch (error) {
    return { ok: false, error: (error as Error).message };
  }
  touch(CACHE_TAGS.posts);
  redirect("/admin/resources");
}

export async function deletePostAction(fd: FormData): Promise<void> {
  await assertAdmin();
  await db.deletePost(id(fd));
  touch(CACHE_TAGS.posts);
}

export async function togglePostAction(fd: FormData): Promise<void> {
  await assertAdmin();
  const all = await db.listPosts();
  const post = all.find((x) => x.id === id(fd));
  if (post) await db.updatePost(post.id, { published: !post.published });
  touch(CACHE_TAGS.posts);
}

/* ----------------------------------------------------------------------- jobs */

export async function saveJobAction(
  _prev: ActionResult,
  fd: FormData,
): Promise<ActionResult> {
  await assertAdmin();
  const title = str(fd, "title");
  const description = str(fd, "description");
  if (!title || !description) {
    return { ok: false, error: "Job title and description are required." };
  }
  const payload = {
    title,
    location: str(fd, "location") || "Bengaluru, Karnataka",
    employment_type: optStr(fd, "employment_type"),
    description,
    requirements: optStr(fd, "requirements"),
    published: bool(fd, "published"),
    order_index: num(fd, "order_index"),
  };
  try {
    const existing = id(fd);
    if (existing) await db.updateJob(existing, payload);
    else await db.createJob(payload as New<Job>);
  } catch (error) {
    return { ok: false, error: (error as Error).message };
  }
  touch(CACHE_TAGS.jobs);
  redirect("/admin/jobs");
}

export async function deleteJobAction(fd: FormData): Promise<void> {
  await assertAdmin();
  await db.deleteJob(id(fd));
  touch(CACHE_TAGS.jobs);
}

export async function toggleJobAction(fd: FormData): Promise<void> {
  await assertAdmin();
  const all = await db.listJobs();
  const job = all.find((x) => x.id === id(fd));
  if (job) await db.updateJob(job.id, { published: !job.published });
  touch(CACHE_TAGS.jobs);
}

/* ------------------------------------------------------------------ enquiries */

export async function updateContactStatusAction(fd: FormData): Promise<void> {
  await assertAdmin();
  const status = str(fd, "status") as SubmissionStatus;
  await db.updateContactStatus(id(fd), status);
  refresh();
}

export async function deleteContactAction(fd: FormData): Promise<void> {
  await assertAdmin();
  await db.deleteContactSubmission(id(fd));
  refresh();
}

/* ---------------------------------------------------------------- subscribers */

export async function updateSubscriberStatusAction(
  fd: FormData,
): Promise<void> {
  await assertAdmin();
  const status = str(fd, "status") as SubscriberStatus;
  await db.updateSubscriberStatus(id(fd), status);
  refresh();
}

export async function deleteSubscriberAction(fd: FormData): Promise<void> {
  await assertAdmin();
  await db.deleteSubscriber(id(fd));
  refresh();
}

/* --------------------------------------------------------------- applications */

export async function updateApplicationStatusAction(
  fd: FormData,
): Promise<void> {
  await assertAdmin();
  const status = str(fd, "status") as ApplicationStatus;
  await db.updateApplicationStatus(id(fd), status);
  refresh();
}

export async function deleteApplicationAction(fd: FormData): Promise<void> {
  await assertAdmin();
  await db.deleteApplication(id(fd));
  refresh();
}

/* ------------------------------------------------------------------- settings */

function parseHighlights(raw: string): HighlightStat[] {
  return raw
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [valuePart, ...labelParts] = line.split("|");
      const value = Number(valuePart.replace(/[^0-9.]/g, ""));
      const label = labelParts.join("|").trim();
      if (!label || !Number.isFinite(value)) return null;
      return { value, label } satisfies HighlightStat;
    })
    .filter((x): x is HighlightStat => x !== null);
}

export async function updateSettingsAction(
  _prev: ActionResult,
  fd: FormData,
): Promise<ActionResult> {
  await assertAdmin();
  const patch: Partial<SiteSettings> = {
    company_description: str(fd, "company_description"),
    tagline: str(fd, "tagline"),
    phone: str(fd, "phone"),
    email: str(fd, "email"),
    whatsapp_number: str(fd, "whatsapp_number"),
    address: str(fd, "address"),
    business_hours: str(fd, "business_hours"),
    social_linkedin: str(fd, "social_linkedin"),
    social_instagram: str(fd, "social_instagram"),
    social_facebook: str(fd, "social_facebook"),
    social_x: str(fd, "social_x"),
    calendly_url: str(fd, "calendly_url"),
    hero_label: str(fd, "hero_label"),
    hero_heading: str(fd, "hero_heading"),
    hero_description: str(fd, "hero_description"),
    hero_primary_cta: str(fd, "hero_primary_cta"),
    hero_secondary_cta: str(fd, "hero_secondary_cta"),
    highlights: parseHighlights(str(fd, "highlights")),
  };
  try {
    await db.updateSettings(patch);
  } catch (error) {
    return { ok: false, error: (error as Error).message };
  }
  touch(CACHE_TAGS.settings);
  return { ok: true };
}
