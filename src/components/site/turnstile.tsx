"use client";

import { useEffect, useRef } from "react";

/**
 * Cloudflare Turnstile widget (explicit rendering).
 *
 * When no site key is configured the widget renders nothing; the server-side
 * verifier (`lib/turnstile.ts`) likewise skips verification until the keys are
 * set, so the forms keep working in development.
 *
 * Turnstile injects a hidden `cf-turnstile-response` input inside the widget,
 * so a token is included automatically when the surrounding form is submitted.
 */

const SCRIPT_SRC =
  "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

interface TurnstileApi {
  render: (
    container: HTMLElement,
    options: Record<string, unknown>,
  ) => string;
  remove: (widgetId: string) => void;
  reset: (widgetId?: string) => void;
}

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

export function TurnstileWidget({
  siteKey,
  theme = "light",
  className,
}: {
  siteKey: string;
  theme?: "light" | "dark" | "auto";
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | null>(null);
  const rerendered = useRef(false);

  useEffect(() => {
    if (!siteKey) return;
    let cancelled = false;

    const render = () => {
      if (cancelled || rerendered.current) return;
      if (!containerRef.current || !window.turnstile) return;
      widgetId.current = window.turnstile.render(containerRef.current, {
        sitekey: siteKey,
        theme,
      });
      rerendered.current = true;
    };

    if (window.turnstile) {
      render();
      return () => {
        cancelled = true;
        if (widgetId.current && window.turnstile) {
          window.turnstile.remove(widgetId.current);
          widgetId.current = null;
        }
      };
    }

    let script = document.querySelector<HTMLScriptElement>(
      `script[src="${SCRIPT_SRC}"]`,
    );
    const onLoad = () => render();

    if (script) {
      script.addEventListener("load", onLoad);
    } else {
      script = document.createElement("script");
      script.src = SCRIPT_SRC;
      script.async = true;
      script.defer = true;
      script.addEventListener("load", onLoad);
      document.head.appendChild(script);
    }

    return () => {
      cancelled = true;
      script?.removeEventListener("load", onLoad);
      if (widgetId.current && window.turnstile) {
        window.turnstile.remove(widgetId.current);
        widgetId.current = null;
      }
    };
  }, [siteKey, theme]);

  if (!siteKey) return null;
  return <div ref={containerRef} className={className} />;
}
