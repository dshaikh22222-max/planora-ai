// ─────────────────────────────────────────────────────────────
// Admin API Route Helper — Node.js
//
// Call at the top of every /api/admin/** route handler.
// Reads the session cookie, verifies the HMAC token,
// and returns the admin payload or throws a 401 Response.
// ─────────────────────────────────────────────────────────────

import { cookies } from "next/headers";
import { verifyAdminToken } from "./token";
import { ADMIN_CONFIG } from "../config";
import type { AdminSessionPayload } from "../domain/admin-user.types";
import type { AdminRole, Permission } from "../domain/admin-user.types";
import { requirePermission } from "../permissions";

/**
 * Verify the admin session from the request cookie.
 * Returns AdminSessionPayload if valid.
 * Returns null if missing / invalid / expired.
 */
export async function getAdminSession(): Promise<AdminSessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_CONFIG.cookieName)?.value;
  if (!token) return null;
  return verifyAdminToken(token);
}

/**
 * Assert that a valid admin session exists.
 * Throws a NextResponse 401 if not authenticated.
 * Use at the top of any admin API route.
 */
export async function requireAdminSession(): Promise<AdminSessionPayload> {
  const session = await getAdminSession();
  if (!session) {
    throw new Response(
      JSON.stringify({ error: { code: "UNAUTHORIZED", message: "Admin session required" } }),
      { status: 401, headers: { "Content-Type": "application/json" } }
    );
  }
  return session;
}

/**
 * Assert admin session AND a specific permission.
 * Throws 401 if not authenticated, 403 if missing permission.
 */
export async function requireAdminPermission(
  permission: Permission
): Promise<AdminSessionPayload> {
  const session = await requireAdminSession();
  try {
    requirePermission(session.role as AdminRole, permission);
  } catch {
    throw new Response(
      JSON.stringify({ error: { code: "FORBIDDEN", message: `Permission denied: ${permission}` } }),
      { status: 403, headers: { "Content-Type": "application/json" } }
    );
  }
  return session;
}

/**
 * Standard JSON success response helper.
 */
export function adminJson<T>(data: T, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

/**
 * Standard JSON error response helper.
 */
export function adminError(
  code: string,
  message: string,
  status: number,
  details?: unknown
): Response {
  return new Response(
    JSON.stringify({ error: { code, message, details: details ?? null } }),
    { status, headers: { "Content-Type": "application/json" } }
  );
}

import { NextRequest } from "next/server";

/**
 * Wrap a route handler to catch unhandled errors uniformly.
 */
export function withAdminErrorBoundary<T = { params: Record<string, string> }>(
  handler: (req: NextRequest, ctx: T) => Promise<Response>
) {
  return async (req: NextRequest, ctx: T): Promise<Response> => {
    try {
      return await handler(req, ctx);
    } catch (err) {
      // Re-throw Response objects (our own 401/403 throws)
      if (err instanceof Response) return err;

      const code = (err as NodeJS.ErrnoException).code;
      if (code === "PERMISSION_DENIED") {
        return adminError("FORBIDDEN", (err as Error).message, 403);
      }

      console.error("[Admin API Error]", err);
      return adminError("INTERNAL_ERROR", "An unexpected error occurred", 500);
    }
  };
}
