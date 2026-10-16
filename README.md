# Supportive HR Solutions — website

A production-ready corporate website for **Supportive HR Solutions**, an HR services
company based in Bengaluru. It includes a public marketing site, a working content
management dashboard with authentication, validated public forms, spam protection,
real email delivery, and SEO.

Built with **Next.js 16 (App Router, Cache Components)**, TypeScript, Tailwind CSS v4,
Framer Motion, and Lucide icons. Supabase and Resend are supported but **optional** —
the site runs fully without them.

---

## Contents

- [Quick start](#quick-start)
- [How it works](#how-it-works)
- [Environment variables](#environment-variables)
- [The data layer](#the-data-layer)
- **Admin dashboard** — sign in, manage content, enquiries, applications
- **Forms & spam protection**
- **Integrations that need real credentials**
- [⚠️ Please confirm before launch](#-please-confirm-before-launch)
- [Deployment](#deployment)
- [Project structure](#project-structure)

---

## Quick start

```bash
npm install
cp .env.example .env.local   # optional — the site runs with no configuration
npm run dev
```

Open http://localhost:3000.

The admin dashboard is at `/admin`. In development, if no admin credentials are set
in the environment, you can sign in with:

```
admin@supportivehr.local / admin
```

> This development fallback is disabled in production. Set `ADMIN_EMAIL` and
> `ADMIN_PASSWORD_HASH` before deploying (see [Admin authentication](#admin-authentication)).

### Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | Lint with ESLint |
| `npm run hash-password "…"` | Generate an `ADMIN_PASSWORD_HASH` value |

## Tech stack

| Concern | Choice |
| --- | --- |
| Framework | Next.js 16 (App Router, React 19, Turbopack, Cache Components) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 (design tokens in `src/app/globals.css`) |
| Motion | Framer Motion (disabled under `prefers-reduced-motion`) |
| Icons | Lucide React + a few hand-drawn brand icons |
| Data | Supabase (Postgres) **or** a local JSON store — automatic |
| Email | Resend |
| Spam protection | Cloudflare Turnstile + honeypot + in-memory rate limiting |
| Scheduling | Calendly popup (optional) |

## Getting started

```bash
npm install
cp .env.example .env.local   # optional — the site runs without any env vars
npm run dev
```

Open <http://localhost:3000>. The site works immediately with **no configuration**:
it uses a local JSON data store and simply skips email/captcha until you add keys.

### Build

```bash
npm run build && npm start
```

## Configuration

All configuration is read in one place — `src/lib/env.ts` — from environment
variables. Copy `.env.example` to `.env.local` and fill in what you have.

| Variable | Required | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | production | Canonical URLs, sitemap, robots, JSON-LD |
| `NEXT_PUBLIC_SUPABASE_URL` | no | Switches the data layer to Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | no | Public Supabase key |
| `SUPABASE_SERVICE_ROLE_KEY` | for Supabase admin writes | Server-only; also used for private storage |
| `RESEND_API_KEY` | for email | Resend API key |
| `RESEND_FROM_EMAIL` | for email | Verified sender address |
| `CONTACT_TO_EMAIL` | for email | Where notifications are delivered |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | for captcha | Turnstile widget key |
| `TURNSTILE_SECRET_KEY` | for captcha | Server-side Turnstile verification |
| `NEXT_PUBLIC_CALENDLY_URL` | no | Overrides the default Calendly link (see `site-config.ts`) |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | no | Overrides the WhatsApp number |
| `ADMIN_EMAIL` | production | Admin login email |
| `ADMIN_PASSWORD_HASH` | production | `npm run hash-password "…"` |
| `ADMIN_SESSION_SECRET` | production | Random 32+ char string |

Nothing is ever scattered: company details live in `src/lib/site-config.ts` and,
once edited in the admin dashboard, in the database `SiteSettings`.

## Data layer

Two interchangeable stores implement the same interface (`src/lib/db/types.ts`):

1. **Local JSON store** (`src/lib/db/local.ts`) — used automatically when Supabase is
   not configured. Data is persisted to `.data/db.json` and resumes to
   `.data/uploads/` (both git-ignored). This is a real, persistent store — the admin
   dashboard is fully functional, not a mock.
2. **Supabase store** (`src/lib/db/supabase.ts`) — used as soon as
   `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are set.

### Moving to Supabase

1. Create a Supabase project.
2. Run `supabase/migrations/0001_init.sql` in the SQL editor. It creates all tables,
   timestamps, RLS policies (public read-only for published content only), and the
   `private` + `media` storage buckets.
3. Add the Supabase variables to `.env.local` and restart. No code changes needed.

## Admin dashboard

- **URL:** `/admin` (sign in at `/admin/login`).
- **In production**, configure `ADMIN_EMAIL`, `ADMIN_PASSWORD_HASH` and
  `ADMIN_SESSION_SECRET`. Generate the hash with `npm run hash-password "…"`.
- **In development only**, if no credentials are configured, the fallback login is
  `admin@supportivehr.local` / `admin`.

Manage services, clients/partners, testimonials, FAQs, resources, job openings,
enquiries, newsletter subscribers, job applications (with authenticated resume
download), and website settings. Changes appear on the public site immediately
(cache tags are invalidated on save).

## Forms and spam protection

Public forms (`/contact`, newsletter, `/careers` application) are processed
server-side in this order:

1. **Rate limit** — per-IP, in-memory. Replace with a shared store (e.g. Upstash)
   for multi-instance/serverless deployments (`src/lib/rate-limit.ts`).
2. **Honeypot** — a hidden field; filled submissions are silently dropped.
3. **Validation** — Zod schemas (`src/lib/validation.ts`).
4. **Turnstile verification** — skipped if not configured (never faked).
5. **Persist** — the submission is stored in the database.
5. **Email** — sent via Resend when configured; otherwise skipped and recorded
   honestly (`email_sent: false` in the admin).

## Integrations that need real credentials

| Integration | Where | What to provide |
| --- | --- | --- |
| Email (Resend) | `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `CONTACT_TO_EMAIL` | Verify a sending domain |
| Captcha | `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY` | Cloudflare Turnstile keys |
| Calendly | `src/lib/site-config.ts` (default) or `NEXT_PUBLIC_CALENDLY_URL` / admin → Settings | A working scheduling link; buttons fall back to /contact if it fails to load |
| Supabase | `NEXT_PUBLIC_SUPABASE_*`, `SUPABASE_SERVICE_ROLE_KEY` | Project URL + keys |
| Google Maps | none | Uses an embed with no API key; the address must be correct |
| Social profiles | Website settings → social URLs | Real profile URLs. Links are **hidden** until set — none are invented. |

## SEO

- Per-page metadata via `src/lib/seo.ts` (title, description, canonical, Open Graph,
  Twitter) and a generated Open Graph image.
- `sitemap.xml` and `robots.txt` are generated from live content.
- JSON-LD structured data: Organization, LocalBusiness, Service, and Article.
- `/admin` and `/api` are excluded from crawlers.

## Placeholder and unverified content — please confirm

These values were not supplied and **must be verified before launch**. They are
marked with `TODO` comments in the source.

| Item | Current value | Where |
| --- | --- | --- |
| Phone number | `+91 98765 43210` (placeholder) | `src/lib/site-config.ts` |
| Email address | `info@supportivehr.com` (unverified) | `src/lib/site-config.ts` |
| Office address | `#123, 3rd Floor, 1st Main, Koramangala, Bengaluru, Karnataka – 560034` | `src/lib/site-config.ts` |
| WhatsApp number | `+91 98765 43210` (placeholder) | settings / `site-config.ts` |
| Logo | Abstract placeholder mark | `src/components/ui/logo.tsx` |
| Client / partner names | Taken from the supplied collage — confirm permission to name them | Settings → seed |
| Testimonials | None published (honest empty state) | — |
| Highlight figures | None published (numbers hidden until verified) | Settings → Highlight figures |
| Business hours | Hidden until confirmed | Settings |
| Calendly link | Set in `src/lib/site-config.ts` (`vercelsupa/30min`) — confirm this is the intended booking calendar | `site-config.ts` / Settings |
| Managing director's email | Card email was a placeholder and is **not** used on the site | — |

No statistics, testimonials, guarantees, certifications, or partner logos were
invented at any point. Service descriptions and FAQs are editable starter copy
written from the project brief and should be reviewed by the client.

## Assets to supply

- **Logo:** replace the placeholder `<Mark />` in `src/components/ui/logo.tsx` with
  the real asset (e.g. `public/brand/logo.svg`). The current mark is a restrained
  SS monogram placeholder — the official logo has not been supplied yet.
- **Photography:** service/resource images are optional (`image_url` /
  `cover_image_url` fields). Cards are designed to work without images.
- **Open Graph image:** currently generated at build time; swap for a designed
  `public/og-image.png` if preferred.

### Photography used on the homepage

Locally stored, optimised via `next/image`. Both were downloaded from
**Unsplash** (Unsplash License — free for commercial use, no attribution
required):

| File | Original (images.unsplash.com) | Photographer |
| --- | --- | --- |
| `public/images/hero-team.jpg` | `photo-1522071820081-009f0129c71c` | Brooke Cagle |
| `public/images/about-collaboration.jpg` | `photo-1600880292203-757bb62b4baf` | — |

Replace either with client-approved photography when available — they are only
referenced from `src/app/(site)/page.tsx`.

## Deployment

1. Set `NEXT_PUBLIC_SITE_URL` to the production domain.
2. Configure the variables above in your host (e.g. Vercel project settings).
3. **If Supabase is configured**, run `supabase/migrations/0002_seed_initial_content.sql`
   once in the project's SQL Editor. It idempotently seeds services, partners,
   FAQs, articles, and default settings — `src/lib/seed.ts` only feeds the
   *local* JSON store, so without this step the production site is empty.
4. Run `npm run build` (or let the host build it).

**Filesystem note:** the local store and resume uploads are written to `.data/`,
which is ephemeral on serverless hosts. For production, use **Supabase** (the
migration includes the private storage bucket) so content and resumes persist
across instances. The resume route already streams files from the private store.

## Project structure

```
src/
  app/
    (site)/            Public pages (home, services, resources, careers, contact, legal)
    admin/             Admin dashboard (login + CRUD) and server actions
    api/               Contact, newsletter, careers, and authenticated resume download
  components/
    site/              Public site components (header, footer, forms, widgets)
    admin/             Dashboard components (nav, form builder, row actions)
    ui/                Design-system primitives (button, card, modal, accordion, …)
  lib/
    db/                Data store interface + local and Supabase implementations
    auth/              Admin session and password hashing
    site-config.ts     All company details and default copy (single source of truth)
    env.ts             Typed environment configuration (server-only)
    seo.ts, email.ts, validation.ts, turnstile.ts, uploads.ts, rate-limit.ts
supabase/migrations/   Database schema + RLS policies
scripts/               Utility scripts (password hashing)
```
