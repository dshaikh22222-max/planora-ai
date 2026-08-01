// ─────────────────────────────────────────────────────────────
// POST /api/admin/auth/login
// Admin login with email + password.
// Returns signed session token as HttpOnly cookie.
// ─────────────────────────────────────────────────────────────

import { NextRequest } from "next/server";
import { z } from "zod";
import { findAdminByEmail, updateLastLogin, incrementFailedAttempts } from "@/lib/admin/repositories/admin-user.repository";
import { verifyPassword } from "@/lib/admin/auth/hash-password";
import { signAdminToken, buildSessionPayload } from "@/lib/admin/auth/token";
import { createAdminSession, pruneExpiredSessions } from "@/lib/admin/auth/session";
import { writeAuditLog, getIpFromRequest } from "@/lib/admin/auth/audit";
import { adminJson, adminError } from "@/lib/admin/auth/verify-admin";
import { ADMIN_CONFIG } from "@/lib/admin/config";
import { checkIpRateLimit } from "@/lib/admin/auth/rate-limit";

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function POST(req: NextRequest): Promise<Response> {
  try {
    const body = await req.json();
    const parsed = LoginSchema.safeParse(body);

    if (!parsed.success) {
      return adminError("VALIDATION_ERROR", "Invalid email or password format", 400);
    }

    const { email, password } = parsed.data;
    const ip = getIpFromRequest(req) ?? "127.0.0.1";

    // IP Rate Limiting check
    const rateLimit = checkIpRateLimit(ip, 10, 15 * 60 * 1000);
    if (!rateLimit.allowed) {
      return adminError(
        "TOO_MANY_REQUESTS",
        `Too many login attempts from this IP. Please try again in ${rateLimit.retryAfterSeconds} seconds.`,
        429
      );
    }

    // Find admin user
    const admin = await findAdminByEmail(email);

    if (!admin || !admin.isActive) {
      // Constant-time: always compare even if user not found
      await verifyPassword(password, "$2a$12$invalidhashtopreventtimingattacks000000000000000");
      return adminError("INVALID_CREDENTIALS", "Invalid email or password", 401);
    }

    // Check account lockout
    if (admin.lockedUntil && admin.lockedUntil > new Date()) {
      const minutesLeft = Math.ceil((admin.lockedUntil.getTime() - Date.now()) / 60000);
      return adminError(
        "ACCOUNT_LOCKED",
        `Account locked. Try again in ${minutesLeft} minute(s).`,
        429
      );
    }

    // Verify password
    const valid = await verifyPassword(password, admin.passwordHash);

    if (!valid) {
      const attempts = admin.failedLoginAttempts + 1;
      const shouldLock = attempts >= ADMIN_CONFIG.maxLoginAttempts;
      const lockUntil = shouldLock
        ? new Date(Date.now() + ADMIN_CONFIG.lockoutDurationMs)
        : undefined;

      await incrementFailedAttempts(admin.id, shouldLock, lockUntil);

      await writeAuditLog({
        adminUserId: admin.id,
        action: "auth.login.failed",
        ipAddress: ip,
      });

      return adminError("INVALID_CREDENTIALS", "Invalid email or password", 401);
    }

    // Success — build token
    const payload = buildSessionPayload({
      id: admin.id,
      email: admin.email,
      name: admin.name,
      role: admin.role as import("@/lib/admin/domain/admin-user.types").AdminRole,
    });

    const token = await signAdminToken(payload);

    // Persist session to DB (for audit/revocation)
    await createAdminSession({
      adminUserId: admin.id,
      token,
      ipAddress: ip,
      userAgent: req.headers.get("user-agent") ?? undefined,
    });

    // Update last login + reset failed attempts
    await updateLastLogin(admin.id);

    // Background: prune old sessions
    pruneExpiredSessions().catch(() => {});

    await writeAuditLog({
      adminUserId: admin.id,
      action: "auth.login.success",
      ipAddress: ip,
    });

    // Set HttpOnly cookie
    const response = adminJson({
      id: admin.id,
      email: admin.email,
      name: admin.name,
      role: admin.role,
    });

    const headers = new Headers(response.headers);
    headers.set(
      "Set-Cookie",
      [
        `${ADMIN_CONFIG.cookieName}=${token}`,
        `Max-Age=${ADMIN_CONFIG.sessionDurationSec}`,
        "Path=/",
        "HttpOnly",
        "SameSite=Strict",
        process.env.NODE_ENV === "production" ? "Secure" : "",
      ]
        .filter(Boolean)
        .join("; ")
    );

    return new Response(response.body, { status: 200, headers });
  } catch (err) {
    console.error("[Admin Login Error]", err);
    return adminError("INTERNAL_ERROR", "Login failed. Please try again.", 500);
  }
}
