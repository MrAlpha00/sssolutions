import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { env, getSessionSecret } from "@/lib/env";
import { safeEqual, verifyPassword } from "./password";

export const ADMIN_COOKIE = "shr_admin_session";
const MAX_AGE_SECONDS = 60 * 60 * 8; // 8 hours

export interface AdminSession {
  email: string;
  name: string | null;
}

type ConfiguredAdmin = {
  email: string;
  password?: string;
  passwordHash?: string;
  isDevFallback: boolean;
};

/**
 * Resolve the configured administrator.
 * - In production, credentials MUST come from environment variables.
 * - In development, a documented fallback is provided so the dashboard can be
 *   tested before real credentials exist.
 */
export function getConfiguredAdmin(): ConfiguredAdmin | null {
  if (env.adminEmail && (env.adminPasswordHash || env.adminPassword)) {
    return {
      email: env.adminEmail,
      password: env.adminPassword,
      passwordHash: env.adminPasswordHash,
      isDevFallback: false,
    };
  }
  if (env.nodeEnv !== "production") {
    return {
      email: "admin@supportivehr.local",
      password: "admin",
      isDevFallback: true,
    };
  }
  return null;
}

export function isAdminAuthConfigured(): boolean {
  return getConfiguredAdmin() !== null;
}

export function usingDevCredentials(): boolean {
  return getConfiguredAdmin()?.isDevFallback ?? false;
}

export async function verifyCredentials(
  email: string,
  password: string,
): Promise<AdminSession | null> {
  const admin = getConfiguredAdmin();
  if (!admin) return null;
  if (email.trim().toLowerCase() !== admin.email.toLowerCase()) return null;

  const ok = admin.passwordHash
    ? verifyPassword(password, admin.passwordHash)
    : admin.password
      ? safeEqual(password, admin.password)
      : false;

  if (!ok) return null;
  return { email: admin.email, name: null };
}

function sign(value: string): string {
  return createHmac("sha256", getSessionSecret()).update(value).digest("base64url");
}

export function createSessionToken(session: AdminSession): string {
  const payload = Buffer.from(
    JSON.stringify({ ...session, exp: Date.now() + MAX_AGE_SECONDS * 1000 }),
  ).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

export function verifySessionToken(token: string | undefined): AdminSession | null {
  if (!token) return null;
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return null;
  const expected = sign(payload);
  if (!safeEqual(signature, expected)) return null;
  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString()) as {
      email?: string;
      name?: string | null;
      exp?: number;
    };
    if (!data.email || !data.exp || data.exp < Date.now()) return null;
    return { email: data.email, name: data.name ?? null };
  } catch {
    return null;
  }
}

export async function setSessionCookie(token: string): Promise<void> {
  const store = await cookies();
  store.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: env.nodeEnv === "production",
    path: "/",
    maxAge: MAX_AGE_SECONDS,
  });
}

export async function clearSessionCookie(): Promise<void> {
  const store = await cookies();
  store.delete(ADMIN_COOKIE);
}

export async function getAdminSession(): Promise<AdminSession | null> {
  const store = await cookies();
  return verifySessionToken(store.get(ADMIN_COOKIE)?.value);
}

/** Server-component guard: redirects unauthenticated visitors to the login page. */
export async function requireAdmin(): Promise<AdminSession> {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");
  return session;
}

/**
 * Server-function guard for mutations. Throws instead of redirecting so that
 * unauthorized direct POSTs never mutate data.
 */
export async function assertAdmin(): Promise<AdminSession> {
  const session = await getAdminSession();
  if (!session) throw new Error("Unauthorized");
  return session;
}
