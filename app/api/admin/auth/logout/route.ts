// ─────────────────────────────────────────────────────────────
// POST /api/admin/auth/logout
// Revokes the current admin session and clears the cookie.
// ─────────────────────────────────────────────────────────────

import { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { revokeAdminSession } from "@/lib/admin/auth/session";
import { verifyAdminToken } from "@/lib/admin/auth/token";
import { writeAuditLog, getIpFromRequest } from "@/lib/admin/auth/audit";
import { ADMIN_CONFIG } from "@/lib/admin/config";
import { adminJson } from "@/lib/admin/auth/verify-admin";

export async function POST(req: NextRequest): Promise<Response> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_CONFIG.cookieName)?.value;

  if (token) {
    // Revoke session in DB
    await revokeAdminSession(token).catch(() => {});

    // Audit log (best-effort — don't block logout)
    verifyAdminToken(token).then((payload) => {
      if (payload) {
        writeAuditLog({
          adminUserId: payload.adminId,
          action: "auth.logout",
          ipAddress: getIpFromRequest(req),
        }).catch(() => {});
      }
    });
  }

  // Clear cookie regardless of whether token was found
  const response = adminJson({ success: true });
  const headers = new Headers(response.headers);
  headers.set(
    "Set-Cookie",
    `${ADMIN_CONFIG.cookieName}=; Max-Age=0; Path=/; HttpOnly; SameSite=Strict${
      process.env.NODE_ENV === "production" ? "; Secure" : ""
    }`
  );

  return new Response(response.body, { status: 200, headers });
}
