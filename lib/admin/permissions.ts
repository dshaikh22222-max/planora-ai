// ─────────────────────────────────────────────────────────────
// RBAC Permission Matrix
// Every admin API route and use-case calls requirePermission()
// before doing any work. Central, auditable, SOLID.
// ─────────────────────────────────────────────────────────────

import type { AdminRole, Permission } from "./domain/admin-user.types";

/** Full permission set for each role */
export const ROLE_PERMISSIONS: Record<AdminRole, Permission[]> = {
  SUPER_ADMIN: [
    "admin_users:read", "admin_users:write",
    "audit:read",
    "products:read", "products:write", "products:delete",
    "blog:read", "blog:write", "blog:delete",
    "pages:read", "pages:write",
    "settings:read", "settings:write",
    "media:read", "media:write", "media:delete",
    "users:read", "users:write",
    "orders:read", "orders:write", "orders:fulfill", "orders:refund",
    "subscriptions:read", "subscriptions:write", "subscriptions:manage",
    "analytics:read",
    "seo:read", "seo:write",
    "backup:trigger", "backup:read",
    "security:read",
  ],

  ADMIN: [
    "audit:read",
    "products:read", "products:write", "products:delete",
    "blog:read", "blog:write", "blog:delete",
    "pages:read", "pages:write",
    "settings:read", "settings:write",
    "media:read", "media:write", "media:delete",
    "users:read", "users:write",
    "orders:read", "orders:write", "orders:fulfill", "orders:refund",
    "subscriptions:read", "subscriptions:write", "subscriptions:manage",
    "analytics:read",
    "seo:read", "seo:write",
  ],

  EDITOR: [
    "products:read", "products:write",
    "blog:read", "blog:write", "blog:delete",
    "pages:read", "pages:write",
    "media:read", "media:write", "media:delete",
    "seo:read", "seo:write",
  ],

  SUPPORT: [
    "users:read", "users:write",
    "orders:read", "orders:fulfill",
    "subscriptions:read", "subscriptions:manage",
    "analytics:read",
  ],

  ANALYST: [
    "users:read",
    "orders:read",
    "subscriptions:read",
    "analytics:read",
  ],
};

/**
 * Check whether a role has a specific permission.
 * Returns true/false — does NOT throw.
 */
export function hasPermission(role: AdminRole, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}

/**
 * Enforce a permission — throws a typed error if denied.
 * Call this at the top of every admin API route handler and use-case.
 *
 * @example
 * requirePermission(adminUser.role, "products:write");
 */
export function requirePermission(role: AdminRole, permission: Permission): void {
  if (!hasPermission(role, permission)) {
    const err = new Error(
      `Permission denied: role "${role}" does not have "${permission}"`
    );
    (err as NodeJS.ErrnoException).code = "PERMISSION_DENIED";
    throw err;
  }
}

/**
 * Get the full list of permissions for a given role.
 * Used by /api/admin/auth/me to inform the frontend.
 */
export function getPermissionsForRole(role: AdminRole): Permission[] {
  return ROLE_PERMISSIONS[role] ?? [];
}

/**
 * Hierarchy helper — is role A >= role B in privilege level?
 */
const ROLE_RANK: Record<AdminRole, number> = {
  SUPER_ADMIN: 5,
  ADMIN: 4,
  EDITOR: 3,
  SUPPORT: 2,
  ANALYST: 1,
};

export function isAtLeastRole(role: AdminRole, minimum: AdminRole): boolean {
  return ROLE_RANK[role] >= ROLE_RANK[minimum];
}
