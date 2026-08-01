import { NextRequest } from "next/server";
import { requireAdminPermission, adminJson, adminError, withAdminErrorBoundary } from "@/lib/admin/auth/verify-admin";
import { getAllSettings, bulkUpsertSettings } from "@/lib/admin/repositories/settings.repository";
import { writeAuditLog, getIpFromRequest } from "@/lib/admin/auth/audit";
import { z } from "zod";

const BulkUpdateSchema = z.object({
  settings: z.array(z.object({
    key: z.string().min(1),
    value: z.string(),
  })).min(1),
});

export const GET = withAdminErrorBoundary(async () => {
  await requireAdminPermission("settings:read");
  const settings = await getAllSettings();
  return adminJson({ settings });
});

export const POST = withAdminErrorBoundary(async (req: NextRequest) => {
  const session = await requireAdminPermission("settings:write");

  const body = await req.json();
  const parsed = BulkUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return adminError("VALIDATION_ERROR", "Invalid settings data", 400, parsed.error.flatten());
  }

  await bulkUpsertSettings(parsed.data.settings, session.adminId);

  await writeAuditLog({
    adminUserId: session.adminId,
    action: "settings.bulk_update",
    after: { count: parsed.data.settings.length },
    ipAddress: getIpFromRequest(req),
  });

  return adminJson({ success: true, updated: parsed.data.settings.length });
});
