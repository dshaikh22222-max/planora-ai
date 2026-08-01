import { NextRequest } from "next/server";
import { z } from "zod";
import { requireAdminPermission, adminJson, adminError, withAdminErrorBoundary } from "@/lib/admin/auth/verify-admin";
import { getEndUserDetail, updateUserPlan } from "@/lib/admin/repositories/user-mgmt.repository";
import { writeAuditLog, getIpFromRequest } from "@/lib/admin/auth/audit";

const UpdateUserSchema = z.object({
  plan: z.enum(["Free", "Pro", "Developer", "Enterprise", "Government"]).optional(),
});

export const GET = withAdminErrorBoundary<{ params: { id: string } }>(async (_req, ctx) => {
  await requireAdminPermission("users:read");
  const id = ctx?.params.id;
  if (!id) return adminError("BAD_REQUEST", "User ID required", 400);

  const user = await getEndUserDetail(id);
  if (!user) return adminError("NOT_FOUND", "User not found", 404);

  return adminJson(user);
});

export const PUT = withAdminErrorBoundary<{ params: { id: string } }>(async (req: NextRequest, ctx) => {
  const session = await requireAdminPermission("users:write");
  const id = ctx?.params.id;
  if (!id) return adminError("BAD_REQUEST", "User ID required", 400);

  const body = await req.json();
  const parsed = UpdateUserSchema.safeParse(body);
  if (!parsed.success) {
    return adminError("VALIDATION_ERROR", "Invalid user payload", 400, parsed.error.flatten());
  }

  const { plan } = parsed.data;
  const before = await getEndUserDetail(id);
  if (!before) return adminError("NOT_FOUND", "User not found", 404);

  if (plan) {
    await updateUserPlan(id, plan);
  }

  await writeAuditLog({
    adminUserId: session.adminId,
    action: "user.update_plan",
    entityType: "User",
    entityId: id,
    before: { plan: before.plan },
    after: { plan },
    ipAddress: getIpFromRequest(req),
  });

  return adminJson({ success: true });
});
