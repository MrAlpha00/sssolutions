import { ExternalLink, LogOut } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { connection } from "next/server";

import { AdminNav } from "@/components/admin/admin-nav";
import { BrandLogo } from "@/components/ui/logo";
import { logoutAction } from "@/lib/auth/actions";
import { requireAdmin } from "@/lib/auth/session";
import { db } from "@/lib/db";

export const metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default async function AdminDashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  await connection();
  const session = await requireAdmin();

  return (
    <div className="flex min-h-dvh flex-col bg-sand">
      <header className="sticky top-0 z-40 border-b border-line bg-cream/95 backdrop-blur">
        <div className="container-x flex items-center justify-between gap-4 py-3">
          <Link href="/admin" aria-label="Admin dashboard home" className="rounded-lg">
            <BrandLogo />
          </Link>
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 rounded-full border border-line px-3.5 py-2 text-xs font-medium text-cyprus transition-colors hover:bg-sand"
            >
              <ExternalLink className="h-3.5 w-3.5" aria-hidden />
              <span className="hidden sm:inline">View website</span>
            </Link>
            <form action={logoutAction}>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 rounded-full border border-line px-3.5 py-2 text-xs font-medium text-cyprus transition-colors hover:bg-sand"
              >
                <LogOut className="h-3.5 w-3.5" aria-hidden />
                <span className="hidden sm:inline">Log out</span>
              </button>
            </form>
          </div>
        </div>
      </header>

      <div className="container-x grid flex-1 gap-8 py-8 lg:grid-cols-[16rem_1fr]">
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <AdminNav />
          <p className="mt-5 hidden border-t border-line pt-4 text-xs text-muted lg:block">
            Signed in as
            <br />
            <span className="break-all font-medium text-cyprus">{session.email}</span>
          </p>
          <p className="mt-2 hidden text-xs text-muted lg:block">
            Data store: <span className="font-medium text-cyprus">{db.kind}</span>
          </p>
        </aside>

        <main id="main-content" className="min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
}
