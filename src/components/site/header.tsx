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

  // Close the menu with Escape for keyboard users.
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  const isActive = (href: string) => {
    if (href.includes("#")) return false;
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <>
      {/* Top information bar — kept in normal document flow so it scrolls away
          above the viewport. Only the main navigation below is sticky. */}
      <div className="hidden border-b border-sand/10 bg-cyprus text-sand lg:block">
        <div className="container-x flex h-9 items-center justify-between gap-4 text-[0.72rem] leading-none">
          <div className="flex items-center gap-4">
            <a
              href={view.phoneHref}
              className="flex items-center gap-1.5 text-sand/85 transition-colors hover:text-sand"
            >
              <Phone className="h-3 w-3" aria-hidden />
              <span className="tracking-wide">{view.phone}</span>
            </a>
            <span aria-hidden className="h-3 w-px bg-sand/25" />
            <a
              href={view.emailHref}
              className="text-sand/85 transition-colors hover:text-sand"
            >
              {view.email}
            </a>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sand/65">{view.tagline}</span>
            <SocialLinks
              social={view.social}
              tone="light"
              itemClassName="h-6 w-6 border-sand/25 text-sand/85"
            />
          </div>
        </div>
      </div>

      {/* Main navigation — sticky at the top of the viewport. */}
      <header
        className={cn(
          "sticky top-0 z-50 border-b transition-shadow duration-300",
          scrolled
            ? "border-line bg-sand/95 shadow-[0_10px_30px_-24px_rgba(0,51,46,0.6)] backdrop-blur-md"
            : "border-transparent bg-sand",
        )}
      >
        <div className="container-x flex h-[68px] items-center justify-between gap-3 lg:h-[76px]">
          <Link
            href="/"
            aria-label={`${view.name} — home`}
            className="shrink-0 rounded-lg"
          >
            <BrandLogo />
          </Link>

          <nav aria-label="Primary" className="hidden min-w-0 xl:block">
            <ul className="flex items-center gap-0.5 whitespace-nowrap">
              {nav.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    aria-current={isActive(item.href) ? "page" : undefined}
                    className={cn(
                      "rounded-full px-3 py-2 text-[0.82rem] font-medium transition-colors",
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

          <div className="hidden shrink-0 items-center gap-2.5 xl:flex">
            <a
              href={view.phoneHref}
              aria-label={`Call ${view.phone}`}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-line text-cyprus transition-colors hover:border-cyprus hover:bg-cyprus/5"
            >
              <Phone className="h-4 w-4" />
            </a>
            <BookButton url={view.calendlyUrl} size="md">
              Book a Consultation
            </BookButton>
          </div>

          <div className="flex shrink-0 items-center gap-2 xl:hidden">
            {/* Keep booking reachable on mid-size screens without crowding. */}
            <BookButton
              url={view.calendlyUrl}
              size="sm"
              className="hidden sm:inline-flex"
            >
              Book a Consultation
            </BookButton>
            <button
              type="button"
              onClick={() => setOpen((value) => !value)}
              aria-expanded={open}
              aria-controls="mobile-navigation"
              aria-label={open ? "Close menu" : "Open menu"}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-line text-cyprus transition-colors hover:bg-cyprus/5"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu — drops from the sticky navigation and stays with it. */}
        {open ? (
          <div
            id="mobile-navigation"
            className="absolute inset-x-0 top-full z-40 max-h-[calc(100dvh-4.25rem)] overflow-y-auto border-t border-line bg-sand shadow-[0_18px_40px_-24px_rgba(0,51,46,0.45)] xl:hidden lg:max-h-[calc(100dvh-4.75rem)]"
          >
            <motion.div
              initial={reduce ? undefined : { opacity: 0, y: -8 }}
              animate={reduce ? undefined : { opacity: 1, y: 0 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="container-x py-5"
            >
              <nav aria-label="Mobile">
                <ul className="flex flex-col gap-0.5">
                  {nav.map((item) => (
                    <li key={item.label}>
                      <Link
                        href={item.href}
                        aria-current={isActive(item.href) ? "page" : undefined}
                        className={cn(
                          "block rounded-xl px-4 py-3 text-[0.95rem] font-medium transition-colors",
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

              <div className="mt-5 space-y-3 border-t border-line pt-5">
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

              <div className="mt-5 space-y-3 text-sm text-muted">
                <p className="flex items-start gap-2">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-leaf-dark" />
                  {view.address}
                </p>
                <p className="flex items-center gap-2">
                  <span className="sr-only">Email</span>
                  <a
                    href={view.emailHref}
                    className="text-cyprus underline underline-offset-2"
                  >
                    {view.email}
                  </a>
                </p>
              </div>

              <SocialLinks social={view.social} className="mt-5" />
            </motion.div>
          </div>
        ) : null}
      </header>
    </>
  );
}
