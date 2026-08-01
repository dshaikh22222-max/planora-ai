// ─────────────────────────────────────────────────────────────
// Admin User Repository — Node.js (Prisma)
// Data access layer for AdminUser.
// No business logic here — only DB queries.
// ─────────────────────────────────────────────────────────────

import { prisma } from "@/lib/prisma";
import { AdminRole } from "@prisma/client";

// ── Types ──────────────────────────────────────────────────────

export type AdminUserRow = {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
  role: string;
  isActive: boolean;
  totpEnabled: boolean;
  failedLoginAttempts: number;
  lockedUntil: Date | null;
  lastLoginAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

// ── Queries ────────────────────────────────────────────────────

export async function findAdminByEmail(email: string): Promise<AdminUserRow | null> {
  return prisma.adminUser.findUnique({ where: { email } }) as Promise<AdminUserRow | null>;
}

export async function findAdminById(id: string): Promise<AdminUserRow | null> {
  return prisma.adminUser.findUnique({ where: { id } }) as Promise<AdminUserRow | null>;
}

export async function listAdminUsers(): Promise<Omit<AdminUserRow, "passwordHash">[]> {
  return prisma.adminUser.findMany({
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      isActive: true,
      totpEnabled: true,
      failedLoginAttempts: true,
      lockedUntil: true,
      lastLoginAt: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: { createdAt: "desc" },
  }) as Promise<Omit<AdminUserRow, "passwordHash">[]>;
}

// ── Mutations ──────────────────────────────────────────────────

export async function createAdminUser(data: {
  email: string;
  name: string;
  passwordHash: string;
  role: AdminRole;
}): Promise<AdminUserRow> {
  return prisma.adminUser.create({ data }) as Promise<AdminUserRow>;
}

export async function updateLastLogin(id: string): Promise<void> {
  await prisma.adminUser.update({
    where: { id },
    data: { lastLoginAt: new Date(), failedLoginAttempts: 0, lockedUntil: null },
  });
}

export async function incrementFailedAttempts(
  id: string,
  lock: boolean,
  lockUntil?: Date
): Promise<void> {
  await prisma.adminUser.update({
    where: { id },
    data: {
      failedLoginAttempts: { increment: 1 },
      ...(lock && lockUntil ? { lockedUntil: lockUntil } : {}),
    },
  });
}

export async function updateAdminUser(
  id: string,
  data: Partial<{
    name: string;
    email: string;
    passwordHash: string;
    role: AdminRole;
    isActive: boolean;
    totpSecret: string | null;
    totpEnabled: boolean;
  }>
): Promise<void> {
  await prisma.adminUser.update({ where: { id }, data });
}
