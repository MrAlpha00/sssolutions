#!/usr/bin/env node
/**
 * Generate a password hash for ADMIN_PASSWORD_HASH.
 *
 *   npm run hash-password "your-strong-password"
 *
 * The output uses the same `scrypt:<salt>:<hash>` format as
 * `src/lib/auth/password.ts`, so it can be pasted straight into `.env.local`.
 */
import { randomBytes, scryptSync } from "node:crypto";

const password = process.argv[2];

if (!password) {
  console.error('Usage: npm run hash-password "your-strong-password"');
  process.exit(1);
}

const KEY_LEN = 64;
const salt = randomBytes(16).toString("hex");
const hash = scryptSync(password, salt, KEY_LEN).toString("hex");

console.log(`ADMIN_PASSWORD_HASH=scrypt:${salt}:${hash}`);
