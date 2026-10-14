import Link from "next/link";
import { connection } from "next/server";

import {
  deleteTestimonialAction,
  saveTestimonialAction,
  toggleTestimonialAction,
} from "@/app/admin/actions";
import { AdminForm, type AdminField } from "@/components/admin/admin-form";
import { ConfirmSubmit } from "@/components/admin/confirm-submit";
import { AdminPageHeader, AdminPanel, StatusPill } from "@/components/admin/ui";
import { buttonClasses } from "@/components/ui/button";
import { db } from "@/lib/db";

export default async function AdminTestimonialsPage({
  searchParams,
}: {
  searchParams: Promise<{ edit?: string }>;
}) {
  await connection();
  const { edit } = await searchParams;
  const testimonials = await db.listTestimonials();
  const editing =
    edit && edit !== "new"
      ? testimonials.find((item) => item.id === edit) ?? null
      : null;

  const fields: AdminField[] = [
    {
      name: "quote",
      label: "Testimonial",
      type: "textarea",
      rows: 5,
      required: true,
      fullWidth: true,
      hint: "Use the client's own words, with their permission.",
      defaultValue: editing?.quote,
    },
    {
      name: "author_name",
      label: "Client name",
      required: true,
      defaultValue: editing?.author_name,
    },
    {
      name: "author_role",
      label: "Role",
      defaultValue: editing?.author_role,
    },
    { name: "company", label: "Company", defaultValue: editing?.company },
    {
      name: "rating",
      label: "Rating (1–5)",
      type: "number",
      hint: "Optional. Only set a rating if the client gave one.",
      defaultValue: editing?.rating ?? "",
    },
    {
      name: "image_url",
      label: "Image URL",
      type: "url",
      fullWidth: true,
      defaultValue: editing?.image_url,
    },
    {
      name: "order_index",
      label: "Display order",
      type: "number",
      defaultValue: editing?.order_index ?? testimonials.length + 1,
    },
    {
      name: "visible",
      label: "Visible",
      type: "checkbox",
      hint: "Show this testimonial on the website",
      defaultValue: editing?.visible ?? true,
    },
  ];

  return (
    <>
      <AdminPageHeader
        title="Testimonials"
        description="Publish only genuine, approved feedback. If there are none, the website shows an honest empty state."
      />

      <AdminPanel
        title={editing ? `Edit testimonial from ${editing.author_name}` : "Add a testimonial"}
      >
        <AdminForm
          action={saveTestimonialAction}
          fields={fields}
          hidden={editing ? [{ name: "id", value: editing.id }] : undefined}
          submitLabel={editing ? "Save changes" : "Add testimonial"}
          cancelHref={editing ? "/admin/testimonials" : undefined}
        />
      </AdminPanel>

      <AdminPanel title={`All testimonials (${testimonials.length})`} className="mt-6">
        {testimonials.length === 0 ? (
          <p className="text-sm text-muted">
            No testimonials yet. The website shows an empty state until one is added.
          </p>
        ) : (
          <ul className="divide-y divide-line">
            {testimonials.map((testimonial) => (
              <li key={testimonial.id} className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <p className="line-clamp-2 text-sm text-ink">“{testimonial.quote}”</p>
                  <p className="mt-1 text-xs text-muted">
                    {testimonial.author_name}
                    {testimonial.company ? ` · ${testimonial.company}` : ""}
                  </p>
                </div>
                <div className="flex shrink-0 flex-wrap items-center gap-2">
                  <StatusPill tone={testimonial.visible ? "positive" : "muted"}>
                    {testimonial.visible ? "Visible" : "Hidden"}
                  </StatusPill>
                  <Link
                    href={`/admin/testimonials?edit=${testimonial.id}`}
                    className={buttonClasses("ghost", "sm")}
                  >
                    Edit
                  </Link>
                  <form action={toggleTestimonialAction}>
                    <input type="hidden" name="id" value={testimonial.id} />
                    <button type="submit" className={buttonClasses("secondary", "sm")}>
                      {testimonial.visible ? "Hide" : "Show"}
                    </button>
                  </form>
                  <form action={deleteTestimonialAction}>
                    <input type="hidden" name="id" value={testimonial.id} />
                    <ConfirmSubmit
                      confirmMessage="Delete this testimonial?"
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
