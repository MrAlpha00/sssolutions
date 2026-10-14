"use client";

import { motion, useReducedMotion } from "framer-motion";
import { MapPin, Menu, Phone, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { BrandLogo } from "@/components/ui/logo";
import type { SiteView } from "@/lib/site-view";
import { cn } from "@/lib/utils";

import { BookButton } from "./calendly";
import { SocialLinks } from "./social-links";

type NavItem = { label: string; href: string };

export function SiteHeader({
  view,
  nav,
}: {
  view: SiteView;
  nav: readonly NavItem[];
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const reduce = useReducedMotion();

  // Close the mobile menu whenever the route changes. Adjusting state during
  // render (rather than in an effect) is React's recommended pattern here and
  // avoids a cascading re-render after navigation.
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    if (open) setOpen(false);
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const isActive = (href: string) => {
    if (href.includes("#")) return false;
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b transition-shadow duration-300",
        scrolled
          ? "border-line bg-sand/95 shadow-[0_10px_30px_-24px_rgba(0,51,46,0.6)] backdrop-blur-md"
          : "border-transparent bg-sand",
      )}
    >
      {/* Top bar */}
      <div className="hidden border-b border-line/70 bg-cyprus text-sand lg:block">
        <div className="container-x flex items-center justify-between gap-6 py-2 text-xs">
          <div className="flex items-center gap-5">
            <a
              href={view.phoneHref}
              className="flex items-center gap-2 text-sand/85 transition-colors hover:text-sand"
            >
              <Phone className="h-3.5 w-3.5" />
              {view.phone}
            </a>
            <a
              href={view.emailHref}
              className="flex items-center gap-2 text-sand/85 transition-colors hover:text-sand"
            >
              <span aria-hidden className="text-sand/40">
                •
              </span>
              {view.email}
            </a>
            {view.businessHours ? (
              <span className="flex items-center gap-2 text-sand/70">
                <span aria-hidden className="text-sand/40">
                  •
                </span>
                {view.businessHours}
              </span>
            ) : null}
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sand/70">{view.tagline}</span>
            <SocialLinks
              social={view.social}
              tone="light"
              itemClassName="h-7 w-7 border-sand/25 text-sand/85"
            />
          </div>
        </div>
      </div>

      {/* Main bar */}
      <div className="container-x flex items-center justify-between gap-4 py-3.5">
        <Link
          href="/"
          aria-label={`${view.name} — home`}
          className="shrink-0 rounded-lg"
        >
          <BrandLogo />
        </Link>

        <nav aria-label="Primary" className="hidden xl:block">
          <ul className="flex items-center gap-1">
            {nav.map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className={cn(
                    "rounded-full px-3.5 py-2 text-sm font-medium transition-colors",
                    isActive(item.href)
                      ? "bg-cyprus/8 text-cyprus"
                      : "text-ink/80 hover:bg-cyprus/5 hover:text-cyprus",
                  )}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="hidden items-center gap-3 xl:flex">
          <a
            href={view.phoneHref}
            className="flex items-center gap-2 text-sm font-medium text-cyprus"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-full border border-line">
              <Phone className="h-4 w-4" />
            </span>
            <span className="hidden 2xl:inline">{view.phone}</span>
          </a>
          <BookButton url={view.calendlyUrl} size="md">
            Book a Consultation
          </BookButton>
        </div>

        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-controls="mobile-navigation"
          aria-label={open ? "Close menu" : "Open menu"}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-line text-cyprus xl:hidden"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open ? (
        <div
          id="mobile-navigation"
          className="fixed inset-x-0 top-[calc(100%)] bottom-0 z-40 overflow-y-auto border-t border-line bg-sand xl:hidden"
        >
          <motion.div
            initial={reduce ? undefined : { opacity: 0, y: -8 }}
            animate={reduce ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="container-x py-6"
          >
            <nav aria-label="Mobile">
              <ul className="flex flex-col gap-1">
                {nav.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className={cn(
                        "block rounded-xl px-4 py-3 text-base font-medium transition-colors",
                        isActive(item.href)
                          ? "bg-cyprus/8 text-cyprus"
                          : "text-ink hover:bg-cyprus/5",
                      )}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="mt-6 space-y-3 border-t border-line pt-6">
              <BookButton
                url={view.calendlyUrl}
                size="lg"
                className="w-full"
              >
                Book a Consultation
              </BookButton>
              <a
                href={view.phoneHref}
                className="flex items-center justify-center gap-2 rounded-full border border-cyprus/25 px-5 py-3 text-sm font-medium text-cyprus"
              >
                <Phone className="h-4 w-4" />
                {view.phone}
              </a>
            </div>

            <div className="mt-6 space-y-3 text-sm text-muted">
              <p className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-leaf-dark" />
                {view.address}
              </p>
              <p className="flex items-center gap-2">
                <span className="sr-only">Email</span>
                <a href={view.emailHref} className="text-cyprus underline underline-offset-2">
                  {view.email}
                </a>
              </p>
            </div>

            <SocialLinks social={view.social} className="mt-6" />
          </motion.div>
        </div>
      ) : null}
    </header>
  );
}
