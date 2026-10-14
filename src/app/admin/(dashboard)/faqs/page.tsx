import Link from "next/link";
import { connection } from "next/server";
import { requireAdmin } from "@/lib/auth/session";

import {
  deleteFaqAction,
  saveFaqAction,
  toggleFaqAction,
} from "@/app/admin/actions";
import { AdminForm, type AdminField } from "@/components/admin/admin-form";
import { ConfirmSubmit } from "@/components/admin/confirm-submit";
import { AdminPageHeader, AdminPanel, StatusPill } from "@/components/admin/ui";
import { buttonClasses } from "@/components/ui/button";
import { db } from "@/lib/db";

export default async function AdminFaqsPage({
  searchParams,
}: {
  searchParams: Promise<{ edit?: string }>;
}) {
  await connection();
  await requireAdmin();
  const { edit } = await searchParams;
  const faqs = await db.listFaqs();
  const editing =
    edit && edit !== "new" ? faqs.find((item) => item.id === edit) ?? null : null;

  const fields: AdminField[] = [
    { name: "question", label: "Question", required: true, fullWidth: true, defaultValue: editing?.question },
    {
      name: "answer",
      label: "Answer",
      type: "textarea",
      rows: 6,
      required: true,
      fullWidth: true,
      defaultValue: editing?.answer,
    },
    { name: "category", label: "Category", defaultValue: editing?.category },
    {
      name: "order_index",
      label: "Display order",
      type: "number",
      defaultValue: editing?.order_index ?? faqs.length + 1,
    },
    {
      name: "published",
      label: "Published",
      type: "checkbox",
      hint: "Show this FAQ on the website",
      defaultValue: editing?.published ?? true,
    },
  ];

  return (
    <>
      <AdminPageHeader
        title="FAQs"
        description="Frequently asked questions shown on the homepage. Answers should be specific and truthful."
      />

      <AdminPanel title={editing ? `Edit FAQ` : "Add an FAQ"}>
        <AdminForm
          action={saveFaqAction}
          fields={fields}
          hidden={editing ? [{ name: "id", value: editing.id }] : undefined}
          submitLabel={editing ? "Save changes" : "Add FAQ"}
          cancelHref={editing ? "/admin/faqs" : undefined}
        />
      </AdminPanel>

      <AdminPanel title={`All FAQs (${faqs.length})`} className="mt-6">
        {faqs.length === 0 ? (
          <p className="text-sm text-muted">No FAQs yet.</p>
        ) : (
          <ul className="divide-y divide-line">
            {faqs.map((faq) => (
              <li
                key={faq.id}
                className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <p className="truncate font-medium text-cyprus">{faq.question}</p>
                  <p className="truncate text-xs text-muted">
                    {faq.category ?? "Uncategorised"} · order {faq.order_index}
                  </p>
                </div>
                <div className="flex shrink-0 flex-wrap items-center gap-2">
                  <StatusPill tone={faq.published ? "positive" : "muted"}>
                    {faq.published ? "Published" : "Draft"}
                  </StatusPill>
                  <Link
                    href={`/admin/faqs?edit=${faq.id}`}
                    className={buttonClasses("ghost", "sm")}
                  >
                    Edit
                  </Link>
                  <form action={toggleFaqAction}>
                    <input type="hidden" name="id" value={faq.id} />
                    <button type="submit" className={buttonClasses("secondary", "sm")}>
                      {faq.published ? "Unpublish" : "Publish"}
                    </button>
                  </form>
                  <form action={deleteFaqAction}>
                    <input type="hidden" name="id" value={faq.id} />
                    <ConfirmSubmit
                      confirmMessage="Delete this FAQ?"
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
