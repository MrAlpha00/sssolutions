/** Shared domain types for all persisted content and submissions. */

export type ID = string;

export interface BaseRecord {
  id: ID;
  created_at: string;
  updated_at: string;
}

export type Publishable = {
  published: boolean;
  order_index: number;
};

/**
 * The two service groups shown on the public site.
 *
 * `hr`       — core Human Resources solutions.
 * `business` — additional business & workforce support services.
 */
export const SERVICE_GROUPS = ["hr", "business"] as const;

export type ServiceGroup = (typeof SERVICE_GROUPS)[number];

/** Group used when a record has no group yet (older rows, un-migrated data). */
export const DEFAULT_SERVICE_GROUP: ServiceGroup = "hr";

export function isServiceGroup(value: unknown): value is ServiceGroup {
  return (
    typeof value === "string" &&
    (SERVICE_GROUPS as readonly string[]).includes(value)
  );
}

export interface Service extends BaseRecord, Publishable {
  slug: string;
  title: string;
  summary: string;
  description: string;
  icon: string;
  image_url: string | null;
  /** Which section of the services page this service is listed under. */
  group: ServiceGroup;
}

export interface Partner extends BaseRecord {
  name: string;
  logo_url: string | null;
  website_url: string | null;
  visible: boolean;
  order_index: number;
}

export interface Testimonial extends BaseRecord {
  quote: string;
  author_name: string;
  author_role: string | null;
  company: string | null;
  image_url: string | null;
  rating: number | null;
  visible: boolean;
  order_index: number;
}

export interface Faq extends BaseRecord, Publishable {
  question: string;
  answer: string;
  category: string | null;
}

export interface Post extends BaseRecord, Publishable {
  slug: string;
  title: string;
  category: string;
  summary: string;
  content: string;
  cover_image_url: string | null;
  author: string | null;
  published_at: string | null;
  seo_title: string | null;
  seo_description: string | null;
}

export interface Job extends BaseRecord, Publishable {
  title: string;
  location: string;
  employment_type: string | null;
  description: string;
  requirements: string | null;
}

export type SubmissionStatus = "new" | "contacted" | "resolved";

export interface ContactSubmission extends BaseRecord {
  full_name: string;
  email: string;
  phone: string | null;
  company: string | null;
  service_interest: string | null;
  message: string;
  status: SubmissionStatus;
  email_sent: boolean;
}

export type SubscriberStatus = "subscribed" | "unsubscribed";

export interface NewsletterSubscriber extends BaseRecord {
  email: string;
  status: SubscriberStatus;
  consent: boolean;
  source: string | null;
}

export type ApplicationStatus = "new" | "reviewing" | "shortlisted" | "rejected";

export interface JobApplication extends BaseRecord {
  job_id: ID | null;
  position: string;
  name: string;
  email: string;
  phone: string | null;
  message: string | null;
  resume_path: string | null;
  resume_name: string | null;
  status: ApplicationStatus;
}

/** Editable website settings (key/value pairs stored in the database). */
export interface SiteSettings {
  company_description: string;
  tagline: string;
  phone: string;
  email: string;
  whatsapp_number: string;
  address: string;
  business_hours: string;
  social_linkedin: string;
  social_instagram: string;
  social_facebook: string;
  social_x: string;
  calendly_url: string;
  hero_label: string;
  hero_heading: string;
  hero_description: string;
  hero_primary_cta: string;
  hero_secondary_cta: string;
  /** Client-approved highlight figures. Empty means "do not show numbers". */
  highlights: HighlightStat[];
}

export interface HighlightStat {
  label: string;
  value: number;
  suffix?: string;
}

export type CollectionName =
  | "services"
  | "partners"
  | "testimonials"
  | "faqs"
  | "posts"
  | "jobs"
  | "contact_submissions"
  | "newsletter_subscribers"
  | "job_applications";

export interface AdminUser {
  id: ID;
  email: string;
  name: string | null;
  created_at: string;
}
