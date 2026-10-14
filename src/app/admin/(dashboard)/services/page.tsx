import Link from "next/link";
import { requireAdmin } from "@/lib/auth/session";

import {
  deleteServiceAction,
  saveServiceAction,
  toggleServiceAction,
} from "@/app/admin/actions";
import { AdminForm, type AdminField } from "@/components/admin/admin-form";
import { ConfirmSubmit } from "@/components/admin/confirm-submit";
import { AdminPageHeader, AdminPanel, StatusPill } from "@/components/admin/ui";
import { buttonClasses } from "@/components/ui/button";
import { ServiceIcon } from "@/components/ui/service-icon";
import { db } from "@/lib/db";

const iconOptions = [
  "users",
  "wallet",
  "shield-check",
  "target",
  "heart-handshake",
  "graduation-cap",
].map((value) => ({ value, label: value }));

export default async function AdminServicesPage({
  searchParams,
}: {
  searchParams: Promise<{ edit?: string }>;
}) {
  await requireAdmin();
  const { edit } = await searchParams;
  const services = await db.listServices();
  const editing =
    edit && edit !== "new" ? services.find((item) => item.id === edit) ?? null : null;

  const fields: AdminField[] = [
    { name: "title", label: "Title", required: true, defaultValue: editing?.title },
    {
      name: "slug",
      label: "Slug",
      hint: "Leave blank to generate one from the title",
      defaultValue: editing?.slug,
    },
    {
      name: "icon",
      label: "Icon",
      type: "select",
      options: iconOptions,
      defaultValue: editing?.icon ?? "users",
    },
    {
      name: "order_index",
      label: "Display order",
      type: "number",
      defaultValue: editing?.order_index ?? services.length + 1,
    },
    {
      name: "summary",
      label: "Summary",
      type: "textarea",
      rows: 3,
      fullWidth: true,
      hint: "One or two sentences shown on cards and listings.",
      defaultValue: editing?.summary,
    },
    {
      name: "description",
      label: "Description",
      type: "textarea",
      rows: 12,
      required: true,
      fullWidth: true,
      hint: "Supports ## headings, - bullet lists, and **bold** text.",
      defaultValue: editing?.description,
    },
    {
      name: "image_url",
      label: "Image URL",
      type: "url",
      fullWidth: true,
      hint: "Optional. Leave blank to use the icon only.",
      defaultValue: editing?.image_url,
    },
    {
      name: "published",
      label: "Published",
      type: "checkbox",
      hint: "Show this service on the website",
      defaultValue: editing?.published ?? true,
    },
  ];

  return (
    <>
      <AdminPageHeader
        title="Services"
        description="The services listed on the website. Changes appear on the public site immediately."
      />

      <AdminPanel title={editing ? `Edit service: ${editing.title}` : "Add a service"}>
        <AdminForm
          action={saveServiceAction}
          fields={fields}
          hidden={editing ? [{ name: "id", value: editing.id }] : undefined}
          submitLabel={editing ? "Save changes" : "Create service"}
          cancelHref={editing ? "/admin/services" : undefined}
        />
      </AdminPanel>

      <AdminPanel title={`All services (${services.length})`} className="mt-6">
        {services.length === 0 ? (
          <p className="text-sm text-muted">No services yet.</p>
        ) : (
          <ul className="divide-y divide-line">
            {services.map((service) => (
              <li
                key={service.id}
                className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyprus/8 text-cyprus">
                    <ServiceIcon name={service.icon} className="h-5 w-5" />
                  </span>
                  <div className="min-w-0">
                    <p className="truncate font-medium text-cyprus">{service.title}</p>
                    <p className="truncate text-xs text-muted">
                      /{service.slug} · order {service.order_index}
                    </p>
                  </div>
                </div>
                <div className="flex shrink-0 flex-wrap items-center gap-2">
                  <StatusPill tone={service.published ? "positive" : "muted"}>
                    {service.published ? "Published" : "Draft"}
                  </StatusPill>
                  <Link
                    href={`/admin/services?edit=${service.id}`}
                    className={buttonClasses("ghost", "sm")}
                  >
                    Edit
                  </Link>
                  <form action={toggleServiceAction}>
                    <input type="hidden" name="id" value={service.id} />
                    <button type="submit" className={buttonClasses("secondary", "sm")}>
                      {service.published ? "Unpublish" : "Publish"}
                    </button>
                  </form>
                  <form action={deleteServiceAction}>
                    <input type="hidden" name="id" value={service.id} />
                    <ConfirmSubmit
                      confirmMessage={`Delete "${service.title}"? This cannot be undone.`}
                      className={buttonClasses("ghost", "sm", "text-red-700 hover:bg-red-50")}
                    >
                      Delete
                    </ConfirmSubmit>
                  </form>
                </div>
              </li>
            ))}
          </ul>
        )}
      </AdminPanel>
    </>
  );
}
