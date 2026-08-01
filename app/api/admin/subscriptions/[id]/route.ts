import { NextRequest } from "next/server";
import { z } from "zod";
import { requireAdminPermission, adminJson, adminError, withAdminErrorBoundary } from "@/lib/admin/auth/verify-admin";
import { getSubscriptionById, updateSubscriptionStatus } from "@/lib/admin/repositories/subscription.repository";
import { cancelRazorpaySubscription } from "@/lib/admin/services/razorpay-admin";
import { writeAuditLog, getIpFromRequest } from "@/lib/admin/auth/audit";
import type { SubscriptionStatus } from "@prisma/client";

const UpdateSubscriptionSchema = z.object({
  status: z.enum(["ACTIVE", "PAST_DUE", "UNPAID", "CANCELLED", "EXPIRED", "TRIALING", "PAUSED"]).optional(),
  cancelAtPeriodEnd: z.boolean().optional(),
  cancelProviderSub: z.boolean().default(false),
});

export const GET = withAdminErrorBoundary<{ params: { id: string } }>(async (_req, ctx) => {
  await requireAdminPermission("subscriptions:read");
  const id = ctx?.params.id;
  if (!id) return adminError("BAD_REQUEST", "Subscription ID required", 400);

  const sub = await getSubscriptionById(id);
  if (!sub) return adminError("NOT_FOUND", "Subscription not found", 404);

  return adminJson(sub);
});

export const PUT = withAdminErrorBoundary<{ params: { id: string } }>(async (req: NextRequest, ctx) => {
  const session = await requireAdminPermission("subscriptions:write");
  const id = ctx?.params.id;
  if (!id) return adminError("BAD_REQUEST", "Subscription ID required", 400);

  const body = await req.json();
  const parsed = UpdateSubscriptionSchema.safeParse(body);
  if (!parsed.success) {
    return adminError("VALIDATION_ERROR", "Invalid subscription payload", 400, parsed.error.flatten());
  }

  const { status, cancelAtPeriodEnd, cancelProviderSub } = parsed.data;
  const before = await getSubscriptionById(id);
  if (!before) return adminError("NOT_FOUND", "Subscription not found", 404);

  if (cancelProviderSub && before.provider === "razorpay" && before.providerSubId) {
    try {
      await cancelRazorpaySubscription(before.providerSubId, cancelAtPeriodEnd);
    } catch (err) {
      console.warn("Razorpay subscription cancellation notice:", err);
    }
  }

  if (status) {
    await updateSubscriptionStatus(id, status as SubscriptionStatus, cancelAtPeriodEnd);
  }

  await writeAuditLog({
    adminUserId: session.adminId,
    action: "subscription.update",
    entityType: "Subscription",
    entityId: id,
    before: { status: before.status },
    after: { status, cancelAtPeriodEnd },
    ipAddress: getIpFromRequest(req),
  });

  return adminJson({ success: true });
});
