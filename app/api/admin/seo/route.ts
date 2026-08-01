import { NextRequest } from "next/server";
import { z } from "zod";
import { requireAdminPermission, adminJson, adminError, withAdminErrorBoundary } from "@/lib/admin/auth/verify-admin";
import { listSeoMetadata, upsertSeoMetadata, deleteSeoMetadata, getSitemapStats } from "@/lib/admin/repositories/seo.repository";
import { writeAuditLog, getIpFromRequest } from "@/lib/admin/auth/audit";

const UpsertSeoSchema = z.object({
  path: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  keywords: z.array(z.string()).default([]),
  ogImage: z.string().url().optional(),
  canonical: z.string().url().optional(),
  noIndex: z.boolean().default(false),
});

export const GET = withAdminErrorBoundary(async () => {
  await requireAdminPermission("seo:read");

  const [items, stats] = await Promise.all([
    listSeoMetadata(),
    getSitemapStats(),
  ]);

  return adminJson({ items, stats });
});

export const POST = withAdminErrorBoundary(async (req: NextRequest) => {
  const session = await requireAdminPermission("seo:write");

  const body = await req.json();
  const parsed = UpsertSeoSchema.safeParse(body);
  if (!parsed.success) {
    return adminError("VALIDATION_ERROR", "Invalid SEO data", 400, parsed.error.flatten());
  }

  const data = parsed.data;
  await upsertSeoMetadata(data.path, {
    ...data,
    updatedBy: session.adminId,
  });

  await writeAuditLog({
    adminUserId: session.adminId,
    action: "seo.upsert",
    entityType: "SeoMetadata",
    after: { path: data.path, title: data.title },
    ipAddress: getIpFromRequest(req),
  });

  return adminJson({ success: true });
});

export const DELETE = withAdminErrorBoundary(async (req: NextRequest) => {
  const session = await requireAdminPermission("seo:write");

  const { searchParams } = new URL(req.url);
  const path = searchParams.get("path");
  if (!path) return adminError("BAD_REQUEST", "path parameter required", 400);

  await deleteSeoMetadata(path);

  await writeAuditLog({
    adminUserId: session.adminId,
    action: "seo.delete",
    entityType: "SeoMetadata",
    before: { path },
    ipAddress: getIpFromRequest(req),
  });

  return adminJson({ success: true });
});
