import { NextRequest } from "next/server";
import { z } from "zod";
import { requireAdminPermission, adminJson, adminError, withAdminErrorBoundary } from "@/lib/admin/auth/verify-admin";
import { getOrderById, updateOrderStatus, addFulfillment, processRefund } from "@/lib/admin/repositories/order.repository";
import { issueRazorpayRefund } from "@/lib/admin/services/razorpay-admin";
import { writeAuditLog, getIpFromRequest } from "@/lib/admin/auth/audit";
import type { OrderStatus } from "@prisma/client";

const UpdateOrderSchema = z.object({
  status: z.enum(["PENDING", "PROCESSING", "FULFILLED", "SHIPPED", "DELIVERED", "REFUNDED", "CANCELLED", "FAILED"]).optional(),
  notes: z.string().optional(),
  fulfillment: z.object({
    carrier: z.string().min(1),
    trackingNumber: z.string().min(1),
    notes: z.string().optional(),
  }).optional(),
  refund: z.object({
    amountInPaise: z.number().int().positive().optional(),
    reason: z.string().min(1),
    issueRazorpayRefund: z.boolean().default(false),
    paymentId: z.string().optional(),
  }).optional(),
});

export const GET = withAdminErrorBoundary<{ params: { id: string } }>(async (_req, ctx) => {
  await requireAdminPermission("orders:read");
  const id = ctx?.params.id;
  if (!id) return adminError("BAD_REQUEST", "Order ID required", 400);

  const order = await getOrderById(id);
  if (!order) return adminError("NOT_FOUND", "Order not found", 404);

  return adminJson(order);
});

export const PUT = withAdminErrorBoundary<{ params: { id: string } }>(async (req: NextRequest, ctx) => {
  const session = await requireAdminPermission("orders:write");
  const id = ctx?.params.id;
  if (!id) return adminError("BAD_REQUEST", "Order ID required", 400);

  const body = await req.json();
  const parsed = UpdateOrderSchema.safeParse(body);
  if (!parsed.success) {
    return adminError("VALIDATION_ERROR", "Invalid order payload", 400, parsed.error.flatten());
  }

  const { status, notes, fulfillment, refund } = parsed.data;
  const before = await getOrderById(id);
  if (!before) return adminError("NOT_FOUND", "Order not found", 404);

  if (status) {
    await updateOrderStatus(id, status as OrderStatus, notes);
  }

  if (fulfillment) {
    await addFulfillment({
      orderId: id,
      carrier: fulfillment.carrier,
      trackingNumber: fulfillment.trackingNumber,
      notes: fulfillment.notes,
    });
  }

  if (refund) {
    const refundAmount = refund.amountInPaise ?? before.totalAmount;

    if (refund.issueRazorpayRefund && refund.paymentId) {
      await issueRazorpayRefund({
        paymentId: refund.paymentId,
        amountInPaise: refundAmount,
        notes: { reason: refund.reason, orderId: id },
      });
    }

    await processRefund(id, refundAmount, refund.reason);
  }

  await writeAuditLog({
    adminUserId: session.adminId,
    action: refund ? "order.refund" : fulfillment ? "order.fulfill" : "order.update",
    entityType: "Order",
    entityId: id,
    before: { status: before.status },
    after: { status, fulfillment, refund },
    ipAddress: getIpFromRequest(req),
  });

  return adminJson({ success: true });
});
