import { NextRequest } from "next/server";
import { requireAdminPermission, adminJson, withAdminErrorBoundary } from "@/lib/admin/auth/verify-admin";
import { getAnalyticsData } from "@/lib/admin/repositories/analytics.repository";

export const GET = withAdminErrorBoundary(async () => {
  await requireAdminPermission("analytics:read");
  const data = await getAnalyticsData();
  return adminJson(data);
});
