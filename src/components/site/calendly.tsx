"use client";

import { useCallback, useState, type ReactNode } from "react";

import { ButtonLink, buttonClasses } from "@/components/ui/button";

/**
 * Calendly popup CTA.
 *
 * The Calendly script and stylesheet are loaded only when the visitor clicks,
 * so nothing third-party is fetched on page load. When no Calendly URL is
 * configured (the client has not supplied one yet) the button links to the
 * contact page instead — we never invent a scheduling link.
 */

const SCRIPT_SRC = "https://assets.calendly.com/assets/external/widget.js";
const CSS_HREF = "https://assets.calendly.com/assets/external/widget.css";

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
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () => reject(new Error("calendly")));
      return;
    }

    const script = document.createElement("script");
    script.src = SCRIPT_SRC;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("calendly"));
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

  const handleClick = useCallback(async () => {
    if (!url) return;
    setLoading(true);
    try {
      await loadCalendly();
      if (window.Calendly) {
        window.Calendly.initPopupWidget({ url });
      } else {
        window.open(url, "_blank", "noopener,noreferrer");
      }
    } catch {
      window.open(url, "_blank", "noopener,noreferrer");
    } finally {
      setLoading(false);
    }
  }, [url]);

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
