import Link from "next/link";
import { requireAdmin } from "@/lib/auth/session";

import {
  deletePostAction,
  savePostAction,
  togglePostAction,
} from "@/app/admin/actions";
import { AdminForm, type AdminField } from "@/components/admin/admin-form";
import { ConfirmSubmit } from "@/components/admin/confirm-submit";
import { AdminPageHeader, AdminPanel, StatusPill } from "@/components/admin/ui";
import { buttonClasses } from "@/components/ui/button";
import { db } from "@/lib/db";

export default async function AdminResourcesPage({
  searchParams,
}: {
  searchParams: Promise<{ edit?: string }>;
}) {
  await requireAdmin();
  const { edit } = await searchParams;
  const posts = await db.listPosts();
  const editing =
    edit && edit !== "new" ? posts.find((item) => item.id === edit) ?? null : null;

  const fields: AdminField[] = [
    { name: "title", label: "Title", required: true, defaultValue: editing?.title },
    {
      name: "slug",
      label: "Slug",
      hint: "Leave blank to generate one from the title",
      defaultValue: editing?.slug,
    },
    {
      name: "category",
      label: "Category",
      defaultValue: editing?.category ?? "HR Insights",
    },
    {
      name: "author",
      label: "Author",
      defaultValue: editing?.author,
    },
    {
      name: "published_at",
      label: "Publish date",
      type: "date",
      defaultValue: editing?.published_at ? editing.published_at.slice(0, 10) : "",
    },
    {
      name: "summary",
      label: "Summary",
      type: "textarea",
      rows: 3,
      fullWidth: true,
      hint: "Shown on listing cards and used as the meta description if no SEO description is set.",
      defaultValue: editing?.summary,
    },
    {
      name: "content",
      label: "Content",
      type: "textarea",
      rows: 16,
      required: true,
      fullWidth: true,
      hint: "Supports ## headings, - bullet lists, and **bold** text.",
      defaultValue: editing?.content,
    },
    {
      name: "cover_image_url",
      label: "Cover image URL",
      type: "url",
      fullWidth: true,
      defaultValue: editing?.cover_image_url,
    },
    {
      name: "seo_title",
      label: "SEO title",
      fullWidth: true,
      defaultValue: editing?.seo_title,
    },
    {
      name: "seo_description",
      label: "SEO description",
      type: "textarea",
      rows: 2,
      fullWidth: true,
      defaultValue: editing?.seo_description,
    },
    {
      name: "order_index",
      label: "Order",
      type: "number",
      defaultValue: editing?.order_index ?? posts.length + 1,
    },
    {
      name: "published",
      label: "Published",
      type: "checkbox",
      hint: "Show this article on the website",
      defaultValue: editing?.published ?? true,
    },
  ];

  return (
    <>
      <AdminPageHeader
        title="Resources"
        description="Articles and guides shown in the Resources section of the website."
      />

      <AdminPanel title={editing ? `Edit article: ${editing.title}` : "Write an article"}>
        <AdminForm
          action={savePostAction}
          fields={fields}
          hidden={editing ? [{ name: "id", value: editing.id }] : undefined}
          submitLabel={editing ? "Save changes" : "Publish article"}
          cancelHref={editing ? "/admin/resources" : undefined}
        />
      </AdminPanel>

      <AdminPanel title={`All articles (${posts.length})`} className="mt-6">
        {posts.length === 0 ? (
          <p className="text-sm text-muted">No articles yet.</p>
        ) : (
          <ul className="divide-y divide-line">
            {posts.map((post) => (
              <li
                key={post.id}
                className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <p className="truncate font-medium text-cyprus">{post.title}</p>
                  <p className="truncate text-xs text-muted">
                    {post.category} · /{post.slug}
                  </p>
                </div>
                <div className="flex shrink-0 flex-wrap items-center gap-2">
                  <StatusPill tone={post.published ? "positive" : "muted"}>
                    {post.published ? "Published" : "Draft"}
                  </StatusPill>
                  <Link
                    href={`/admin/resources?edit=${post.id}`}
                    className={buttonClasses("ghost", "sm")}
                  >
                    Edit
                  </Link>
                  <form action={togglePostAction}>
                    <input type="hidden" name="id" value={post.id} />
                    <button type="submit" className={buttonClasses("secondary", "sm")}>
                      {post.published ? "Unpublish" : "Publish"}
                    </button>
                  </form>
                  <form action={deletePostAction}>
                    <input type="hidden" name="id" value={post.id} />
                    <ConfirmSubmit
                      confirmMessage={`Delete "${post.title}"?`}
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
