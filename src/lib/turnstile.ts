import { env, isTurnstileConfigured } from "@/lib/env";

/**
 * Server-side Cloudflare Turnstile verification.
 *
 * - When keys are configured, the token is always verified against Cloudflare.
 * - When keys are absent, verification is skipped and a warning is logged
 *   (development / pre-launch). Configure both keys before production.
 */

export interface TurnstileResult {
  ok: boolean;
  skipped: boolean;
  error?: string;
}

let warned = false;

export async function verifyTurnstile(
  token: string | null | undefined,
  remoteIp?: string,
): Promise<TurnstileResult> {
  if (!isTurnstileConfigured()) {
    if (!warned) {
      console.warn(
        "[turnstile] TURNSTILE_SECRET_KEY / NEXT_PUBLIC_TURNSTILE_SITE_KEY are not set — captcha verification is skipped.",
      );
      warned = true;
    }
    return { ok: true, skipped: true };
  }

  if (!token) {
    return { ok: false, skipped: false, error: "Captcha verification is required." };
  }

  try {
    const body = new URLSearchParams();
    body.set("secret", env.turnstileSecretKey!);
    body.set("response", token);
    if (remoteIp) body.set("remoteip", remoteIp);

    const response = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      { method: "POST", body, cache: "no-store" },
    );
    const data = (await response.json()) as {
      success?: boolean;
      "error-codes"?: string[];
    };
    if (data.success) return { ok: true, skipped: false };
    return {
      ok: false,
      skipped: false,
      error: "Captcha verification failed. Please try again.",
    };
  } catch {
    return {
      ok: false,
      skipped: false,
      error: "Could not reach the captcha service. Please try again later.",
    };
  }
}
