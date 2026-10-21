import type {
  Faq,
  Partner,
  Post,
  Service,
  SiteSettings,
} from "@/lib/types";
import { siteConfig, getFormattedAddress } from "@/lib/site-config";

/**
 * Initial content used to seed the database.
 *
 * IMPORTANT
 * - Service descriptions and FAQs are editable starter copy written from the
 *   project brief. The client should review them before launch.
 * - Partner names come from the supplied client/partner collage. No logos are
 *   invented; when no logo file is available a text-based card is shown.
 * - No testimonials or statistics are seeded. Those must be supplied and
 *   approved by the client (`empty` sections show an honest empty state).
 */

const NOW = "2026-01-01T00:00:00.000Z";

export const seedServices: Service[] = [
  {
    id: "svc-recruitment",
    slug: "recruitment-and-staffing",
    title: "Recruitment & Staffing",
    summary:
      "Find and hire the right people with structured, role-focused recruitment support.",
    description: `## Hiring that fits the role and the team

Recruitment works best when it is structured, transparent, and aligned to how your business actually operates. We partner with you to understand the role, define what good looks like, and run a clear hiring process from first contact to offer.

## How we support you

- **Role and requirement definition** — turning a business need into a clear role brief and success profile.
- **Sourcing and screening** — shortlisting candidates against agreed criteria, with structured notes you can rely on.
- **Interview coordination** — scheduling, communication, and candidate experience.
- **Offers and onboarding support** — helping new joiners start well.

## Designed around your business

Every organisation hires differently. We adapt the process to your timelines, budget, and internal capacity rather than applying a single fixed template.`,
    icon: "users",
    image_url: null,
    group: "hr",
    published: true,
    order_index: 1,
    created_at: NOW,
    updated_at: NOW,
  },
  {
    id: "svc-payroll",
    slug: "payroll-and-benefits",
    title: "Payroll & Benefits",
    summary:
      "Accurate, on-time payroll processing and benefits administration your people can trust.",
    description: `## Payroll people can rely on

Payroll is one of the most visible promises a company makes to its employees. We help you process payroll accurately and on time, keep records in order, and communicate clearly with your team.

## What we help with

- Payroll inputs, validation, and processing support
- Payslips, summaries, and record keeping
- Statutory and benefits administration support
- Query handling for employee payroll questions

## Clarity and confidentiality

Payroll data is sensitive. Access is handled carefully, with clear approval steps and confidential handling of employee information throughout the cycle.`,
    icon: "wallet",
    image_url: null,
    group: "hr",
    published: true,
    order_index: 2,
    created_at: NOW,
    updated_at: NOW,
  },
  {
    id: "svc-compliance",
    slug: "hr-compliance-management",
    title: "HR Compliance Management",
    summary:
      "Practical support to keep your HR policies, records, and processes in good order.",
    description: `## Keep your HR house in order

Compliance is less about paperwork and more about having dependable practices. We help you put the right policies, records, and processes in place and keep them current as your team grows.

## Where we help

- HR policy and handbook structure
- Employee records and documentation practices
- Process checklists for key HR activities
- Support preparing for internal or external reviews

## Support, not legal advice

We help you organise and maintain HR practices. Where something requires the judgement of a lawyer or specialist adviser, we will say so clearly rather than guess.`,
    icon: "shield-check",
    image_url: null,
    group: "hr",
    published: true,
    order_index: 3,
    created_at: NOW,
    updated_at: NOW,
  },
  {
    id: "svc-performance",
    slug: "performance-management",
    title: "Performance Management",
    summary:
      "Simple performance frameworks that help managers have better, more regular conversations.",
    description: `## Performance that is fair and useful

Good performance management is not an annual form. It is a set of habits: clear expectations, regular feedback, and fair, consistent review. We help you build a lightweight system people actually use.

## How we help

- Defining roles, goals, and expectations
- Designing review and feedback cycles
- Giving managers practical tools and templates
- Supporting performance conversations

## Built to be used

We favour simple, repeatable processes over heavy systems that quietly get abandoned after the first cycle.`,
    icon: "target",
    image_url: null,
    group: "hr",
    published: true,
    order_index: 4,
    created_at: NOW,
    updated_at: NOW,
  },
  {
    id: "svc-engagement",
    slug: "employee-engagement",
    title: "Employee Engagement",
    summary:
      "Understand what your people think and act on it with targeted, practical initiatives.",
    description: `## People who feel heard stay longer

Engagement improves when employees believe their experience matters and that feedback leads somewhere. We help you listen well and turn that insight into action.

## What we do

- Designing and running engagement surveys
- Facilitating feedback sessions and focus groups
- Turning results into a short, realistic action plan
- Supporting recognition and wellbeing initiatives

## Insight into action

A survey that does not lead to change can do more harm than good. Our focus is on helping you act on what you learn.`,
    icon: "heart-handshake",
    image_url: null,
    group: "hr",
    published: true,
    order_index: 5,
    created_at: NOW,
    updated_at: NOW,
  },
  {
    id: "svc-training",
    slug: "training-and-development",
    title: "Training & Development",
    summary:
      "Build manager and team capability with targeted, practical learning support.",
    description: `## Grow the skills your business needs

The right training closes a real gap. We help you identify where capability needs strengthening and deliver learning that is practical and relevant.

## Areas we support

- Manager and people-leadership development
- Communication and feedback skills
- Induction and onboarding programmes
- Team workshops tailored to your context

## Practical by design

Sessions are built around your examples and challenges, so people leave with something they can apply the same week.`,
    icon: "graduation-cap",
    image_url: null,
    group: "hr",
    published: true,
    order_index: 6,
    created_at: NOW,
    updated_at: NOW,
  },
];

