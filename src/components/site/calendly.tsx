"use client";

import { useCallback, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";

import { ButtonLink, buttonClasses } from "@/components/ui/button";

/**
 * Calendly popup CTA.
 *
 * The official Calendly widget script and stylesheet are loaded only when the
 * visitor clicks a booking button, so nothing third-party is fetched on page
 * load and the popup opens on demand via `Calendly.initPopupWidget`. When no
 * Calendly URL is configured, or the widget fails to load (offline, blocked by
 * an extension), the button sends the visitor to the contact page instead — we
 * never invent a scheduling link and never leave a dead button behind.
 *
 * Only `initPopupWidget` is used, so no floating Calendly badge is injected and
 * the existing WhatsApp bubble stays the only floating widget.
 */

const SCRIPT_SRC = "https://assets.calendly.com/assets/external/widget.js";
const CSS_HREF = "https://assets.calendly.com/assets/external/widget.css";
const LOAD_TIMEOUT_MS = 10000;

declare global {
  interface Window {
    Calendly?: { initPopupWidget: (options: { url: string }) => void };
  }
}

let calendlyPromise: Promise<void> | null = null;

function loadCalendly(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.Calendly) return Promise.resolve();
  if (calendlyPromise) return calendlyPromise;

  calendlyPromise = new Promise<void>((resolve, reject) => {
    let settled = false;
    const fail = () => {
      if (settled) return;
      settled = true;
      window.clearTimeout(timer);
      // Allow a later click to retry after a transient failure.
      calendlyPromise = null;
      reject(new Error("calendly-unavailable"));
    };
    const done = () => {
      if (settled) return;
      settled = true;
      window.clearTimeout(timer);
      resolve();
    };
    const timer = window.setTimeout(fail, LOAD_TIMEOUT_MS);

    if (!document.querySelector(`link[href="${CSS_HREF}"]`)) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = CSS_HREF;
      document.head.appendChild(link);
    }

    const existing = document.querySelector<HTMLScriptElement>(
      `script[src="${SCRIPT_SRC}"]`,
    );
    if (existing) {
      if (window.Calendly) {
        done();
        return;
      }
      existing.addEventListener("load", done, { once: true });
      existing.addEventListener("error", fail, { once: true });
      return;
    }

    const script = document.createElement("script");
    script.src = SCRIPT_SRC;
    script.async = true;
    script.onload = done;
    script.onerror = fail;
    document.head.appendChild(script);
  });

  return calendlyPromise;
}

type Variant = "primary" | "secondary" | "light" | "leaf" | "ghost";
type Size = "sm" | "md" | "lg";

export function BookButton({
  url,
  children,
  variant = "primary",
  size = "md",
  className,
  fallbackHref = "/contact",
}: {
  url: string;
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  className?: string;
  fallbackHref?: string;
}) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleClick = useCallback(async () => {
    if (!url) return;
    setLoading(true);
    try {
      await loadCalendly();
      const calendly = window.Calendly;
      if (!calendly?.initPopupWidget) {
        throw new Error("calendly-unavailable");
      }
      calendly.initPopupWidget({ url });
    } catch {
      // Calendly could not load (offline, blocked, timed out) — send the
      // visitor somewhere they can still book rather than doing nothing.
      router.push(fallbackHref);
    } finally {
      setLoading(false);
    }
  }, [url, fallbackHref, router]);

  if (!url) {
    return (
      <ButtonLink href={fallbackHref} variant={variant} size={size} className={className}>
        {children}
      </ButtonLink>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading}
      className={buttonClasses(variant, size, className)}
    >
      {children}
    </button>
  );
}
