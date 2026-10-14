"use client";

import { Check, Mail } from "lucide-react";

import { Button } from "@/components/ui/button";

import { CheckboxField, FormAlert, Honeypot } from "./form-fields";
import { TurnstileWidget } from "./turnstile";
import { useFormSubmit } from "./use-form-submit";

export function NewsletterForm({
  turnstileSiteKey,
  privacyHref = "/privacy",
  compact = false,
}: {
  turnstileSiteKey: string;
  privacyHref?: string;
  compact?: boolean;
}) {
  const { status, error, submit } = useFormSubmit("/api/newsletter");

  if (status === "success") {
    return (
      <p className="flex items-center gap-2 text-sm text-leaf-dark" role="status">
        <Check className="h-4 w-4" />
        You are subscribed. Thank you for joining our mailing list.
      </p>
    );
  }

  return (
    <form onSubmit={submit} className="relative space-y-3">
      <Honeypot />

      <div className="flex flex-col gap-2 sm:flex-row">
        <div className="flex-1">
          <label htmlFor="newsletter-email" className="sr-only">
            Email address
          </label>
          <input
            id="newsletter-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="you@company.com"
            className="w-full rounded-full border border-line bg-cream px-4 py-2.5 text-sm text-ink placeholder:text-muted/60 focus:border-cyprus focus:outline-none"
          />
        </div>
        <Button type="submit" disabled={status === "submitting"} className="shrink-0">
          <Mail className="h-4 w-4" />
          {status === "submitting" ? "Subscribing…" : "Subscribe"}
        </Button>
      </div>

      <CheckboxField name="consent" required>
        I agree to receive occasional HR insights by email and accept the{" "}
        <a href={privacyHref} className="text-cyprus underline underline-offset-2">
          privacy policy
        </a>
        .
      </CheckboxField>

      {!compact ? <TurnstileWidget siteKey={turnstileSiteKey} /> : null}

      {error ? <FormAlert tone="error">{error}</FormAlert> : null}
    </form>
  );
}
