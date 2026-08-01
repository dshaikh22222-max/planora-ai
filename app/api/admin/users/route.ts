import { NextRequest } from "next/server";
import { requireAdminPermission, adminJson, withAdminErrorBoundary } from "@/lib/admin/auth/verify-admin";
import { listEndUsers, getUserStats } from "@/lib/admin/repositories/user-mgmt.repository";

export const GET = withAdminErrorBoundary(async (req: NextRequest) => {
  await requireAdminPermission("users:read");

  const { searchParams } = new URL(req.url);
  const plan = searchParams.get("plan") ?? undefined;
  const search = searchParams.get("search") ?? undefined;
  const page = parseInt(searchParams.get("page") ?? "1", 10);

  const [result, stats] = await Promise.all([
    listEndUsers({ plan, search, page }),
    getUserStats(),
  ]);

  return adminJson({ ...result, stats });
});
