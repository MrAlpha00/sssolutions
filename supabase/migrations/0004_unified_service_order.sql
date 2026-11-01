-- ---------------------------------------------------------------------------
-- Supportive HR Solutions — unified services display order
--
-- Run this ONCE in the connected Supabase project's SQL Editor (or via
-- `supabase db push`) AFTER 0001, 0002 and 0003 have been applied.
--
-- What it does
--   Puts the ten existing services into the order required for the single,
--   unified Services section:
--
--     1. Loading & Unloading Services
--     2. Housekeeping Services
--     3. Recruitment & Staffing
--     4. Payroll & Benefits
--     5. HR Compliance Management
--     6. Performance Management
--     7. Employee Engagement
--     8. Training & Development
--     9. Website Design & Development
--    10. Security Services
--
-- Safety guarantees
--   * Data-only: no table, column, constraint, or row is added or removed.
--   * Non-destructive: service content, slugs, groups, and publish state are
--     untouched; only `order_index` is updated.
--   * No duplicates: services are matched by their existing UNIQUE `slug`.
--   * Idempotent: running it more than once produces the same ordering.
--   * Missing slugs are simply skipped, so it is safe on partially seeded
--     projects.
-- ---------------------------------------------------------------------------

update public.services as service
set order_index = desired.order_index
from (
  values
    ('loading-and-unloading-services', 1),
    ('housekeeping-services',          2),
    ('recruitment-and-staffing',       3),
    ('payroll-and-benefits',           4),
    ('hr-compliance-management',       5),
    ('performance-management',         6),
    ('employee-engagement',            7),
    ('training-and-development',       8),
    ('website-design-and-development', 9),
    ('security-services',             10)
) as desired (slug, order_index)
where service.slug = desired.slug;
