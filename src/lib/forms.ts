/** Shared constants for public form handling (client + server). */

/**
 * Hidden field used as a simple spam trap. Real people never see or fill it; a
 * bot that autofills every field will, and the server can quietly ignore it.
 */
export const HONEYPOT_FIELD = "website";

export type FormApiResponse = { ok: true } | { ok: false; error: string };
