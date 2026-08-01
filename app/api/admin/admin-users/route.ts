import { NextRequest } from "next/server";
import { z } from "zod";
import { requireAdminPermission, adminJson, adminError, withAdminErrorBoundary } from "@/lib/admin/auth/verify-admin";
import { listAdminUsers, createAdminUser, updateAdminUser, findAdminByEmail } from "@/lib/admin/repositories/admin-user.repository";
import { hashPassword } from "@/lib/admin/auth/hash-password";
import { writeAuditLog, getIpFromRequest } from "@/lib/admin/auth/audit";
import { AdminRole } from "@prisma/client";

const CreateAdminSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1),
  password: z.string().min(12, "Password must be at least 12 characters"),
  role: z.enum(["SUPER_ADMIN", "ADMIN", "EDITOR", "SUPPORT", "ANALYST"]),
});

const UpdateAdminSchema = z.object({
  id: z.string().min(1),
  name: z.string().optional(),
  role: z.enum(["SUPER_ADMIN", "ADMIN", "EDITOR", "SUPPORT", "ANALYST"]).optional(),
  isActive: z.boolean().optional(),
});

export const GET = withAdminErrorBoundary(async () => {
  await requireAdminPermission("admin_users:read");
  const users = await listAdminUsers();
  return adminJson({ users });
});

export const POST = withAdminErrorBoundary(async (req: NextRequest) => {
  const session = await requireAdminPermission("admin_users:write");

  const body = await req.json();
  const parsed = CreateAdminSchema.safeParse(body);
  if (!parsed.success) {
    return adminError("VALIDATION_ERROR", "Invalid admin user payload", 400, parsed.error.flatten());
  }

  const { email, name, password, role } = parsed.data;

  const existing = await findAdminByEmail(email);
  if (existing) {
    return adminError("EMAIL_EXISTS", `Admin user with email ${email} already exists`, 409);
  }

  const passwordHash = await hashPassword(password);
  const newAdmin = await createAdminUser({
    email,
    name,
    passwordHash,
    role: role as AdminRole,
  });

  await writeAuditLog({
    adminUserId: session.adminId,
    action: "admin_user.create",
    entityType: "AdminUser",
    entityId: newAdmin.id,
    after: { email, role },
    ipAddress: getIpFromRequest(req),
  });

  return adminJson(newAdmin, 201);
});

export const PUT = withAdminErrorBoundary(async (req: NextRequest) => {
  const session = await requireAdminPermission("admin_users:write");

  const body = await req.json();
  const parsed = UpdateAdminSchema.safeParse(body);
  if (!parsed.success) {
    return adminError("VALIDATION_ERROR", "Invalid update payload", 400, parsed.error.flatten());
  }

  const { id, name, role, isActive } = parsed.data;

  await updateAdminUser(id, {
    ...(name ? { name } : {}),
    ...(role ? { role: role as AdminRole } : {}),
    ...(isActive !== undefined ? { isActive } : {}),
  });

  await writeAuditLog({
    adminUserId: session.adminId,
    action: "admin_user.update",
    entityType: "AdminUser",
    entityId: id,
    after: { name, role, isActive },
    ipAddress: getIpFromRequest(req),
  });

  return adminJson({ success: true });
});
