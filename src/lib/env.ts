/**
 * Centralised, typed access to environment configuration.
 *
 * Nothing in this module should ever be rendered to the browser. Server-only
 * values (service-role keys, secrets, API keys) are read here and consumed by
 * server code. Public values use the `NEXT_PUBLIC_` prefix.
 */

function clean(value: string | undefined): string | undefined {
  if (!value) return undefined;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

export const env = {
  nodeEnv: process.env.NODE_ENV ?? "development",
  siteUrl: clean(process.env.NEXT_PUBLIC_SITE_URL) ?? "http://localhost:3000",

  // Supabase
  supabaseUrl: clean(process.env.NEXT_PUBLIC_SUPABASE_URL),
  supabaseAnonKey: clean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
  supabaseServiceRoleKey: clean(process.env.SUPABASE_SERVICE_ROLE_KEY),
  supabaseStorageBucket: clean(process.env.SUPABASE_STORAGE_BUCKET) ?? "media",
  supabasePrivateBucket: clean(process.env.SUPABASE_PRIVATE_BUCKET) ?? "private",

  // Email (Resend)
  resendApiKey: clean(process.env.RESEND_API_KEY),
  resendFromEmail: clean(process.env.RESEND_FROM_EMAIL),
  contactToEmail: clean(process.env.CONTACT_TO_EMAIL),

  // Cloudflare Turnstile
  turnstileSiteKey: clean(process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY),
  turnstileSecretKey: clean(process.env.TURNSTILE_SECRET_KEY),

  // Public integrations
  calendlyUrl: clean(process.env.NEXT_PUBLIC_CALENDLY_URL),
  whatsappNumber: clean(process.env.NEXT_PUBLIC_WHATSAPP_NUMBER),

  // Admin (local auth fallback when Supabase Auth is not configured)
  adminEmail: clean(process.env.ADMIN_EMAIL),
  adminPassword: clean(process.env.ADMIN_PASSWORD),
  adminPasswordHash: clean(process.env.ADMIN_PASSWORD_HASH),
  adminSessionSecret: clean(process.env.ADMIN_SESSION_SECRET),
} as const;

/** True when the Supabase public client can be created. */
export function isSupabaseConfigured(): boolean {
  return Boolean(env.supabaseUrl && env.supabaseAnonKey);
}

/** True when privileged (server-side, RLS-bypassing) Supabase access is available. */
export function isSupabaseAdminConfigured(): boolean {
  return Boolean(env.supabaseUrl && env.supabaseServiceRoleKey);
}

export function isResendConfigured(): boolean {
  return Boolean(env.resendApiKey && env.resendFromEmail);
}

export function isTurnstileConfigured(): boolean {
  return Boolean(env.turnstileSecretKey && env.turnstileSiteKey);
}

export function isCalendlyConfigured(): boolean {
  return Boolean(env.calendlyUrl);
}

/**
 * Whether the local JSON fallback store should be used instead of Supabase.
 * This keeps the site fully functional (and the admin dashboard genuinely
 * persistent) before a Supabase project is provisioned.
 */
export function useLocalStore(): boolean {
  return !isSupabaseConfigured();
}

const DEV_SESSION_FALLBACK = "supportive-hr-dev-session-secret-change-me";

export function getSessionSecret(): string {
  return env.adminSessionSecret ?? DEV_SESSION_FALLBACK;
}