/**
 * Additional business services.
 *
 * The client confirmed the company also offers these alongside the core HR
 * services. They are kept in their own group so visitors can tell the two
 * apart. Copy stays deliberately factual — no staffing numbers, certifications,
 * round-the-clock availability, or guaranteed outcomes are claimed, because
 * none of those have been confirmed.
 */
export const seedBusinessServices: Service[] = [
  {
    id: "svc-website-design",
    slug: "website-design-and-development",
    title: "Website Design & Development",
    summary:
      "Professional business websites and digital solutions tailored to company requirements.",
    description: `## Websites that work for your business

A business website should make it easy for a visitor to understand what you do and to get in touch. We design and build clear, professional websites around the requirements your company actually has — the pages you need, the content you can maintain, and the devices your customers use.

## What we cover

- **Requirement gathering** — agreeing the pages, sections, and calls to action the site needs to do its job.
- **Design and build** — clean, responsive layouts that load quickly and read well on mobile and desktop.
- **Content structure** — wording and structure that make your services easy to understand.
- **Handover** — a site your team can update, plus a short walkthrough.

## Built to your brief

We work from your requirements rather than a fixed template. Where a project needs something outside standard web development — a particular integration, a third-party tool, or unusual functionality — we say so clearly before work starts.`,
    icon: "globe",
    image_url: null,
    group: "business",
    published: true,
    order_index: 7,
    created_at: NOW,
    updated_at: NOW,
  },
  {
    id: "svc-loading-unloading",
    slug: "loading-and-unloading-services",
    title: "Loading & Unloading Services",
    summary:
      "Workforce support for loading, unloading, and related material-handling operations.",
    description: `## Hands-on support where the work happens

Loading and unloading is physical, detail-sensitive work, and it needs people who turn up prepared. We provide workforce support for loading, unloading, and related material-handling operations, scoped to what your site and workflow actually require.

## Where we can help

- **Loading and unloading** — support for moving goods in and out of vehicles, stores, and work areas.
- **Material handling** — moving, stacking, and organising materials within your premises.
- **Site coordination** — working to your site's access, timing, and safety arrangements.
- **Additional hands** — extra personnel for busy periods, seasonal volumes, or project work.

## Scoped to your operation

The exact scope is agreed with you before anything is scheduled — who does what, where, and when. We do not offer services outside the areas our team is set up to deliver.`,
    icon: "truck",
    image_url: null,
    group: "business",
    published: true,
    order_index: 8,
    created_at: NOW,
    updated_at: NOW,
  },
  {
    id: "svc-security",
    slug: "security-services",
    title: "Security Services",
    summary:
      "Security personnel and related support for your business premises.",
    description: `## Security support for your site

Good security is about the right people being present, attentive, and professional. We provide security personnel and related support for business premises, working to the arrangements you already have in place.

## Where we can help

- **On-site security personnel** — deputing staff to your premises to cover the roles and shifts you have agreed.
- **Access and visitor support** — helping with entry control and directing visitors on arrival.
- **Site presence and reporting** — staff who are on site and able to report issues as they arise.
- **Event and short-term support** — additional personnel for events, audits, or temporary assignments.

## Deployed to your arrangements

Deployed personnel work to your site's policies, access rules, and reporting lines. Where a particular assignment carries its own licensing, training, or certification requirements, we confirm these with you in advance so the cover provided matches what the role requires.`,
    icon: "shield",
    image_url: null,
    group: "business",
    published: true,
    order_index: 9,
    created_at: NOW,
    updated_at: NOW,
  },
  {
    id: "svc-housekeeping",
    slug: "housekeeping-services",
    title: "Housekeeping Services",
    summary:
      "Housekeeping and workplace-maintenance support for business premises.",
    description: `## Premises that stay presentable

Housekeeping is what visitors notice first and what staff live with every day. We support business premises with routine housekeeping and workplace-maintenance tasks, scheduled around how your teams actually work.

## Where we can help

- **Routine cleaning** — desks, floors, washrooms, kitchens, and shared areas.
- **Meeting and client areas** — resetting spaces so they are ready for the next visitor.
- **Waste management** — collecting and disposing of general waste responsibly.
- **Periodic and deep cleaning** — scheduled deeper cleans and higher-level maintenance support.

## Arranged around your working day

Schedules are planned around your opening hours and footfall so housekeeping does not interrupt your teams. Consumables, equipment, and specific site requirements are agreed up front so the service is straightforward to review and adjust.`,
    icon: "sparkles",
    image_url: null,
    group: "business",
    published: true,
    order_index: 10,
    created_at: NOW,
    updated_at: NOW,
  },
];

