import { connection } from "next/server";
import { requireAdmin } from "@/lib/auth/session";

import { updateSettingsAction } from "@/app/admin/actions";
import { AdminForm, type AdminField } from "@/components/admin/admin-form";
import { AdminPageHeader, AdminPanel } from "@/components/admin/ui";
import { db } from "@/lib/db";

export default async function AdminSettingsPage() {
  await connection();
  await requireAdmin();
  const settings = await db.getSettings();

  const highlightsValue = settings.highlights
    .map((item) => `${item.value}|${item.label}`)
    .join("\n");

  const fields: AdminField[] = [
    {
      name: "company_description",
      label: "Company description",
      type: "textarea",
      rows: 3,
      fullWidth: true,
      hint: "Used in the footer, metadata, and structured data.",
      defaultValue: settings.company_description,
    },
    { name: "tagline", label: "Tagline", fullWidth: true, defaultValue: settings.tagline },
    { name: "phone", label: "Phone", defaultValue: settings.phone },
    { name: "email", label: "Email", type: "email", defaultValue: settings.email },
    { name: "whatsapp_number", label: "WhatsApp number", defaultValue: settings.whatsapp_number },
    {
      name: "business_hours",
      label: "Business hours",
      hint: "Leave blank to hide. Example: Mon–Sat, 9:30am–6:30pm",
      defaultValue: settings.business_hours,
    },
    {
      name: "address",
      label: "Office address",
      type: "textarea",
      rows: 2,
      fullWidth: true,
      defaultValue: settings.address,
    },
    { name: "social_linkedin", label: "LinkedIn URL", type: "url", defaultValue: settings.social_linkedin },
    { name: "social_instagram", label: "Instagram URL", type: "url", defaultValue: settings.social_instagram },
    { name: "social_facebook", label: "Facebook URL", type: "url", defaultValue: settings.social_facebook },
    { name: "social_x", label: "X (Twitter) URL", type: "url", defaultValue: settings.social_x },
    {
      name: "calendly_url",
      label: "Calendly URL",
      type: "url",
      fullWidth: true,
      hint: "When set, “Book a Consultation” opens the Calendly popup. Leave blank to send visitors to the contact page instead.",
      defaultValue: settings.calendly_url,
    },
    {
      name: "hero_label",
      label: "Hero eyebrow",
      fullWidth: true,
      defaultValue: settings.hero_label,
    },
    {
      name: "hero_heading",
      label: "Hero heading",
      fullWidth: true,
      defaultValue: settings.hero_heading,
    },
    {
      name: "hero_description",
      label: "Hero description",
      type: "textarea",
      rows: 3,
      fullWidth: true,
      defaultValue: settings.hero_description,
    },
    {
      name: "hero_primary_cta",
      label: "Hero primary button label",
      defaultValue: settings.hero_primary_cta,
    },
    {
      name: "hero_secondary_cta",
      label: "Hero secondary button label",
      defaultValue: settings.hero_secondary_cta,
    },
    {
      name: "highlights",
      label: "Highlight figures",
      type: "textarea",
      rows: 4,
      fullWidth: true,
      hint: "One per line, formatted as value|label (for example: 250|Placements). Leave empty to hide figures entirely — only add verified numbers.",
      defaultValue: highlightsValue,
    },
  ];

  return (
    <>
      <AdminPageHeader
        title="Website settings"
        description="Company details and homepage copy. These values override the built-in defaults across the public website."
      />
      <AdminPanel>
        <AdminForm
          action={updateSettingsAction}
          fields={fields}
          submitLabel="Save settings"
        />
      </AdminPanel>
    </>
  );
}
