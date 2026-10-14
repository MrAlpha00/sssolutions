"use client";

import { Check, Send } from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  CheckboxField,
  Field,
  FormAlert,
  Honeypot,
  SelectField,
  TextAreaField,
} from "./form-fields";
import { TurnstileWidget } from "./turnstile";
import { useFormSubmit } from "./use-form-submit";

export function ContactForm({
  services,
  turnstileSiteKey,
  phone,
  privacyHref = "/privacy",
}: {
  services: Array<{ slug: string; title: string }>;
  turnstileSiteKey: string;
  phone: string;
  privacyHref?: string;
}) {
  const { status, error, submit, reset } = useFormSubmit("/api/contact");

  if (status === "success") {
    return (
      <div className="rounded-2xl border border-leaf/40 bg-cream p-8 text-center">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-leaf/15 text-leaf-dark">
          <Check className="h-6 w-6" />
        </span>
        <h3 className="mt-4 text-xl text-cyprus">
          Thank you — your enquiry has been received
        </h3>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted">
          A member of our team will get back to you shortly. If your matter is
          urgent, please call us on {phone}.
        </p>
        <Button variant="secondary" className="mt-6" onClick={reset}>
          Send another message
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="relative space-y-4" noValidate={false}>
      <Honeypot />

      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          label="Full name"
          name="full_name"
          autoComplete="name"
          required
          placeholder="Your name"
        />
        <Field
          label="Email address"
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder="you@company.com"
        />
        <Field
          label="Phone number"
          name="phone"
          type="tel"
          autoComplete="tel"
          placeholder="Optional"
        />
        <Field
          label="Company"
          name="company"
          autoComplete="organization"
          placeholder="Optional"
        />
      </div>

      <SelectField
        label="Service of interest"
        name="service_interest"
        placeholder="Select a service (optional)"
        options={services.map((service) => ({
          value: service.title,
          label: service.title,
        }))}
      />

      <TextAreaField
        label="How can we help?"
        name="message"
        required
        placeholder="Tell us a little about your team and what you need."
      />

      <CheckboxField name="consent" required>
        I agree that Supportive HR Solutions may use the details I have provided
        to respond to my enquiry, in line with the{" "}
        <a href={privacyHref} className="text-cyprus underline underline-offset-2">
          privacy policy
        </a>
        .
      </CheckboxField>

      <TurnstileWidget siteKey={turnstileSiteKey} />

      {error ? <FormAlert tone="error">{error}</FormAlert> : null}

      <Button type="submit" size="lg" disabled={status === "submitting"}>
        {status === "submitting" ? "Sending…" : "Send enquiry"}
        <Send className="h-4 w-4" />
      </Button>
    </form>
  );
}