const partnerNames = [
  "WMER Minerals",
  "Jodidar Accretions",
  "Big Basket",
  "Texport Industries Pvt. Ltd.",
  "Hypermarket",
  "Shashi Distilleries Private Limited",
  "Intelligent Retail Pvt. Ltd.",
  "Indwell Retail Pvt. Ltd.",
  "IP Integrated Services Pvt. Ltd.",
  "Metro Cash and Carry",
  "Adishwar Delivery",
  "Redhood Logistics Private Limited",
  "Fresh Zone Farms",
  "Speedlink Service",
  "CNR Chemicals",
  "Himalaya",
];

export const seedPartners: Partner[] = partnerNames.map((name, index) => ({
  id: `partner-${index + 1}`,
  name,
  logo_url: null,
  website_url: null,
  visible: true,
  order_index: index + 1,
  created_at: NOW,
  updated_at: NOW,
}));

export const seedFaqs: Faq[] = [
  {
    id: "faq-1",
    question: "What HR services does Supportive HR Solutions provide?",
    answer:
      "We support recruitment and staffing, payroll and benefits, HR compliance management, performance management, employee engagement, and training and development. Engagements can be a single project or ongoing support.",
    category: "Services",
    published: true,
    order_index: 1,
    created_at: NOW,
    updated_at: NOW,
  },
  {
    id: "faq-2",
    question: "How can a business request recruitment support?",
    answer:
      "Share the role you are hiring for using our contact form or book a consultation. We will discuss the requirements, timelines, and how you would like the process to run before agreeing next steps.",
    category: "Recruitment",
    published: true,
    order_index: 2,
    created_at: NOW,
    updated_at: NOW,
  },
  {
    id: "faq-3",
    question: "How can a company enquire about payroll or HR consulting?",
    answer:
      "Use the contact form on this site, email us, or call the office. Tell us a little about your team size and what you need help with, and we will get back to you to understand the scope.",
    category: "Consulting",
    published: true,
    order_index: 3,
    created_at: NOW,
    updated_at: NOW,
  },
  {
    id: "faq-4",
    question: "How can a client book a consultation?",
    answer:
      "Use any “Book a Consultation” button to open our scheduling calendar, or send an enquiry and we will arrange a convenient time to speak.",
    category: "Consultations",
    published: true,
    order_index: 4,
    created_at: NOW,
    updated_at: NOW,
  },
  {
    id: "faq-5",
    question: "How can someone contact the company?",
    answer:
      "You can reach us by phone, email, or WhatsApp, or by using the contact form on the Contact Us page. Our office address is listed in the footer.",
    category: "General",
    published: true,
    order_index: 5,
    created_at: NOW,
    updated_at: NOW,
  },
];

