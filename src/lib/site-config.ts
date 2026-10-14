/**
 * Single source of truth for public company information and default site copy.
 *
 * Rules:
 * - Do NOT scatter company details across components — read them from here.
 * - Public values may be overridden by editable "website settings" stored in
 *   the database (see `lib/content.ts`). This file provides the defaults and
 *   the values used where no database record exists yet.
 * - Social URLs that are not configured must stay `null` so the UI can hide
 *   them instead of linking to a fabricated account.
 */

export type SocialLink = {
  key: "linkedin" | "instagram" | "facebook" | "x" | "youtube";
  label: string;
  url: string | null;
};

export const siteConfig = {
  name: "Supportive HR Solutions",
  shortName: "Supportive HR",
  tagline: "People • Performance • Progress",
  domain: "https://www.supportivehrsolutions.com",
  description:
    "Supportive HR Solutions is a Bengaluru-based HR services company helping businesses attract talent, manage payroll and compliance, and build stronger, more engaged workplaces.",

  phone: "+91 98765 43210",
  phoneHref: "tel:+919876543210",
  email: "info@supportivehr.com", // TODO(client): confirm the real mailbox before launch.

  address: {
    line1: "#123, 3rd Floor, 1st Main",
    line2: "Koramangala",
    city: "Bengaluru",
    state: "Karnataka",
    postalCode: "560034",
    country: "India",
  },

  // Digits only, including country code. Used for WhatsApp deep links.
  whatsappNumber: "+91 98765 43210",

  // Calendly scheduling URL used by every "Book a Consultation" CTA.
  // The query string applies the brand colours: Sand #F0EDE4 background,
  // Cyprus #004741 primary. Override via NEXT_PUBLIC_CALENDLY_URL or the admin
  // dashboard (Website settings → Calendly); leave blank to send visitors to
  // the contact page instead.
  calendlyUrl:
    "https://calendly.com/vercelsupa/30min?background_color=f0ede4&primary_color=004741" as string,

  managingDirector: "Shamasundar K N",

  // Optional social profiles. Leave null when the client has not supplied one.
  social: {
    linkedin: null,
    instagram: null,
    facebook: null,
    x: null,
    youtube: null,
  } as Record<SocialLink["key"], string | null>,

  // Business hours: only publish after the client confirms them.
  businessHours: null as string | null,

  cta: {
    primary: "Book a Consultation",
    secondary: "Explore Our Services",
  },
} as const;

export function getFormattedAddress(): string {
  const a = siteConfig.address;
  return `${a.line1}, ${a.line2}, ${a.city}, ${a.state} – ${a.postalCode}, ${a.country}`;
}

export function getShortAddress(): string {
  const a = siteConfig.address;
  return `${a.line1}, ${a.line2}, ${a.city} – ${a.postalCode}`;
}

export const socialLabels: Record<SocialLink["key"], string> = {
  linkedin: "LinkedIn",
  instagram: "Instagram",
  facebook: "Facebook",
  x: "X (Twitter)",
  youtube: "YouTube",
};

/** Primary navigation. Items with `href` starting with `#` are homepage anchors. */
export const mainNav = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/#about" },
  { label: "Services", href: "/services" },
  { label: "Why Choose Us", href: "/#why-choose-us" },
  { label: "Clients / Partners", href: "/#clients" },
  { label: "Testimonials", href: "/#testimonials" },
  { label: "Resources", href: "/resources" },
  { label: "Contact Us", href: "/contact" },
] as const;

export const footerServiceLinks = [
  { label: "Recruitment & Staffing", href: "/services/recruitment-and-staffing" },
  { label: "Payroll & Benefits", href: "/services/payroll-and-benefits" },
  { label: "HR Compliance", href: "/services/hr-compliance-management" },
  { label: "Performance Management", href: "/services/performance-management" },
  { label: "Employee Engagement", href: "/services/employee-engagement" },
  { label: "Training & Development", href: "/services/training-and-development" },
] as const;

export const footerQuickLinks = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/#about" },
  { label: "Services", href: "/services" },
  { label: "Why Choose Us", href: "/#why-choose-us" },
  { label: "Clients / Partners", href: "/#clients" },
  { label: "Testimonials", href: "/#testimonials" },
  { label: "Contact Us", href: "/contact" },
] as const;

export const footerResourceLinks = [
  { label: "HR Insights", href: "/resources" },
  { label: "FAQs", href: "/#faq" },
  { label: "Careers", href: "/careers" },
  { label: "Contact", href: "/contact" },
] as const;

export const WHATSAPP_DEFAULT_MESSAGE =
  "Hello Supportive HR Solutions, I would like to know more about your HR services.";
