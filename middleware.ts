// ─────────────────────────────────────────────────────────────
// Next.js Middleware — Admin Route Protection
//
// Runs on Vercel Edge runtime. Protects:
//   /admin/**       → Admin UI pages
//   /api/admin/**   → Admin API routes
//
// Uses Web Crypto (verifyAdminToken) — NO Prisma, NO Node.js.
// Existing routes (/, /blog, /api/auth/**, etc.) are untouched.
// ─────────────────────────────────────────────────────────────

import { NextRequest, NextResponse } from "next/server";
import { verifyAdminToken } from "@/lib/admin/auth/token";
import { ADMIN_CONFIG } from "@/lib/admin/config";

// Public admin paths that don't require authentication
const PUBLIC_ADMIN_PATHS = [
  ADMIN_CONFIG.loginPath,           // /admin/login
  "/api/admin/auth/login",          // Login API endpoint
];

export async function middleware(req: NextRequest): Promise<NextResponse> {
  const { pathname } = req.nextUrl;

  // ── Only intercept admin routes ────────────────────────────
  const isAdminRoute =
    pathname.startsWith("/admin") || pathname.startsWith("/api/admin");

  if (!isAdminRoute) {
    return NextResponse.next();
  }

  // ── Allow public admin paths (login page + login API) ─────
  const isPublic = PUBLIC_ADMIN_PATHS.some(
    (p) => pathname === p || pathname.startsWith(p + "/")
  );

  if (isPublic) {
    return NextResponse.next();
  }

  // ── Read and verify admin session cookie ──────────────────
  const token = req.cookies.get(ADMIN_CONFIG.cookieName)?.value;

  if (!token) {
    return redirectToLogin(req);
  }

  const payload = await verifyAdminToken(token);

  if (!payload) {
    return redirectToLogin(req, true);
  }

  // ── Inject admin identity into request headers ────────────
  // Route handlers read these via req.headers.get(...)
  const response = NextResponse.next();
  response.headers.set("x-admin-id", payload.adminId);
  response.headers.set("x-admin-role", payload.role);
  response.headers.set("x-admin-email", payload.email);

  return response;
}

// ── Helpers ────────────────────────────────────────────────────

function redirectToLogin(req: NextRequest, clearCookie = false): NextResponse {
  const { pathname, search } = req.nextUrl;

  // For API routes, return 401 JSON instead of redirecting
  if (pathname.startsWith("/api/admin")) {
    return new NextResponse(
      JSON.stringify({ error: { code: "UNAUTHORIZED", message: "Admin session required" } }),
      { status: 401, headers: { "Content-Type": "application/json" } }
    );
  }

  // For page routes, redirect to login with ?next= for post-login redirect
  const loginUrl = req.nextUrl.clone();
  loginUrl.pathname = ADMIN_CONFIG.loginPath;
  loginUrl.search = `?next=${encodeURIComponent(pathname + search)}`;

  const response = NextResponse.redirect(loginUrl);

  // Clear invalid/expired cookie
  if (clearCookie) {
    response.cookies.delete(ADMIN_CONFIG.cookieName);
  }

  return response;
}

// ── Matcher ────────────────────────────────────────────────────
// Only run middleware on admin routes.
// Existing routes are completely untouched.

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/admin/:path*",
  ],
};
