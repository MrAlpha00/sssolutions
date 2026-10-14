import { connection } from "next/server";
import { requireAdmin } from "@/lib/auth/session";

import {
  deleteContactAction,
  updateContactStatusAction,
} from "@/app/admin/actions";
import { ConfirmSubmit } from "@/components/admin/confirm-submit";
import { AdminPageHeader, AdminPanel, StatusPill } from "@/components/admin/ui";
import { buttonClasses } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/card";
import { db } from "@/lib/db";
import { formatDate } from "@/lib/utils";

const statuses = ["new", "contacted", "resolved"] as const;

export default async function AdminEnquiriesPage() {
  await connection();
  await requireAdmin();
  const enquiries = await db.listContactSubmissions();

  return (
    <>
      <AdminPageHeader
        title="Enquiries"
        description="Messages submitted through the website contact form."
      />

      <AdminPanel title={`All enquiries (${enquiries.length})`}>
        {enquiries.length === 0 ? (
          <EmptyState
            title="No enquiries yet"
            description="Messages submitted through the contact form will appear here."
          />
        ) : (
          <ul className="divide-y divide-line">
            {enquiries.map((enquiry) => (
              <li key={enquiry.id} className="py-5 first:pt-0 last:pb-0">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <p className="font-medium text-cyprus">{enquiry.full_name}</p>
                    <p className="text-sm text-muted">
                      <a href={`mailto:${enquiry.email}`} className="hover:text-cyprus">
                        {enquiry.email}
                      </a>
                      {enquiry.phone ? ` · ${enquiry.phone}` : ""}
                    </p>
                    {enquiry.company || enquiry.service_interest ? (
                      <p className="mt-1 text-xs text-muted">
                        {[enquiry.company, enquiry.service_interest]
                          .filter(Boolean)
                          .join(" · ")}
                      </p>
                    ) : null}
                  </div>
                  <div className="flex shrink-0 flex-wrap items-center gap-2">
                    <StatusPill tone={enquiry.status === "new" ? "warning" : "muted"}>
                      {enquiry.status}
                    </StatusPill>
                    {enquiry.email_sent ? (
                      <StatusPill tone="positive">Emailed</StatusPill>
                    ) : (
                      <StatusPill tone="warning">Email not sent</StatusPill>
                    )}
                    <span className="text-xs text-muted">
                      {formatDate(enquiry.created_at)}
                    </span>
                  </div>
                </div>

                <details className="mt-3 rounded-xl border border-line bg-sand px-4 py-3">
                  <summary className="cursor-pointer text-sm font-medium text-cyprus">
                    View message
                  </summary>
                  <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-ink">
                    {enquiry.message}
                  </p>
                </details>

                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <form action={updateContactStatusAction} className="flex items-center gap-2">
                    <input type="hidden" name="id" value={enquiry.id} />
                    <label htmlFor={`status-${enquiry.id}`} className="sr-only">
                      Status
                    </label>
                    <select
                      id={`status-${enquiry.id}`}
                      name="status"
                      defaultValue={enquiry.status}
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
                  <form action={deleteContactAction}>
                    <input type="hidden" name="id" value={enquiry.id} />
                    <ConfirmSubmit
                      confirmMessage={`Delete the enquiry from ${enquiry.full_name}?`}
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
