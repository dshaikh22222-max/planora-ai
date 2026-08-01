// ─────────────────────────────────────────────────────────────
// Admin Domain Types
// Pure TypeScript types — no Prisma, no external dependencies.
// These are the canonical shapes used across all admin modules.
// ─────────────────────────────────────────────────────────────

export type AdminRole =
  | "SUPER_ADMIN"
  | "ADMIN"
  | "EDITOR"
  | "SUPPORT"
  | "ANALYST";

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: AdminRole;
  isActive: boolean;
  totpEnabled: boolean;
  lastLoginAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

/** Shape stored inside the signed session token (Edge-compatible). */
export interface AdminSessionPayload {
  adminId: string;
  email: string;
  name: string;
  role: AdminRole;
  /** Unix timestamp (seconds) */
  exp: number;
  /** Issued-at Unix timestamp (seconds) */
  iat: number;
}

/** Returned by /api/admin/auth/me */
export interface AdminMeResponse {
  id: string;
  email: string;
  name: string;
  role: AdminRole;
  permissions: string[];
}

export type Permission =
  // Admin user management
  | "admin_users:read"
  | "admin_users:write"
  // Audit
  | "audit:read"
  // Products
  | "products:read"
  | "products:write"
  | "products:delete"
  // Blog
  | "blog:read"
  | "blog:write"
  | "blog:delete"
  // CMS pages
  | "pages:read"
  | "pages:write"
  // Site settings
  | "settings:read"
  | "settings:write"
  // Media
  | "media:read"
  | "media:write"
  | "media:delete"
  // Users (end-users)
  | "users:read"
  | "users:write"
  // Orders
  | "orders:read"
  | "orders:write"
  | "orders:fulfill"
  | "orders:refund"
  // Subscriptions
  | "subscriptions:read"
  | "subscriptions:write"
  | "subscriptions:manage"
  // Analytics
  | "analytics:read"
  // SEO
  | "seo:read"
  | "seo:write"
  // Backup
  | "backup:trigger"
  | "backup:read"
  // Security
  | "security:read";
