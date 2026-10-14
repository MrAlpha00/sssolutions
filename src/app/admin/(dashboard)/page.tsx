import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { connection } from "next/server";
import { requireAdmin } from "@/lib/auth/session";

import { AdminPageHeader, AdminPanel, StatusPill } from "@/components/admin/ui";
import { EmptyState } from "@/components/ui/card";
import { db } from "@/lib/db";
import { formatDate } from "@/lib/utils";

export default async function AdminOverviewPage() {
  await connection();
  await requireAdmin();

  const [stats, enquiries, applications] = await Promise.all([
    db.getStats(),
    db.listContactSubmissions(),
    db.listApplications(),
  ]);

  const cards = [
    { label: "New enquiries", value: stats.newEnquiries, href: "/admin/enquiries" },
    {
      label: "New applications",
      value: stats.applications,
      href: "/admin/applications",
    },
    { label: "Subscribers", value: stats.subscribers, href: "/admin/subscribers" },
    { label: "Published services", value: stats.services, href: "/admin/services" },
    { label: "Resources", value: stats.posts, href: "/admin/resources" },
    { label: "Open roles", value: stats.jobs, href: "/admin/jobs" },
    { label: "FAQs", value: stats.faqs, href: "/admin/faqs" },
    { label: "Testimonials", value: stats.testimonials, href: "/admin/testimonials" },
    { label: "Visible partners", value: stats.partners, href: "/admin/partners" },
  ];

  const recentEnquiries = enquiries.slice(0, 5);
  const recentApplications = applications.slice(0, 5);

  return (
    <>
      <AdminPageHeader
        title="Overview"
        description="A summary of your website content and the enquiries received through the site."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="group rounded-2xl border border-line bg-cream p-5 transition-colors hover:border-cyprus/25"
          >
            <div className="flex items-start justify-between gap-3">
              <p className="text-sm text-muted">{card.label}</p>
              <ArrowUpRight
                className="h-4 w-4 text-line-dark transition-colors group-hover:text-cyprus"
                aria-hidden
              />
            </div>
            <p className="mt-3 font-heading text-3xl text-cyprus">{card.value}</p>
          </Link>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <AdminPanel title="Latest enquiries">
          {recentEnquiries.length > 0 ? (
            <ul className="divide-y divide-line">
              {recentEnquiries.map((item) => (
                <li key={item.id} className="flex items-start justify-between gap-4 py-3 first:pt-0 last:pb-0">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-cyprus">
                      {item.full_name}
                    </p>
                    <p className="truncate text-xs text-muted">{item.email}</p>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-1">
                    <StatusPill tone={item.status === "new" ? "warning" : "muted"}>
                      {item.status}
                    </StatusPill>
                    <span className="text-xs text-muted">
                      {formatDate(item.created_at)}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState
              title="No enquiries yet"
              description="Enquiries submitted through the contact form will appear here."
            />
          )}
        </AdminPanel>

        <AdminPanel title="Latest applications">
          {recentApplications.length > 0 ? (
            <ul className="divide-y divide-line">
              {recentApplications.map((item) => (
                <li key={item.id} className="flex items-start justify-between gap-4 py-3 first:pt-0 last:pb-0">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-cyprus">
                      {item.name}
                    </p>
                    <p className="truncate text-xs text-muted">{item.position}</p>
                  </div>
                  <span className="shrink-0 text-xs text-muted">
                    {formatDate(item.created_at)}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState
              title="No applications yet"
              description="Applications submitted through the careers page will appear here."
            />
          )}
        </AdminPanel>
      </div>
    </>
  );
}
