// ─────────────────────────────────────────────────────────────
// Password Hashing — bcrypt wrappers
// Never used on Edge runtime (Node.js only, in API routes).
// ─────────────────────────────────────────────────────────────

import bcrypt from "bcryptjs";
import { ADMIN_CONFIG } from "../config";

/**
 * Hash a plain-text password using bcrypt.
 * Cost factor = 12 (OWASP recommended).
 */
export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, ADMIN_CONFIG.bcryptCostFactor);
}

/**
 * Compare a plain-text password against a stored bcrypt hash.
 * Returns true on match, false otherwise.
 */
export async function verifyPassword(
  plain: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}

/**
 * Validate password strength.
 * Rules: min 16 chars.
 * Returns null if valid, or an error message string.
 */
export function validatePasswordStrength(password: string): string | null {
  if (password.length < 16) {
    return "Password must be at least 16 characters.";
  }
  return null;
}
