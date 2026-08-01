import { NextRequest } from "next/server";
import { z } from "zod";
import { requireAdminPermission, adminJson, adminError, withAdminErrorBoundary } from "@/lib/admin/auth/verify-admin";
import { getProductById, updateProduct, updateProductStatus, deleteProduct, upsertDigitalAsset, upsertPhysicalProduct } from "@/lib/admin/repositories/product.repository";
import { writeAuditLog, getIpFromRequest } from "@/lib/admin/auth/audit";
import type { ProductStatus } from "@prisma/client";

const UpdateProductSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  slug: z.string().optional(),
  shortDesc: z.string().max(500).optional(),
  longDesc: z.string().optional(),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED", "OUT_OF_STOCK"]).optional(),
  price: z.number().int().min(0).optional(),
  comparePrice: z.number().int().min(0).nullable().optional(),
  thumbnailUrl: z.string().nullable().optional(),
  tags: z.array(z.string()).optional(),
  seoTitle: z.string().nullable().optional(),
  seoDesc: z.string().nullable().optional(),
  seoKeywords: z.array(z.string()).optional(),
  // Digital asset fields
  digital: z.object({
    fileUrl: z.string().optional(),
    fileName: z.string().optional(),
    fileSize: z.number().optional(),
    fileType: z.string().optional(),
    promptText: z.string().optional(),
    version: z.string().optional(),
    downloadLimit: z.number().nullable().optional(),
  }).optional(),
  // Physical product fields
  physical: z.object({
    sku: z.string().optional(),
    stock: z.number().int().min(0).optional(),
    weight: z.number().optional(),
    shippingClass: z.string().optional(),
    warehouseNote: z.string().optional(),
  }).optional(),
});

export const GET = withAdminErrorBoundary<{ params: { id: string } }>(async (_req, ctx) => {
  await requireAdminPermission("products:read");
  const id = ctx?.params.id;
  if (!id) return adminError("BAD_REQUEST", "Product ID required", 400);

  const product = await getProductById(id);
  if (!product) return adminError("NOT_FOUND", "Product not found", 404);

  return adminJson(product);
});

export const PUT = withAdminErrorBoundary<{ params: { id: string } }>(async (req, ctx) => {
  const session = await requireAdminPermission("products:write");
  const id = ctx?.params.id;
  if (!id) return adminError("BAD_REQUEST", "Product ID required", 400);

  const body = await req.json();
  const parsed = UpdateProductSchema.safeParse(body);
  if (!parsed.success) {
    return adminError("VALIDATION_ERROR", "Invalid product data", 400, parsed.error.flatten());
  }

  const { digital, physical, ...productFields } = parsed.data;
  const before = await getProductById(id);
  if (!before) return adminError("NOT_FOUND", "Product not found", 404);

  await updateProduct(id, productFields as Parameters<typeof updateProduct>[1]);

  if (digital) await upsertDigitalAsset(id, digital);
  if (physical) await upsertPhysicalProduct(id, physical);

  await writeAuditLog({
    adminUserId: session.adminId,
    action: "product.update",
    entityType: "Product",
    entityId: id,
    before: { status: before.status, name: before.name },
    after: productFields,
    ipAddress: getIpFromRequest(req),
  });

  return adminJson({ success: true });
});

export const PATCH = withAdminErrorBoundary<{ params: { id: string } }>(async (req, ctx) => {
  const session = await requireAdminPermission("products:write");
  const id = ctx?.params.id;
  if (!id) return adminError("BAD_REQUEST", "Product ID required", 400);

  const { status } = await req.json();
  if (!status) return adminError("BAD_REQUEST", "status required", 400);

  await updateProductStatus(id, status as ProductStatus);

  await writeAuditLog({
    adminUserId: session.adminId,
    action: "product.status_change",
    entityType: "Product",
    entityId: id,
    after: { status },
    ipAddress: getIpFromRequest(req),
  });

  return adminJson({ success: true });
});

export const DELETE = withAdminErrorBoundary<{ params: { id: string } }>(async (req, ctx) => {
  const session = await requireAdminPermission("products:delete");
  const id = ctx?.params.id;
  if (!id) return adminError("BAD_REQUEST", "Product ID required", 400);

  const product = await getProductById(id);
  if (!product) return adminError("NOT_FOUND", "Product not found", 404);

  await deleteProduct(id);

  await writeAuditLog({
    adminUserId: session.adminId,
    action: "product.delete",
    entityType: "Product",
    entityId: id,
    before: { name: product.name, type: product.type },
    ipAddress: getIpFromRequest(req),
  });

  return adminJson({ success: true });
});
