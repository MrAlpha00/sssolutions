import Link from "next/link";
import { connection } from "next/server";
import { requireAdmin } from "@/lib/auth/session";

import {
  deleteJobAction,
  saveJobAction,
  toggleJobAction,
} from "@/app/admin/actions";
import { AdminForm, type AdminField } from "@/components/admin/admin-form";
import { ConfirmSubmit } from "@/components/admin/confirm-submit";
import { AdminPageHeader, AdminPanel, StatusPill } from "@/components/admin/ui";
import { buttonClasses } from "@/components/ui/button";
import { db } from "@/lib/db";

export default async function AdminJobsPage({
  searchParams,
}: {
  searchParams: Promise<{ edit?: string }>;
}) {
  await connection();
  await requireAdmin();
  const { edit } = await searchParams;
  const jobs = await db.listJobs();
  const editing =
    edit && edit !== "new" ? jobs.find((item) => item.id === edit) ?? null : null;

  const fields: AdminField[] = [
    { name: "title", label: "Role title", required: true, defaultValue: editing?.title },
    {
      name: "location",
      label: "Location",
      defaultValue: editing?.location ?? "Bengaluru, Karnataka",
    },
    {
      name: "employment_type",
      label: "Employment type",
      hint: "e.g. Full-time, Part-time, Contract",
      defaultValue: editing?.employment_type,
    },
    {
      name: "description",
      label: "Description",
      type: "textarea",
      rows: 8,
      required: true,
      fullWidth: true,
      hint: "Supports ## headings, - bullet lists, and **bold** text.",
      defaultValue: editing?.description,
    },
    {
      name: "requirements",
      label: "Requirements",
      type: "textarea",
      rows: 6,
      fullWidth: true,
      defaultValue: editing?.requirements,
    },
    {
      name: "order_index",
      label: "Display order",
      type: "number",
      defaultValue: editing?.order_index ?? jobs.length + 1,
    },
    {
      name: "published",
      label: "Published",
      type: "checkbox",
      hint: "Show this role on the careers page",
      defaultValue: editing?.published ?? true,
    },
  ];

  return (
    <>
      <AdminPageHeader
        title="Job openings"
        description="Roles shown on the Careers page. When there are no open roles the site shows an honest empty state and a general application form."
      />

      <AdminPanel title={editing ? `Edit role: ${editing.title}` : "Add an opening"}>
        <AdminForm
          action={saveJobAction}
          fields={fields}
          hidden={editing ? [{ name: "id", value: editing.id }] : undefined}
          submitLabel={editing ? "Save changes" : "Add role"}
          cancelHref={editing ? "/admin/jobs" : undefined}
        />
      </AdminPanel>

      <AdminPanel title={`All roles (${jobs.length})`} className="mt-6">
        {jobs.length === 0 ? (
          <p className="text-sm text-muted">
            No roles advertised. The careers page shows a general application form.
          </p>
        ) : (
          <ul className="divide-y divide-line">
            {jobs.map((job) => (
              <li
                key={job.id}
                className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <p className="truncate font-medium text-cyprus">{job.title}</p>
                  <p className="truncate text-xs text-muted">
                    {job.location}
                    {job.employment_type ? ` · ${job.employment_type}` : ""}
                  </p>
                </div>
                <div className="flex shrink-0 flex-wrap items-center gap-2">
                  <StatusPill tone={job.published ? "positive" : "muted"}>
                    {job.published ? "Open" : "Closed"}
                  </StatusPill>
                  <Link
                    href={`/admin/jobs?edit=${job.id}`}
                    className={buttonClasses("ghost", "sm")}
                  >
                    Edit
                  </Link>
                  <form action={toggleJobAction}>
                    <input type="hidden" name="id" value={job.id} />
                    <button type="submit" className={buttonClasses("secondary", "sm")}>
                      {job.published ? "Close" : "Reopen"}
                    </button>
                  </form>
                  <form action={deleteJobAction}>
                    <input type="hidden" name="id" value={job.id} />
                    <ConfirmSubmit
                      confirmMessage={`Delete the role "${job.title}"?`}
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
