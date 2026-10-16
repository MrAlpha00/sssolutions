-- ---------------------------------------------------------------------------
-- Supportive HR Solutions — initial content seed
--
-- Run this ONCE in the connected Supabase project's SQL Editor (or via
-- `supabase db push`) AFTER 0001_init.sql has been applied.
--
-- Why this file exists
--   `src/lib/seed.ts` only feeds the local JSON fallback store. When
--   NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY are configured
--   (production), the app reads from these tables instead — which were empty.
--
-- Safety guarantees
--   * Idempotent: running it more than once will NOT create duplicates.
--   * Non-destructive: existing rows are never dropped, updated, or reset.
--     Admin edits made before this migration are preserved.
--     - services/posts are keyed by their UNIQUE `slug`.
--       `on conflict (slug) do nothing` keeps admin-edited rows untouched.
--     - partners/faqs have no unique business key, so each insert is guarded
--       by an existence check on the exact name/question.
--     - site_settings defaults are written ONLY while the singleton document
--       is still empty (`data = '{}'::jsonb`), so any admin edit wins.
--   * No testimonials, statistics, jobs, or certifications are seeded —
--     only genuine client-supplied content (see src/lib/seed.ts).
-- ---------------------------------------------------------------------------

-- --------------------------------------------------------------------- services
insert into public.services
  (slug, title, summary, description, icon, published, order_index)
values
  (
    'recruitment-and-staffing',
    'Recruitment & Staffing',
    'Find and hire the right people with structured, role-focused recruitment support.',
    E'## Hiring that fits the role and the team\n\nRecruitment works best when it is structured, transparent, and aligned to how your business actually operates. We partner with you to understand the role, define what good looks like, and run a clear hiring process from first contact to offer.\n\n## How we support you\n\n- **Role and requirement definition** — turning a business need into a clear role brief and success profile.\n- **Sourcing and screening** — shortlisting candidates against agreed criteria, with structured notes you can rely on.\n- **Interview coordination** — scheduling, communication, and candidate experience.\n- **Offers and onboarding support** — helping new joiners start well.\n\n## Designed around your business\n\nEvery organisation hires differently. We adapt the process to your timelines, budget, and internal capacity rather than applying a single fixed template.',
    'users', true, 1
  ),
  (
    'payroll-and-benefits',
    'Payroll & Benefits',
    'Accurate, on-time payroll processing and benefits administration your people can trust.',
    E'## Payroll people can rely on\n\nPayroll is one of the most visible promises a company makes to its employees. We help you process payroll accurately and on time, keep records in order, and communicate clearly with your team.\n\n## What we help with\n\n- Payroll inputs, validation, and processing support\n- Payslips, summaries, and record keeping\n- Statutory and benefits administration support\n- Query handling for employee payroll questions\n\n## Clarity and confidentiality\n\nPayroll data is sensitive. Access is handled carefully, with clear approval steps and confidential handling of employee information throughout the cycle.',
    'wallet', true, 2
  ),
  (
    'hr-compliance-management',
    'HR Compliance Management',
    'Practical support to keep your HR policies, records, and processes in good order.',
    E'## Keep your HR house in order\n\nCompliance is less about paperwork and more about having dependable practices. We help you put the right policies, records, and processes in place and keep them current as your team grows.\n\n## Where we help\n\n- HR policy and handbook structure\n- Employee records and documentation practices\n- Process checklists for key HR activities\n- Support preparing for internal or external reviews\n\n## Support, not legal advice\n\nWe help you organise and maintain HR practices. Where something requires the judgement of a lawyer or specialist adviser, we will say so clearly rather than guess.',
    'shield-check', true, 3
  ),
  (
    'performance-management',
    'Performance Management',
    'Simple performance frameworks that help managers have better, more regular conversations.',
    E'## Performance that is fair and useful\n\nGood performance management is not an annual form. It is a set of habits: clear expectations, regular feedback, and fair, consistent review. We help you build a lightweight system people actually use.\n\n## How we help\n\n- Defining roles, goals, and expectations\n- Designing review and feedback cycles\n- Giving managers practical tools and templates\n- Supporting performance conversations\n\n## Built to be used\n\nWe favour simple, repeatable processes over heavy systems that quietly get abandoned after the first cycle.',
    'target', true, 4
  ),
  (
    'employee-engagement',
    'Employee Engagement',
    'Understand what your people think and act on it with targeted, practical initiatives.',
    E'## People who feel heard stay longer\n\nEngagement improves when employees believe their experience matters and that feedback leads somewhere. We help you listen well and turn that insight into action.\n\n## What we do\n\n- Designing and running engagement surveys\n- Facilitating feedback sessions and focus groups\n- Turning results into a short, realistic action plan\n- Supporting recognition and wellbeing initiatives\n\n## Insight into action\n\nA survey that does not lead to change can do more harm than good. Our focus is on helping you act on what you learn.',
    'heart-handshake', true, 5
  ),
  (
    'training-and-development',
    'Training & Development',
    'Build manager and team capability with targeted, practical learning support.',
    E'## Grow the skills your business needs\n\nThe right training closes a real gap. We help you identify where capability needs strengthening and deliver learning that is practical and relevant.\n\n## Areas we support\n\n- Manager and people-leadership development\n- Communication and feedback skills\n- Induction and onboarding programmes\n- Team workshops tailored to your context\n\n## Practical by design\n\nSessions are built around your examples and challenges, so people leave with something they can apply the same week.',
    'graduation-cap', true, 6
  )
