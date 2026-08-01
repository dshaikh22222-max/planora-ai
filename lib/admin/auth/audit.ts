// ─────────────────────────────────────────────────────────────
// Audit Log Helper — Node.js
// Logs every admin write action to AdminAuditLog.
// Call this from any API route handler or use-case after
// a successful state-changing operation.
// ─────────────────────────────────────────────────────────────

import { prisma } from "@/lib/prisma";

export interface AuditLogParams {
  adminUserId: string;
  action: string;          // e.g. "product.create", "user.ban", "order.refund"
  entityType?: string;     // e.g. "Product", "User", "Order"
  entityId?: string;
  before?: Record<string, unknown>;
  after?: Record<string, unknown>;
  ipAddress?: string;
}

/**
 * Write an immutable audit log entry.
 * This never throws — audit failure must never block the main operation.
 */
export async function writeAuditLog(params: AuditLogParams): Promise<void> {
  try {
    await prisma.adminAuditLog.create({
      data: {
        adminUserId: params.adminUserId,
        action: params.action,
        entityType: params.entityType,
        entityId: params.entityId,
        before: params.before as object ?? undefined,
        after: params.after as object ?? undefined,
        ipAddress: params.ipAddress,
      },
    });
  } catch (err) {
    // Log to console but never rethrow — audit must not block operations
    console.error("[AuditLog] Failed to write audit entry:", err);
  }
}

/**
 * Extract IP address from a Next.js Request object.
 */
export function getIpFromRequest(req: Request): string | undefined {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    undefined
  );
}
