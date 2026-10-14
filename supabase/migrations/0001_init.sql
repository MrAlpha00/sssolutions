-- ---------------------------------------------------------------------------
-- Supportive HR Solutions — initial schema
--
-- Run this in the Supabase SQL editor (or `supabase db push`) when you are
-- ready to move off the local JSON store. Once NEXT_PUBLIC_SUPABASE_URL and
-- NEXT_PUBLIC_SUPABASE_ANON_KEY are set, the app switches to this database
-- automatically — no code changes required.
--
-- Security model
--   * Row Level Security is enabled on every table.
--   * Anonymous visitors may only READ published/visible public content.
--   * Form submissions (enquiries, subscribers, applications) and site settings
--     are NOT readable by anonymous visitors.
--   * All writes happen server-side through the service-role key, which
--     bypasses RLS. There are deliberately no INSERT/UPDATE/DELETE policies
--     for the anon role.
-- ---------------------------------------------------------------------------

create extension if not exists "pgcrypto";
create extension if not exists "citext";

-- Shared updated_at trigger -------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- --------------------------------------------------------------------- services
create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  summary text not null default '',
  description text not null default '',
  icon text not null default 'users',
  image_url text,
  published boolean not null default true,
  order_index integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- --------------------------------------------------------------------- partners
create table if not exists public.partners (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  logo_url text,
  website_url text,
  visible boolean not null default true,
  order_index integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ----------------------------------------------------------------- testimonials
create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  quote text not null,
  author_name text not null,
  author_role text,
  company text,
  image_url text,
  rating integer check (rating is null or (rating >= 1 and rating <= 5)),
  visible boolean not null default true,
  order_index integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- -------------------------------------------------------------------------- faqs
create table if not exists public.faqs (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  answer text not null,
  category text,
  published boolean not null default true,
  order_index integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ------------------------------------------------------------------------- posts
create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  category text not null default 'HR Insights',
  summary text not null default '',
  content text not null default '',
  cover_image_url text,
  author text,
  published_at timestamptz,
  seo_title text,
  seo_description text,
  published boolean not null default true,
  order_index integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- -------------------------------------------------------------------------- jobs
create table if not exists public.jobs (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  location text not null default '',
  employment_type text,
  description text not null default '',
  requirements text,
  published boolean not null default true,
  order_index integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ------------------------------------------------------------ contact enquiries
create table if not exists public.contact_submissions (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null,
  phone text,
  company text,
  service_interest text,
  message text not null,
  status text not null default 'new'
    check (status in ('new', 'contacted', 'resolved')),
  email_sent boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- --------------------------------------------------------------- newsletter list
create table if not exists public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  status text not null default 'subscribed'
    check (status in ('subscribed', 'unsubscribed')),
  consent boolean not null default true,
  source text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Case-insensitive uniqueness for subscriber email addresses.
create unique index if not exists newsletter_subscribers_email_key
  on public.newsletter_subscribers (lower(email));

-- ------------------------------------------------------------- job applications
create table if not exists public.job_applications (
  id uuid primary key default gen_random_uuid(),
  job_id uuid references public.jobs (id) on delete set null,
  position text not null,
  name text not null,
  email text not null,
  phone text,
  message text,
  resume_path text,
  resume_name text,
  status text not null default 'new'
    check (status in ('new', 'reviewing', 'shortlisted', 'rejected')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- -------------------------------------------------------------- site settings
-- A single JSON document edited from the admin dashboard.
create table if not exists public.site_settings (
  id text primary key default 'singleton',
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

insert into public.site_settings (id, data)
values ('singleton', '{}'::jsonb)
on conflict (id) do nothing;

-- ------------------------------------------------------------------ timestamps
do $$
declare
  t text;
begin
  foreach t in array array[
    'services', 'partners', 'testimonials', 'faqs', 'posts', 'jobs',
    'contact_submissions', 'newsletter_subscribers', 'job_applications'
  ]
  loop
    execute format(
      'drop trigger if exists set_updated_at on public.%I', t
    );
    execute format(
      'create trigger set_updated_at before update on public.%I
       for each row execute function public.set_updated_at()', t
    );
  end loop;
end $$;

-- ------------------------------------------------------------------------- RLS
alter table public.services               enable row level security;
alter table public.partners               enable row level security;
alter table public.testimonials           enable row level security;
alter table public.faqs                   enable row level security;
alter table public.posts                  enable row level security;
alter table public.jobs                   enable row level security;
alter table public.contact_submissions    enable row level security;
alter table public.newsletter_subscribers enable row level security;
alter table public.job_applications       enable row level security;
alter table public.site_settings          enable row level security;

-- Public, read-only access to published content.
drop policy if exists "public read published services" on public.services;
create policy "public read published services"
  on public.services for select to anon, authenticated
  using (published = true);

drop policy if exists "public read visible partners" on public.partners;
create policy "public read visible partners"
  on public.partners for select to anon, authenticated
  using (visible = true);

drop policy if exists "public read visible testimonials" on public.testimonials;
create policy "public read visible testimonials"
  on public.testimonials for select to anon, authenticated
  using (visible = true);

drop policy if exists "public read published faqs" on public.faqs;
create policy "public read published faqs"
  on public.faqs for select to anon, authenticated
  using (published = true);

drop policy if exists "public read published posts" on public.posts;
create policy "public read published posts"
  on public.posts for select to anon, authenticated
  using (published = true);

drop policy if exists "public read published jobs" on public.jobs;
create policy "public read published jobs"
  on public.jobs for select to anon, authenticated
  using (published = true);

-- Everything else (submissions, subscribers, applications, settings) is
-- intentionally left without anon policies. Server-side code uses the
-- service-role key, which bypasses RLS.

-- --------------------------------------------------------------------- storage
-- Private bucket for CV / resume uploads. Resumes are streamed to signed-in
-- staff only (see `src/app/api/admin/resumes/[id]/route.ts`).
insert into storage.buckets (id, name, public)
values ('private', 'private', false)
on conflict (id) do nothing;

-- Public bucket for partner logos and article images, if you choose to upload.
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;
