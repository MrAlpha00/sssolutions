import { ChevronRight } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

import { Eyebrow } from "@/components/ui/section-heading";

export interface Crumb {
  label: string;
  href?: string;
}

/** Shared hero for inner pages: breadcrumb, eyebrow, title, and intro copy. */
export function PageHero({
  eyebrow,
  title,
  description,
  breadcrumb,
  children,
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  breadcrumb?: Crumb[];
  children?: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden border-b border-line bg-cream">
      <span
        aria-hidden
        className="brand-blob absolute -right-20 -top-24 h-64 w-64 bg-leaf/15"
      />
      <div className="container-x relative py-14 sm:py-18 lg:py-20">
        {breadcrumb && breadcrumb.length > 0 ? (
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex flex-wrap items-center gap-1.5 text-xs text-muted">
              {breadcrumb.map((crumb, index) => {
                const isLast = index === breadcrumb.length - 1;
                return (
                  <li key={`${crumb.label}-${index}`} className="flex items-center gap-1.5">
                    {crumb.href && !isLast ? (
                      <Link href={crumb.href} className="transition-colors hover:text-cyprus">
                        {crumb.label}
                      </Link>
                    ) : (
                      <span aria-current={isLast ? "page" : undefined} className="text-cyprus">
                        {crumb.label}
                      </span>
                    )}
                    {!isLast ? (
                      <ChevronRight className="h-3.5 w-3.5 text-line-dark" aria-hidden />
                    ) : null}
                  </li>
                );
              })}
            </ol>
          </nav>
        ) : null}

        {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
        <h1 className="mt-4 max-w-3xl text-4xl leading-tight sm:text-5xl">{title}</h1>
        {description ? (
          <div className="mt-5 max-w-2xl text-lg leading-relaxed text-muted">
            {description}
          </div>
        ) : null}
        {children}
      </div>
    </section>
  );
}