on conflict (slug) do nothing;

-- --------------------------------------------------------------------- partners
-- The sixteen client-supplied partner names (see src/lib/seed.ts). Guarded by
-- an existence check on the exact name so re-running is safe and admin edits
-- are never overwritten.
insert into public.partners (name, visible, order_index)
select v.name, true, v.ord
from (values
  ('WMER Minerals', 1),
  ('Jodidar Accretions', 2),
  ('Big Basket', 3),
  ('Texport Industries Pvt. Ltd.', 4),
  ('Hypermarket', 5),
  ('Shashi Distilleries Private Limited', 6),
  ('Intelligent Retail Pvt. Ltd.', 7),
  ('Indwell Retail Pvt. Ltd.', 8),
  ('IP Integrated Services Pvt. Ltd.', 9),
  ('Metro Cash and Carry', 10),
  ('Adishwar Delivery', 11),
  ('Redhood Logistics Private Limited', 12),
  ('Fresh Zone Farms', 13),
  ('Speedlink Service', 14),
  ('CNR Chemicals', 15),
  ('Himalaya', 16)
) as v(name, ord)
where not exists (
  select 1 from public.partners p where p.name = v.name
);

-- -------------------------------------------------------------------------- faqs
insert into public.faqs (question, answer, category, published, order_index)
select v.question, v.answer, v.category, true, v.ord
from (values
  (
    'What HR services does Supportive HR Solutions provide?',
    'We support recruitment and staffing, payroll and benefits, HR compliance management, performance management, employee engagement, and training and development. Engagements can be a single project or ongoing support.',
    'Services', 1
  ),
  (
    'How can a business request recruitment support?',
    'Share the role you are hiring for using our contact form or book a consultation. We will discuss the requirements, timelines, and how you would like the process to run before agreeing next steps.',
    'Recruitment', 2
  ),
  (
    'How can a company enquire about payroll or HR consulting?',
    'Use the contact form on this site, email us, or call the office. Tell us a little about your team size and what you need help with, and we will get back to you to understand the scope.',
    'Consulting', 3
  ),
  (
    'How can a client book a consultation?',
    E'Use any \u201cBook a Consultation\u201d button to open our scheduling calendar, or send an enquiry and we will arrange a convenient time to speak.',
    'Consultations', 4
  ),
  (
    'How can someone contact the company?',
    'You can reach us by phone, email, or WhatsApp, or by using the contact form on the Contact Us page. Our office address is listed in the footer.',
    'General', 5
  )
) as v(question, answer, category, ord)
where not exists (
  select 1 from public.faqs f where f.question = v.question
);

-- ------------------------------------------------------------------------- posts
-- The two starter HR articles already used by the local store and the fuller
-- reference deployment.
insert into public.posts
  (slug, title, category, summary, content, cover_image_url, author,
   published_at, seo_title, seo_description, published, order_index)
