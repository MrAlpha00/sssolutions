import { Clock, Mail, MapPin, Phone } from "lucide-react";
import Link from "next/link";

import { BrandLogo } from "@/components/ui/logo";
import { Container } from "@/components/ui/container";
import {
  footerQuickLinks,
  footerServiceLinks,
} from "@/lib/site-config";
import type { SiteView } from "@/lib/site-view";

import { LocationModal } from "./location-modal";
import { NewsletterForm } from "./newsletter-form";
import { SocialLinks } from "./social-links";

export function SiteFooter({
  view,
  year,
  turnstileSiteKey,
}: {
  view: SiteView;
  year: number;
  turnstileSiteKey: string;
}) {
  return (
    <footer className="mt-auto bg-cyprus text-sand">
      {/* Newsletter */}
      <div className="border-b border-sand/15 bg-cyprus-dark">
        <Container className="grid gap-8 py-14 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-leaf">
              Stay informed
            </p>
            <h2 className="mt-3 text-2xl text-sand sm:text-3xl">
              Practical HR insights, straight to your inbox
            </h2>
            <p className="mt-3 max-w-md text-sm text-sand/75">
              Occasional articles and updates on recruitment, payroll, compliance,
              and building better workplaces. No spam — unsubscribe at any time.
            </p>
          </div>
          <div className="rounded-2xl bg-cream p-5 text-ink shadow-lg">
            <NewsletterForm turnstileSiteKey={turnstileSiteKey} compact />
          </div>
        </Container>
      </div>

      {/* Main columns */}
      <Container className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
        <div>
          <BrandLogo tone="light" href="/" />
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-sand/75">
            {view.description}
          </p>
          <SocialLinks social={view.social} tone="light" className="mt-6" />
        </div>

        <nav aria-label="Footer — quick links">
          <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-sand">
            Company
          </h2>
          <ul className="mt-5 space-y-3 text-sm">
            {footerQuickLinks.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="text-sand/75 transition-colors hover:text-sand"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Footer — services">
          <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-sand">
            Services
          </h2>
          <ul className="mt-5 space-y-3 text-sm">
            {footerServiceLinks.hr.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="text-sand/75 transition-colors hover:text-sand"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <h3 className="mt-6 text-xs font-semibold uppercase tracking-[0.14em] text-sand/60">
            Business services
          </h3>
          <ul className="mt-3 space-y-3 text-sm">
            {footerServiceLinks.business.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="text-sand/75 transition-colors hover:text-sand"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-sand">
            Get in touch
          </h2>
          <ul className="mt-5 space-y-4 text-sm">
            <li className="flex items-start gap-3 text-sand/75">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-leaf" />
              <span>{view.address}</span>
            </li>
            <li>
              <a
                href={view.phoneHref}
                className="flex items-center gap-3 text-sand/75 transition-colors hover:text-sand"
              >
                <Phone className="h-4 w-4 shrink-0 text-leaf" />
                {view.phone}
              </a>
            </li>
            <li>
              <a
                href={view.emailHref}
                className="flex items-center gap-3 break-all text-sand/75 transition-colors hover:text-sand"
              >
                <Mail className="h-4 w-4 shrink-0 text-leaf" />
                {view.email}
              </a>
            </li>
            {view.businessHours ? (
              <li className="flex items-center gap-3 text-sand/75">
                <Clock className="h-4 w-4 shrink-0 text-leaf" />
                {view.businessHours}
              </li>
            ) : null}
          </ul>
          <div className="mt-5">
            <LocationModal address={view.address} />
          </div>
        </div>
      </Container>

      {/* Bottom bar */}
      <div className="border-t border-sand/15">
        <Container className="flex flex-col items-center justify-between gap-3 pb-24 pt-6 text-xs text-sand/60 sm:flex-row sm:pb-6">
          <p>
            © {year} {view.name}. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
            <Link href="/privacy" className="transition-colors hover:text-sand">
              Privacy Policy
            </Link>
            <Link href="/terms" className="transition-colors hover:text-sand">
              Terms of Use
            </Link>
            <Link href="/admin/login" className="transition-colors hover:text-sand">
              Staff login
            </Link>
          </div>
        </Container>
      </div>
    </footer>
  );
}
