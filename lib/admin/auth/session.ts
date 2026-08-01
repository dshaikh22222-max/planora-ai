// ─────────────────────────────────────────────────────────────
// Admin Session Manager — Node.js (Prisma + DB layer)
//
// Handles: create, revoke, cleanup of AdminSession records.
// These are DB-backed for revocation support.
// Token verification for middleware is in token.ts (Edge-safe).
// ─────────────────────────────────────────────────────────────

import { prisma } from "@/lib/prisma";
import { ADMIN_CONFIG } from "../config";
import crypto from "crypto";

/**
 * Create a new AdminSession in the database.
 * The `rawToken` is the full signed token string (stored for lookup).
 * Returns the token to be set in the cookie.
 */
export async function createAdminSession({
  adminUserId,
  token,
  ipAddress,
  userAgent,
}: {
  adminUserId: string;
  token: string;
  ipAddress?: string;
  userAgent?: string;
}): Promise<void> {
  const expiresAt = new Date(Date.now() + ADMIN_CONFIG.sessionDurationMs);

  await prisma.adminSession.create({
    data: {
      adminUserId,
      token,
      expiresAt,
      ipAddress,
      userAgent,
    },
  });
}

/**
 * Revoke a single session by token value (logout).
 */
export async function revokeAdminSession(token: string): Promise<void> {
  await prisma.adminSession.deleteMany({ where: { token } });
}

/**
 * Revoke all sessions for an admin user (force sign-out everywhere).
 */
export async function revokeAllAdminSessions(adminUserId: string): Promise<void> {
  await prisma.adminSession.deleteMany({ where: { adminUserId } });
}

/**
 * Check if a token exists and is not expired in DB.
 * Used by /api/admin/auth/me for full DB-backed validation.
 * (Middleware uses token.ts verifyAdminToken — no DB call.)
 */
export async function isSessionValid(token: string): Promise<boolean> {
  const session = await prisma.adminSession.findUnique({
    where: { token },
    select: { expiresAt: true },
  });
  if (!session) return false;
  return session.expiresAt > new Date();
}

/**
 * Prune expired sessions from DB (call from a CRON job or on login).
 */
export async function pruneExpiredSessions(): Promise<number> {
  const result = await prisma.adminSession.deleteMany({
    where: { expiresAt: { lt: new Date() } },
  });
  return result.count;
}

/**
 * Generate a cryptographically random session ID for any purpose.
 */
export function generateSecureId(): string {
  return crypto.randomBytes(32).toString("hex");
}