values
  (
    'five-signs-your-hiring-process-needs-a-reset',
    'Five signs your hiring process needs a reset',
    'Recruitment',
    'Slow, inconsistent hiring costs good candidates and manager time. Here are five signs it is time to rethink your process.',
    E'A hiring process is only as good as the experience it creates — for candidates and for the managers doing the hiring. When it starts to slip, the warning signs are usually visible long before offers are declined.\n\n## 1. Roles are re-briefed every time\n\nIf each interviewer is working from a different idea of what the role needs, alignment is missing. A short, written role brief fixes most of this.\n\n## 2. Feedback arrives late or never\n\nCandidates remember silence longer than rejection. A simple rule — feedback within a set number of days — protects your employer brand.\n\n## 3. The same interview happens twice\n\nRepetitive interviews signal a process that has not been designed. Map the stages so each one answers a different question.\n\n## 4. Managers are screening without support\n\nGood screening takes practice. Give managers a structured set of criteria and questions rather than asking them to improvise.\n\n## 5. Nobody measures the funnel\n\nTrack time-to-hire, drop-off at each stage, and offer acceptance. What you measure is what you can improve.\n\n## Where to start\n\nPick one stage and improve it properly. Small, consistent fixes outperform a full redesign you never finish.',
    null, null,
    '2026-01-05T00:00:00.000Z',
    'Five signs your hiring process needs a reset',
    'Slow, inconsistent hiring costs good candidates and manager time. Five signs your recruitment process is ready for a reset.',
    true, 1
  ),
  (
    'making-performance-reviews-worth-the-time',
    'Making performance reviews worth the time',
    'Performance',
    'Reviews fail when they are annual, one-directional, and disconnected from day-to-day work. Here is a lighter approach.',
    E'Most people can recall a performance review that felt pointless. Usually the problem is not the form — it is the rhythm around it.\n\n## Make feedback regular\n\nIf the first detailed feedback an employee receives is at the annual review, the review is doing too much work. Short, regular check-ins take the pressure off both sides.\n\n## Separate development from evaluation\n\nConversations about growth and conversations about rating are different. Mixing them makes people defensive and less open.\n\n## Be specific\n\n"Good communication" is hard to act on. "You kept the client informed during the delay, which avoided escalation" is something a person can repeat.\n\n## Prepare both sides\n\nGive employees the questions in advance. A review should be a discussion, not an ambush.\n\n## Close the loop every time\n\nEvery review should end with two or three specific, agreed actions — and a date to revisit them.',
    null, null,
    '2026-01-12T00:00:00.000Z',
    'Making performance reviews worth the time',
    'Reviews fail when they are annual and one-directional. A lighter, more useful approach to performance management.',
    true, 2
  )
on conflict (slug) do nothing;

-- -------------------------------------------------------------- site settings
-- Write the default public settings ONLY while the singleton document is
-- still empty. Any value an administrator has already saved in the dashboard
-- is preserved (the `where` clause skips the update entirely).
insert into public.site_settings (id, data)
values (
  'singleton',
  jsonb_build_object(
    'company_description',
      'Supportive HR Solutions is a Bengaluru-based HR services company helping businesses attract talent, manage payroll and compliance, and build stronger, more engaged workplaces.',
    'tagline', 'People • Performance • Progress',
    'phone', '+91 98765 43210',
    'email', 'info@supportivehr.com',
    'whatsapp_number', '+91 98765 43210',
    'address', '#123, 3rd Floor, 1st Main, Koramangala, Bengaluru, Karnataka – 560034, India',
    'business_hours', '',
    'social_linkedin', '',
    'social_instagram', '',
    'social_facebook', '',
    'social_x', '',
    'calendly_url',
      'https://calendly.com/vercelsupa/30min?background_color=f0ede4&primary_color=004741',
    'hero_label', 'HR SOLUTIONS FOR A BETTER WORKPLACE',
    'hero_heading', 'Building Strong Teams. Creating Better Workplaces.',
    'hero_description',
      'Supportive HR Solutions helps businesses strengthen their workforce through recruitment, payroll support, HR compliance, employee engagement, and tailored people-management solutions.',
    'hero_primary_cta', 'Explore Our Services',
    'hero_secondary_cta', 'Book a Consultation',
    'highlights', '[]'::jsonb
  )
)
on conflict (id) do update
set data = excluded.data
where public.site_settings.data = '{}'::jsonb;
