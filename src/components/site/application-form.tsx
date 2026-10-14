"use client";

import { Check, FileText, Send } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { CheckboxField, Field, FormAlert, Honeypot, TextAreaField } from "./form-fields";
import { TurnstileWidget } from "./turnstile";
import { useFormSubmit } from "./use-form-submit";

const controlClass =
  "w-full rounded-xl border border-line bg-cream px-4 py-2.5 text-sm text-ink transition-colors placeholder:text-muted/60 focus:border-cyprus focus:outline-none disabled:opacity-60";

export function ApplicationForm({
  jobs,
  defaultJobId,
  turnstileSiteKey,
  privacyHref = "/privacy",
}: {
  jobs: Array<{ id: string; title: string; location: string }>;
  defaultJobId?: string;
  turnstileSiteKey: string;
  privacyHref?: string;
}) {
  const { status, error, submit, reset } = useFormSubmit("/api/careers/apply");
  const defaultJob = jobs.find((job) => job.id === defaultJobId) ?? jobs[0];
  const [jobId, setJobId] = useState<string>(defaultJobId ?? "");
  const [position, setPosition] = useState<string>(
    defaultJobId ? (defaultJob?.title ?? "") : "General application",
  );

  if (status === "success") {
    return (
      <div className="rounded-2xl border border-leaf/40 bg-cream p-8 text-center">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-leaf/15 text-leaf-dark">
          <Check className="h-6 w-6" />
        </span>
        <h3 className="mt-4 text-xl text-cyprus">Application received</h3>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted">
          Thank you for your interest in working with us. Our team will review
          your details and be in touch if there is a match.
        </p>
        <Button variant="secondary" className="mt-6" onClick={reset}>
          Submit another application
        </Button>
      </div>
    );
  }

  function onJobChange(value: string) {
    setJobId(value);
    const selected = jobs.find((job) => job.id === value);
    setPosition(selected ? selected.title : "General application");
  }

  return (
    <form onSubmit={submit} className="relative space-y-4">
      <Honeypot />
      <input type="hidden" name="job_id" value={jobId} />
      <input type="hidden" name="position" value={position} />

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Full name" name="name" autoComplete="name" required />
        <Field
          label="Email address"
          name="email"
          type="email"
          autoComplete="email"
          required
        />
        <Field label="Phone number" name="phone" type="tel" autoComplete="tel" />
        <div>
          <label htmlFor="application-position" className="mb-1.5 block text-sm font-medium text-cyprus">
            Position
          </label>
          <select
            id="application-position"
            value={jobId}
            onChange={(event) => onJobChange(event.target.value)}
            className={cn(controlClass, "appearance-none")}
          >
            <option value="">General application</option>
            {jobs.map((job) => (
              <option key={job.id} value={job.id}>
                {job.title} — {job.location}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="application-resume" className="mb-1.5 block text-sm font-medium text-cyprus">
          Resume / CV{" "}
          <span className="text-leaf-dark" aria-hidden>
            *
          </span>
        </label>
        <input
          id="application-resume"
          name="resume"
          type="file"
          required
          accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          className="w-full cursor-pointer rounded-xl border border-line bg-cream px-3 py-2 text-sm text-muted file:mr-3 file:rounded-full file:border-0 file:bg-cyprus file:px-4 file:py-1.5 file:text-sm file:font-medium file:text-sand hover:file:bg-cyprus-dark"
        />
        <p className="mt-1 flex items-center gap-1.5 text-xs text-muted">
          <FileText className="h-3.5 w-3.5" />
          PDF, DOC, or DOCX. Maximum 5 MB.
        </p>
      </div>

      <TextAreaField
        label="Cover note"
        name="message"
        rows={4}
        placeholder="Optional — tell us briefly why you would be a good fit."
      />

      <CheckboxField name="consent" required>
        I confirm the information provided is accurate and agree to the{" "}
        <a href={privacyHref} className="text-cyprus underline underline-offset-2">
          privacy policy
        </a>
        .
      </CheckboxField>

      <TurnstileWidget siteKey={turnstileSiteKey} />

      {error ? <FormAlert tone="error">{error}</FormAlert> : null}

      <Button type="submit" size="lg" disabled={status === "submitting"}>
        {status === "submitting" ? "Submitting…" : "Submit application"}
        <Send className="h-4 w-4" />
      </Button>
    </form>
  );
}
