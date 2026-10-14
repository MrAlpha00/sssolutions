import { Download } from "lucide-react";
import { requireAdmin } from "@/lib/auth/session";

import {
  deleteApplicationAction,
  updateApplicationStatusAction,
} from "@/app/admin/actions";
import { ConfirmSubmit } from "@/components/admin/confirm-submit";
import { AdminPageHeader, AdminPanel, StatusPill } from "@/components/admin/ui";
import { buttonClasses } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/card";
import { db } from "@/lib/db";
import { formatDate } from "@/lib/utils";

const statuses = ["new", "reviewing", "shortlisted", "rejected"] as const;

export default async function AdminApplicationsPage() {
  await requireAdmin();
  const applications = await db.listApplications();

  return (
    <>
      <AdminPageHeader
        title="Job applications"
        description="Applications submitted through the Careers page. Resumes are stored privately and only served to signed-in staff."
      />

      <AdminPanel title={`All applications (${applications.length})`}>
        {applications.length === 0 ? (
          <EmptyState
            title="No applications yet"
            description="Applications submitted through the careers page will appear here."
          />
        ) : (
          <ul className="divide-y divide-line">
            {applications.map((application) => (
              <li key={application.id} className="py-5 first:pt-0 last:pb-0">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <p className="font-medium text-cyprus">{application.name}</p>
                    <p className="text-sm text-muted">
                      <a href={`mailto:${application.email}`} className="hover:text-cyprus">
                        {application.email}
                      </a>
                      {application.phone ? ` · ${application.phone}` : ""}
                    </p>
                    <p className="mt-1 text-xs text-muted">
                      {application.position} · {formatDate(application.created_at)}
                    </p>
                  </div>
                  <div className="flex shrink-0 flex-wrap items-center gap-2">
                    <StatusPill tone={application.status === "new" ? "warning" : "muted"}>
                      {application.status}
                    </StatusPill>
                    {application.resume_path ? (
                      <a
                        href={`/api/admin/resumes/${application.id}`}
                        className={buttonClasses("secondary", "sm")}
                      >
                        <Download className="h-3.5 w-3.5" aria-hidden />
                        Resume
                      </a>
                    ) : (
                      <StatusPill tone="warning">No resume</StatusPill>
                    )}
                  </div>
                </div>

                {application.message ? (
                  <details className="mt-3 rounded-xl border border-line bg-sand px-4 py-3">
                    <summary className="cursor-pointer text-sm font-medium text-cyprus">
                      View cover note
                    </summary>
                    <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-ink">
                      {application.message}
                    </p>
                  </details>
                ) : null}

                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <form action={updateApplicationStatusAction} className="flex items-center gap-2">
                    <input type="hidden" name="id" value={application.id} />
                    <label htmlFor={`status-${application.id}`} className="sr-only">
                      Status
                    </label>
                    <select
                      id={`status-${application.id}`}
                      name="status"
                      defaultValue={application.status}
                      className="rounded-xl border border-line bg-cream px-3 py-2 text-sm text-ink focus:border-cyprus focus:outline-none"
                    >
                      {statuses.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                    <button type="submit" className={buttonClasses("secondary", "sm")}>
                      Update
                    </button>
                  </form>
                  <form action={deleteApplicationAction}>
                    <input type="hidden" name="id" value={application.id} />
                    <ConfirmSubmit
                      confirmMessage={`Delete the application from ${application.name}?`}
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
