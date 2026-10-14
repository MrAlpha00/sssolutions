import Link from "next/link";
import { connection } from "next/server";

import {
  deletePartnerAction,
  savePartnerAction,
  togglePartnerAction,
} from "@/app/admin/actions";
import { AdminForm, type AdminField } from "@/components/admin/admin-form";
import { ConfirmSubmit } from "@/components/admin/confirm-submit";
import { AdminPageHeader, AdminPanel, StatusPill } from "@/components/admin/ui";
import { buttonClasses } from "@/components/ui/button";
import { db } from "@/lib/db";

export default async function AdminPartnersPage({
  searchParams,
}: {
  searchParams: Promise<{ edit?: string }>;
}) {
  await connection();
  const { edit } = await searchParams;
  const partners = await db.listPartners();
  const editing =
    edit && edit !== "new" ? partners.find((item) => item.id === edit) ?? null : null;

  const fields: AdminField[] = [
    { name: "name", label: "Client / partner name", required: true, defaultValue: editing?.name },
    {
      name: "logo_url",
      label: "Logo URL",
      type: "url",
      fullWidth: true,
      hint: "Optional. If no logo is set the name is shown as a text card.",
      defaultValue: editing?.logo_url,
    },
    {
      name: "website_url",
      label: "Website URL",
      type: "url",
      fullWidth: true,
      defaultValue: editing?.website_url,
    },
    {
      name: "order_index",
      label: "Display order",
      type: "number",
      defaultValue: editing?.order_index ?? partners.length + 1,
    },
    {
      name: "visible",
      label: "Visible",
      type: "checkbox",
      hint: "Show this name on the website",
      defaultValue: editing?.visible ?? true,
    },
  ];

  return (
    <>
      <AdminPageHeader
        title="Clients & partners"
        description="Only list organisations you have permission to name. Logos are optional — no logos are invented."
      />

      <AdminPanel title={editing ? `Edit: ${editing.name}` : "Add a client or partner"}>
        <AdminForm
          action={savePartnerAction}
          fields={fields}
          hidden={editing ? [{ name: "id", value: editing.id }] : undefined}
          submitLabel={editing ? "Save changes" : "Add to list"}
          cancelHref={editing ? "/admin/partners" : undefined}
        />
      </AdminPanel>

      <AdminPanel title={`All entries (${partners.length})`} className="mt-6">
        {partners.length === 0 ? (
          <p className="text-sm text-muted">No clients or partners added yet.</p>
        ) : (
          <ul className="divide-y divide-line">
            {partners.map((partner) => (
              <li
                key={partner.id}
                className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <p className="truncate font-medium text-cyprus">{partner.name}</p>
                  <p className="truncate text-xs text-muted">
                    {partner.logo_url ? "Logo set" : "Text card"} · order{" "}
                    {partner.order_index}
                  </p>
                </div>
                <div className="flex shrink-0 flex-wrap items-center gap-2">
                  <StatusPill tone={partner.visible ? "positive" : "muted"}>
                    {partner.visible ? "Visible" : "Hidden"}
                  </StatusPill>
                  <Link
                    href={`/admin/partners?edit=${partner.id}`}
                    className={buttonClasses("ghost", "sm")}
                  >
                    Edit
                  </Link>
                  <form action={togglePartnerAction}>
                    <input type="hidden" name="id" value={partner.id} />
                    <button type="submit" className={buttonClasses("secondary", "sm")}>
                      {partner.visible ? "Hide" : "Show"}
                    </button>
                  </form>
                  <form action={deletePartnerAction}>
                    <input type="hidden" name="id" value={partner.id} />
                    <ConfirmSubmit
                      confirmMessage={`Remove "${partner.name}"?`}
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
