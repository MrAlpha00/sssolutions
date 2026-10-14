"use client";

import { useActionState } from "react";

import { Button } from "@/components/ui/button";
import { loginAction } from "@/lib/auth/actions";

export function LoginForm({ showDevHint }: { showDevHint: boolean }) {
  const [state, formAction, pending] = useActionState(loginAction, null);

  return (
    <form action={formAction} className="space-y-5">
      <div>
        <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-cyprus">
          Email address
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="username"
          required
          className="w-full rounded-xl border border-line bg-cream px-3.5 py-2.5 text-sm text-ink focus:border-cyprus focus:outline-none"
        />
      </div>

      <div>
        <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-cyprus">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="w-full rounded-xl border border-line bg-cream px-3.5 py-2.5 text-sm text-ink focus:border-cyprus focus:outline-none"
        />
      </div>

      {state?.error ? (
        <p
          role="alert"
          className="rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800"
        >
          {state.error}
        </p>
      ) : null}

      <Button type="submit" size="lg" className="w-full" disabled={pending}>
        {pending ? "Signing in…" : "Sign in"}
      </Button>

      {showDevHint ? (
        <p className="rounded-xl border border-dashed border-line-dark bg-sand px-4 py-3 text-xs leading-relaxed text-muted">
          <strong className="text-cyprus">Development sign-in:</strong>{" "}
          admin@supportivehr.local / admin. Set <code>ADMIN_EMAIL</code>,{" "}
          <code>ADMIN_PASSWORD</code> (or <code>ADMIN_PASSWORD_HASH</code>), and{" "}
          <code>ADMIN_SESSION_SECRET</code> before deploying to production.
        </p>
      ) : null}
    </form>
  );
}
