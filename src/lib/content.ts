import { cacheLife, cacheTag } from "next/cache";

import { db } from "@/lib/db";
import type {
  Faq,
  Job,
  Partner,
  Post,
  Service,
  SiteSettings,
  Testimonial,
} from "@/lib/types";

/**
 * Cached public content getters (Cache Components `use cache`).
 *
 * These read the same data store the admin dashboard writes to. Each getter is
 * tagged so admin mutations can invalidate it immediately via `updateTag`.
 */

export const CACHE_TAGS = {
  settings: "settings",
  services: "services",
  partners: "partners",
  testimonials: "testimonials",
  faqs: "faqs",
  posts: "posts",
  jobs: "jobs",
} as const;

export async function getSettings(): Promise<SiteSettings> {
  "use cache";
  cacheLife("hours");
  cacheTag(CACHE_TAGS.settings);
  return db.getSettings();
}

export async function getServices(): Promise<Service[]> {
  "use cache";
  cacheLife("hours");
  cacheTag(CACHE_TAGS.services);
  return db.listServices({ publishedOnly: true });
}

export async function getServiceBySlug(slug: string): Promise<Service | null> {
  "use cache";
  cacheLife("hours");
  cacheTag(CACHE_TAGS.services);
  return db.getServiceBySlug(slug, { publishedOnly: true });
}

export async function getPartners(): Promise<Partner[]> {
  "use cache";
  cacheLife("hours");
  cacheTag(CACHE_TAGS.partners);
  return db.listPartners({ visibleOnly: true });
}

export async function getTestimonials(): Promise<Testimonial[]> {
  "use cache";
  cacheLife("hours");
  cacheTag(CACHE_TAGS.testimonials);
  return db.listTestimonials({ visibleOnly: true });
}

export async function getFaqs(): Promise<Faq[]> {
  "use cache";
  cacheLife("hours");
  cacheTag(CACHE_TAGS.faqs);
  return db.listFaqs({ publishedOnly: true });
}

export async function getPosts(): Promise<Post[]> {
  "use cache";
  cacheLife("hours");
  cacheTag(CACHE_TAGS.posts);
  return db.listPosts({ publishedOnly: true });
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  "use cache";
  cacheLife("hours");
  cacheTag(CACHE_TAGS.posts);
  return db.getPostBySlug(slug, { publishedOnly: true });
}

export async function getJobs(): Promise<Job[]> {
  "use cache";
  cacheLife("hours");
  cacheTag(CACHE_TAGS.jobs);
  return db.listJobs({ publishedOnly: true });
}

/**
 * Current year for the footer copyright notice.
 *
 * Wrapped in `use cache` so the non-deterministic `new Date()` call is given a
 * cache lifetime (Cache Components requires this) and does not block
 * prerendering. A one-hour lifetime keeps the year correct across new year.
 */
export async function getCurrentYear(): Promise<number> {
  "use cache";
  cacheLife("hours");
  return new Date().getFullYear();
}
