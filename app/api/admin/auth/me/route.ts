// ─────────────────────────────────────────────────────────────
// GET /api/admin/auth/me
// Returns current admin user profile + permissions.
// Full DB-backed validation (token + session record).
// ─────────────────────────────────────────────────────────────

import { requireAdminSession, adminJson, adminError } from "@/lib/admin/auth/verify-admin";
import { isSessionValid } from "@/lib/admin/auth/session";
import { findAdminById } from "@/lib/admin/repositories/admin-user.repository";
import { getPermissionsForRole } from "@/lib/admin/permissions";
import { cookies } from "next/headers";
import { ADMIN_CONFIG } from "@/lib/admin/config";
import type { AdminRole } from "@/lib/admin/domain/admin-user.types";

export async function GET(): Promise<Response> {
  try {
    // 1. Verify HMAC token (fast, Edge-style check done in route layer too)
    const session = await requireAdminSession();

    // 2. DB-backed session check (revocation support)
    const cookieStore = await cookies();
    const token = cookieStore.get(ADMIN_CONFIG.cookieName)?.value ?? "";
    const dbValid = await isSessionValid(token);

    if (!dbValid) {
      return adminError("SESSION_REVOKED", "Session has been revoked. Please sign in again.", 401);
    }

    // 3. Get fresh user data
    const admin = await findAdminById(session.adminId);

    if (!admin || !admin.isActive) {
      return adminError("ACCOUNT_INACTIVE", "Admin account is inactive.", 403);
    }

    // 4. Build response
    const permissions = getPermissionsForRole(admin.role as AdminRole);

    return adminJson({
      id: admin.id,
      email: admin.email,
      name: admin.name,
      role: admin.role,
      totpEnabled: admin.totpEnabled,
      permissions,
      lastLoginAt: admin.lastLoginAt,
    });
  } catch (err) {
    if (err instanceof Response) return err;
    console.error("[Admin /me Error]", err);
    return adminError("INTERNAL_ERROR", "Failed to fetch admin profile", 500);
  }
}
