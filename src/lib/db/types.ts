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
  SubmissionStatus,
  ApplicationStatus,
  SubscriberStatus,
  Testimonial,
} from "@/lib/types";

type Base = { id: ID; created_at: string; updated_at: string };
export type New<T extends Base> = Omit<T, "id" | "created_at" | "updated_at">;
export type Edit<T extends Base> = Partial<New<T>>;

export type ListOptions = { publishedOnly?: boolean; visibleOnly?: boolean };

export interface DashboardStats {
  services: number;
  testimonials: number;
  posts: number;
  faqs: number;
  jobs: number;
  partners: number;
  newEnquiries: number;
  subscribers: number;
  applications: number;
}

/**
 * Storage abstraction. Two implementations exist:
 * - `localStore` (JSON file) used before Supabase is provisioned
 * - `supabaseStore` (PostgreSQL + RLS) used in production
 *
 * Both persist real data; the public site and the admin dashboard read from
 * the same store, so admin changes are reflected on the website.
 */
export interface DataStore {
  readonly kind: "local" | "supabase";
  isWriteEnabled(): boolean;

  getSettings(): Promise<SiteSettings>;
  updateSettings(patch: Partial<SiteSettings>): Promise<SiteSettings>;

  listServices(opts?: ListOptions): Promise<Service[]>;
  getServiceBySlug(slug: string, opts?: ListOptions): Promise<Service | null>;
  getServiceById(id: ID): Promise<Service | null>;
  createService(input: New<Service>): Promise<Service>;
  updateService(id: ID, input: Edit<Service>): Promise<Service>;
  deleteService(id: ID): Promise<void>;

  listPartners(opts?: ListOptions): Promise<Partner[]>;
  createPartner(input: New<Partner>): Promise<Partner>;
  updatePartner(id: ID, input: Edit<Partner>): Promise<Partner>;
  deletePartner(id: ID): Promise<void>;

  listTestimonials(opts?: ListOptions): Promise<Testimonial[]>;
  createTestimonial(input: New<Testimonial>): Promise<Testimonial>;
  updateTestimonial(id: ID, input: Edit<Testimonial>): Promise<Testimonial>;
  deleteTestimonial(id: ID): Promise<void>;

  listFaqs(opts?: ListOptions): Promise<Faq[]>;
  createFaq(input: New<Faq>): Promise<Faq>;
  updateFaq(id: ID, input: Edit<Faq>): Promise<Faq>;
  deleteFaq(id: ID): Promise<void>;

  listPosts(opts?: ListOptions): Promise<Post[]>;
  getPostBySlug(slug: string, opts?: ListOptions): Promise<Post | null>;
  getPostById(id: ID): Promise<Post | null>;
  createPost(input: New<Post>): Promise<Post>;
  updatePost(id: ID, input: Edit<Post>): Promise<Post>;
  deletePost(id: ID): Promise<void>;

  listJobs(opts?: ListOptions): Promise<Job[]>;
  getJobById(id: ID): Promise<Job | null>;
  createJob(input: New<Job>): Promise<Job>;
  updateJob(id: ID, input: Edit<Job>): Promise<Job>;
  deleteJob(id: ID): Promise<void>;

  createContactSubmission(
    input: New<ContactSubmission>,
  ): Promise<ContactSubmission>;
  listContactSubmissions(): Promise<ContactSubmission[]>;
  updateContactStatus(
    id: ID,
    status: SubmissionStatus,
  ): Promise<ContactSubmission>;
  deleteContactSubmission(id: ID): Promise<void>;

  createSubscriber(
    input: New<NewsletterSubscriber>,
  ): Promise<NewsletterSubscriber>;
  listSubscribers(): Promise<NewsletterSubscriber[]>;
  updateSubscriberStatus(
    id: ID,
    status: SubscriberStatus,
  ): Promise<NewsletterSubscriber>;
  deleteSubscriber(id: ID): Promise<void>;

  createApplication(input: New<JobApplication>): Promise<JobApplication>;
  listApplications(): Promise<JobApplication[]>;
  getApplicationById(id: ID): Promise<JobApplication | null>;
  updateApplicationStatus(
    id: ID,
    status: ApplicationStatus,
  ): Promise<JobApplication>;
  deleteApplication(id: ID): Promise<void>;

  getStats(): Promise<DashboardStats>;
}

export class DuplicateSubscriberError extends Error {
  constructor() {
    super("This email address is already subscribed.");
    this.name = "DuplicateSubscriberError";
  }
}

export class StoreNotWritableError extends Error {
  constructor() {
    super(
      "The data store is read-only. Set SUPABASE_SERVICE_ROLE_KEY (or run without Supabase to use the local store) to enable changes.",
    );
    this.name = "StoreNotWritableError";
  }
}

export const DEFAULT_LIST_ORDER = "order_index" as const;
