import { NextRequest } from "next/server";
import { requireAdminPermission, adminJson, withAdminErrorBoundary } from "@/lib/admin/auth/verify-admin";
import { getDatabaseTableStats, listAuditLogs } from "@/lib/admin/repositories/audit.repository";
import { writeAuditLog, getIpFromRequest } from "@/lib/admin/auth/audit";
import { prisma } from "@/lib/prisma";

export const GET = withAdminErrorBoundary(async () => {
  await requireAdminPermission("backup:read");

  const [tables, logsResult] = await Promise.all([
    getDatabaseTableStats(),
    listAuditLogs({ pageSize: 20 }),
  ]);

  return adminJson({ tables, recentAuditLogs: logsResult.items });
});

export const POST = withAdminErrorBoundary(async (req: NextRequest) => {
  const session = await requireAdminPermission("backup:trigger");

  const [products, blogPosts, settings, seoMetadata] = await Promise.all([
    prisma.product.findMany({ include: { digitalAsset: true, physicalDetails: true } }),
    prisma.blogPost.findMany(),
    prisma.siteSettings.findMany(),
    prisma.seoMetadata.findMany(),
  ]);

  const backupData = {
    exportedAt: new Date().toISOString(),
    version: "1.0",
    tables: {
      products,
      blogPosts,
      settings,
      seoMetadata,
    },
  };

  await writeAuditLog({
    adminUserId: session.adminId,
    action: "backup.export",
    after: { timestamp: backupData.exportedAt },
    ipAddress: getIpFromRequest(req),
  });

  return new Response(JSON.stringify(backupData, null, 2), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Content-Disposition": `attachment; filename="planora-backup-${Date.now()}.json"`,
    },
  });
});