export const seedPosts: Post[] = [
  {
    id: "post-1",
    slug: "five-signs-your-hiring-process-needs-a-reset",
    title: "Five signs your hiring process needs a reset",
    category: "Recruitment",
    summary:
      "Slow, inconsistent hiring costs good candidates and manager time. Here are five signs it is time to rethink your process.",
    content: `A hiring process is only as good as the experience it creates — for candidates and for the managers doing the hiring. When it starts to slip, the warning signs are usually visible long before offers are declined.

## 1. Roles are re-briefed every time

If each interviewer is working from a different idea of what the role needs, alignment is missing. A short, written role brief fixes most of this.

## 2. Feedback arrives late or never

Candidates remember silence longer than rejection. A simple rule — feedback within a set number of days — protects your employer brand.

## 3. The same interview happens twice

Repetitive interviews signal a process that has not been designed. Map the stages so each one answers a different question.

## 4. Managers are screening without support

Good screening takes practice. Give managers a structured set of criteria and questions rather than asking them to improvise.

## 5. Nobody measures the funnel

Track time-to-hire, drop-off at each stage, and offer acceptance. What you measure is what you can improve.

## Where to start

Pick one stage and improve it properly. Small, consistent fixes outperform a full redesign you never finish.`,
    cover_image_url: null,
    author: null,
    published_at: "2026-01-05T00:00:00.000Z",
    seo_title: "Five signs your hiring process needs a reset",
    seo_description:
      "Slow, inconsistent hiring costs good candidates and manager time. Five signs your recruitment process is ready for a reset.",
    published: true,
    order_index: 1,
    created_at: NOW,
    updated_at: NOW,
  },
  {
    id: "post-2",
    slug: "making-performance-reviews-worth-the-time",
    title: "Making performance reviews worth the time",
    category: "Performance",
    summary:
      "Reviews fail when they are annual, one-directional, and disconnected from day-to-day work. Here is a lighter approach.",
    content: `Most people can recall a performance review that felt pointless. Usually the problem is not the form — it is the rhythm around it.

## Make feedback regular

If the first detailed feedback an employee receives is at the annual review, the review is doing too much work. Short, regular check-ins take the pressure off both sides.

## Separate development from evaluation

Conversations about growth and conversations about rating are different. Mixing them makes people defensive and less open.

## Be specific

"Good communication" is hard to act on. "You kept the client informed during the delay, which avoided escalation" is something a person can repeat.

## Prepare both sides

Give employees the questions in advance. A review should be a discussion, not an ambush.

## Close the loop every time

Every review should end with two or three specific, agreed actions — and a date to revisit them.`,
    cover_image_url: null,
    author: null,
    published_at: "2026-01-12T00:00:00.000Z",
    seo_title: "Making performance reviews worth the time",
    seo_description:
      "Reviews fail when they are annual and one-directional. A lighter, more useful approach to performance management.",
    published: true,
    order_index: 2,
    created_at: NOW,
    updated_at: NOW,
  },
];

export const defaultSettings: SiteSettings = {
  company_description: siteConfig.description,
  tagline: siteConfig.tagline,
  phone: siteConfig.phone,
  email: siteConfig.email,
  whatsapp_number: siteConfig.whatsappNumber,
  address: getFormattedAddress(),
  business_hours: "",
  social_linkedin: "",
  social_instagram: "",
  social_facebook: "",
  social_x: "",
  calendly_url: siteConfig.calendlyUrl,
  hero_label: "ONE PARTNER FOR YOUR ENTIRE WORKFORCE",
  hero_heading: "Building Strong Teams. Creating Better Workplaces.",
  hero_description:
    "Supportive HR Solutions helps businesses strengthen their workforce through recruitment, payroll support, HR compliance, employee engagement, and tailored people-management solutions.",
  hero_primary_cta: "Explore Our Services",
  hero_secondary_cta: "Book a Consultation",
  highlights: [],
};

/**
 * Hero eyebrows that earlier versions of the site seeded.
 *
 * They are treated as "never set" so the current default wins — the same
 * rule the Supabase migration `0003_service_groups_and_business_services.sql`
 * applies to the stored settings document. Anything else an admin has saved
 * is left untouched.
 */
export const LEGACY_HERO_LABELS = ["HR SOLUTIONS FOR A BETTER WORKPLACE"];
