-- ---------------------------------------------------------------------------
-- Supportive HR Solutions — service groups and additional business services
--
-- Run this ONCE in the connected Supabase project's SQL Editor (or via
-- `supabase db push`) AFTER 0001_init.sql and 0002_seed_initial_content.sql
-- have been applied.
--
-- What it does
--   1. Adds `public.services.service_group` so every service belongs to one
--      of the two groups shown on the public services page:
--        'hr'       — Human Resources Solutions
--        'business' — Business & Workforce Support Services
--      Existing rows keep their current content and are placed in 'hr'.
--   2. Inserts the four additional business services.
--   3. Updates the seeded hero eyebrow to the new wording — but only while it
--      still holds the previously seeded value.
--
-- Safety guarantees
--   * Additive: no table is dropped, recreated, or truncated. The already
--     applied migrations 0001/0002 are left untouched.
--   * Idempotent: running it more than once will NOT create duplicates and
--     will NOT fail on an existing column or constraint.
--   * Non-destructive: admin edits are preserved.
--     - Services are keyed by their UNIQUE `slug`; `on conflict (slug) do
--       nothing` keeps an edited row exactly as the dashboard left it.
--     - The hero label is only replaced when it still contains the value
--       written by 0002_seed_initial_content.sql.
--   * No testimonials, statistics, certifications, staffing numbers, or
--     round-the-clock availability claims are seeded — see src/lib/seed.ts.
--
-- NOTE on the column name: `group` is a reserved word in PostgreSQL, so the
-- column is called `service_group`. The app maps it to the `group` field of
-- the Service type (see src/lib/db/supabase.ts).
-- ---------------------------------------------------------------------------

-- ------------------------------------------------------------------- groups
alter table public.services
  add column if not exists service_group text not null default 'hr';

-- Keep the two known groups (added only when the constraint is missing).
do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'services_service_group_check'
  ) then
    alter table public.services
      add constraint services_service_group_check
      check (service_group in ('hr', 'business'));
  end if;
end $$;

-- Any row created before this migration belongs to the core HR group.
update public.services
set service_group = 'hr'
where service_group is null;

-- --------------------------------------------- additional business services
insert into public.services
  (slug, title, summary, description, icon, service_group, published, order_index)
values
  (
    'website-design-and-development',
    'Website Design & Development',
    'Professional business websites and digital solutions tailored to company requirements.',
    E'## Websites that work for your business\n\nA business website should make it easy for a visitor to understand what you do and to get in touch. We design and build clear, professional websites around the requirements your company actually has — the pages you need, the content you can maintain, and the devices your customers use.\n\n## What we cover\n\n- **Requirement gathering** — agreeing the pages, sections, and calls to action the site needs to do its job.\n- **Design and build** — clean, responsive layouts that load quickly and read well on mobile and desktop.\n- **Content structure** — wording and structure that make your services easy to understand.\n- **Handover** — a site your team can update, plus a short walkthrough.\n\n## Built to your brief\n\nWe work from your requirements rather than a fixed template. Where a project needs something outside standard web development — a particular integration, a third-party tool, or unusual functionality — we say so clearly before work starts.',
    'globe', 'business', true, 7
  ),
  (
    'loading-and-unloading-services',
    'Loading & Unloading Services',
    'Workforce support for loading, unloading, and related material-handling operations.',
    E'## Hands-on support where the work happens\n\nLoading and unloading is physical, detail-sensitive work, and it needs people who turn up prepared. We provide workforce support for loading, unloading, and related material-handling operations, scoped to what your site and workflow actually require.\n\n## Where we can help\n\n- **Loading and unloading** — support for moving goods in and out of vehicles, stores, and work areas.\n- **Material handling** — moving, stacking, and organising materials within your premises.\n- **Site coordination** — working to your site''s access, timing, and safety arrangements.\n- **Additional hands** — extra personnel for busy periods, seasonal volumes, or project work.\n\n## Scoped to your operation\n\nThe exact scope is agreed with you before anything is scheduled — who does what, where, and when. We do not offer services outside the areas our team is set up to deliver.',
    'truck', 'business', true, 8
  ),
  (
    'security-services',
    'Security Services',
    'Security personnel and related support for your business premises.',
    E'## Security support for your site\n\nGood security is about the right people being present, attentive, and professional. We provide security personnel and related support for business premises, working to the arrangements you already have in place.\n\n## Where we can help\n\n- **On-site security personnel** — deputing staff to your premises to cover the roles and shifts you have agreed.\n- **Access and visitor support** — helping with entry control and directing visitors on arrival.\n- **Site presence and reporting** — staff who are on site and able to report issues as they arise.\n- **Event and short-term support** — additional personnel for events, audits, or temporary assignments.\n\n## Deployed to your arrangements\n\nDeployed personnel work to your site''s policies, access rules, and reporting lines. Where a particular assignment carries its own licensing, training, or certification requirements, we confirm these with you in advance so the cover provided matches what the role requires.',
    'shield', 'business', true, 9
  ),
  (
    'housekeeping-services',
    'Housekeeping Services',
    'Housekeeping and workplace-maintenance support for business premises.',
    E'## Premises that stay presentable\n\nHousekeeping is what visitors notice first and what staff live with every day. We support business premises with routine housekeeping and workplace-maintenance tasks, scheduled around how your teams actually work.\n\n## Where we can help\n\n- **Routine cleaning** — desks, floors, washrooms, kitchens, and shared areas.\n- **Meeting and client areas** — resetting spaces so they are ready for the next visitor.\n- **Waste management** — collecting and disposing of general waste responsibly.\n- **Periodic and deep cleaning** — scheduled deeper cleans and higher-level maintenance support.\n\n## Arranged around your working day\n\nSchedules are planned around your opening hours and footfall so housekeeping does not interrupt your teams. Consumables, equipment, and specific site requirements are agreed up front so the service is straightforward to review and adjust.',
    'sparkles', 'business', true, 10
  )
on conflict (slug) do nothing;

-- -------------------------------------------------------------- hero eyebrow
-- Only the previously seeded value is replaced; an admin edit always wins.
update public.site_settings
set data = jsonb_set(
      data,
      '{hero_label}',
      '"ONE PARTNER FOR YOUR ENTIRE WORKFORCE"'::jsonb,
      true
    ),
    updated_at = now()
where id = 'singleton'
  and data->>'hero_label' = 'HR SOLUTIONS FOR A BETTER WORKPLACE';
