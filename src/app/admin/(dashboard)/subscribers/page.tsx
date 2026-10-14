import { requireAdmin } from "@/lib/auth/session";

import {
  deleteSubscriberAction,
  updateSubscriberStatusAction,
} from "@/app/admin/actions";
import { ConfirmSubmit } from "@/components/admin/confirm-submit";
import { AdminPageHeader, AdminPanel, StatusPill } from "@/components/admin/ui";
import { buttonClasses } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/card";
import { db } from "@/lib/db";
import { formatDate } from "@/lib/utils";

export default async function AdminSubscribersPage() {
  await requireAdmin();
  const subscribers = await db.listSubscribers();

  return (
    <>
      <AdminPageHeader
        title="Newsletter subscribers"
        description="People who have opted in to receive occasional HR insights."
      />

      <AdminPanel title={`All subscribers (${subscribers.length})`}>
        {subscribers.length === 0 ? (
          <EmptyState
            title="No subscribers yet"
            description="Newsletter sign-ups from the website will appear here."
          />
        ) : (
          <ul className="divide-y divide-line">
            {subscribers.map((subscriber) => (
              <li
                key={subscriber.id}
                className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-cyprus">
                    {subscriber.email}
                  </p>
                  <p className="text-xs text-muted">
                    {subscriber.source ?? "website"} · {formatDate(subscriber.created_at)}
                  </p>
                </div>
                <div className="flex shrink-0 flex-wrap items-center gap-2">
                  <StatusPill
                    tone={subscriber.status === "subscribed" ? "positive" : "muted"}
                  >
                    {subscriber.status}
                  </StatusPill>
                  <form action={updateSubscriberStatusAction}>
                    <input type="hidden" name="id" value={subscriber.id} />
                    <input
                      type="hidden"
                      name="status"
                      value={
                        subscriber.status === "subscribed" ? "unsubscribed" : "subscribed"
                      }
                    />
                    <button type="submit" className={buttonClasses("secondary", "sm")}>
                      {subscriber.status === "subscribed" ? "Unsubscribe" : "Resubscribe"}
                    </button>
                  </form>
                  <form action={deleteSubscriberAction}>
                    <input type="hidden" name="id" value={subscriber.id} />
                    <ConfirmSubmit
                      confirmMessage={`Delete ${subscriber.email} from the list?`}
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
