import { NextRequest } from "next/server";
import { requireAdminPermission, adminJson, withAdminErrorBoundary } from "@/lib/admin/auth/verify-admin";
import { listAuditLogs } from "@/lib/admin/repositories/audit.repository";
import { listAdminUsers } from "@/lib/admin/repositories/admin-user.repository";

export const GET = withAdminErrorBoundary(async (req: NextRequest) => {
  await requireAdminPermission("security:read");

  const { searchParams } = new URL(req.url);
  const action = searchParams.get("action") ?? undefined;
  const adminUserId = searchParams.get("adminUserId") ?? undefined;
  const page = parseInt(searchParams.get("page") ?? "1", 10);

  const [auditResult, adminUsers] = await Promise.all([
    listAuditLogs({ action, adminUserId, page, pageSize: 30 }),
    listAdminUsers(),
  ]);

  return adminJson({
    auditLogs: auditResult.items,
    totalLogs: auditResult.total,
    page: auditResult.page,
    totalPages: auditResult.totalPages,
    adminUsers,
  });
});
