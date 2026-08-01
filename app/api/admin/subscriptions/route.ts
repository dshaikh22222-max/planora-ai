import { NextRequest } from "next/server";
import { requireAdminPermission, adminJson, withAdminErrorBoundary } from "@/lib/admin/auth/verify-admin";
import { listSubscriptions, getSubscriptionStats } from "@/lib/admin/repositories/subscription.repository";
import type { SubscriptionStatus } from "@prisma/client";

export const GET = withAdminErrorBoundary(async (req: NextRequest) => {
  await requireAdminPermission("subscriptions:read");

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status") as SubscriptionStatus | null;
  const provider = searchParams.get("provider") ?? undefined;
  const search = searchParams.get("search") ?? undefined;
  const page = parseInt(searchParams.get("page") ?? "1", 10);

  const [result, stats] = await Promise.all([
    listSubscriptions({ status: status ?? undefined, provider, search, page }),
    getSubscriptionStats(),
  ]);

  return adminJson({ ...result, stats });
});
