import { NextRequest } from "next/server";
import { requireAdminPermission, adminJson, withAdminErrorBoundary } from "@/lib/admin/auth/verify-admin";
import { listOrders, getOrderStats } from "@/lib/admin/repositories/order.repository";
import type { OrderStatus } from "@prisma/client";

export const GET = withAdminErrorBoundary(async (req: NextRequest) => {
  await requireAdminPermission("orders:read");

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status") as OrderStatus | null;
  const search = searchParams.get("search") ?? undefined;
  const page = parseInt(searchParams.get("page") ?? "1", 10);

  const [result, stats] = await Promise.all([
    listOrders({ status: status ?? undefined, search, page }),
    getOrderStats(),
  ]);

  return adminJson({ ...result, stats });
});
