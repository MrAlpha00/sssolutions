"use client";

import { useState, type FormEvent } from "react";

export type SubmitState = {
  status: "idle" | "submitting" | "success";
  error: string | null;
};

/**
 * Small shared helper for the public forms. Posts the form (as FormData, so
 * file uploads and the Turnstile token are included) to an API route and
 * normalises success/error handling.
 */
export function useFormSubmit(endpoint: string) {
  const [state, setState] = useState<SubmitState>({
    status: "idle",
    error: null,
  });

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setState({ status: "submitting", error: null });

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        body: new FormData(form),
      });
      const data = (await response.json().catch(() => null)) as
        | { ok?: boolean; error?: string }
        | null;

      if (!response.ok || !data?.ok) {
        throw new Error(
          data?.error ?? "We could not send your message. Please try again.",
        );
      }

      form.reset();
      if (typeof window !== "undefined" && window.turnstile) {
        window.turnstile.reset();
      }
      setState({ status: "success", error: null });
    } catch (error) {
      setState({
        status: "error",
        error:
          error instanceof Error
            ? error.message
            : "Something went wrong. Please try again.",
      });
    }
  }

  return {
    ...state,
    submit,
    reset: () => setState({ status: "idle", error: null }),
  };
}
