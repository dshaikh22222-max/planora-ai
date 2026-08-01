import { NextRequest } from "next/server";
import { z } from "zod";
import { requireAdminPermission, adminJson, adminError, withAdminErrorBoundary } from "@/lib/admin/auth/verify-admin";
import { listProducts, createProduct, getProductStats } from "@/lib/admin/repositories/product.repository";
import { generateSlug } from "@/lib/admin/utils/format";
import { writeAuditLog, getIpFromRequest } from "@/lib/admin/auth/audit";
import type { ProductStatus, ProductType } from "@prisma/client";

const CreateProductSchema = z.object({
  name: z.string().min(1).max(200),
  slug: z.string().optional(),
  shortDesc: z.string().min(1).max(500),
  longDesc: z.string().default(""),
  type: z.enum(["DIGITAL", "PHYSICAL", "SUBSCRIPTION", "SERVICE"]),
  price: z.number().int().min(0).default(0),
  comparePrice: z.number().int().min(0).optional(),
  thumbnailUrl: z.string().url().optional(),
  tags: z.array(z.string()).default([]),
  seoTitle: z.string().optional(),
  seoDesc: z.string().optional(),
  seoKeywords: z.array(z.string()).default([]),
});

export const GET = withAdminErrorBoundary(async (req: NextRequest) => {
  await requireAdminPermission("products:read");

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status") as ProductStatus | null;
  const type = searchParams.get("type") as ProductType | null;
  const search = searchParams.get("search") ?? undefined;
  const page = parseInt(searchParams.get("page") ?? "1", 10);

  const [result, stats] = await Promise.all([
    listProducts({ status: status ?? undefined, type: type ?? undefined, search, page }),
    getProductStats(),
  ]);

  return adminJson({ ...result, stats });
});

export const POST = withAdminErrorBoundary(async (req: NextRequest) => {
  const session = await requireAdminPermission("products:write");

  const body = await req.json();
  const parsed = CreateProductSchema.safeParse(body);
  if (!parsed.success) {
    return adminError("VALIDATION_ERROR", "Invalid product data", 400, parsed.error.flatten());
  }

  const data = parsed.data;
  const slug = data.slug || generateSlug(data.name);

  const product = await createProduct({ ...data, slug });

  await writeAuditLog({
    adminUserId: session.adminId,
    action: "product.create",
    entityType: "Product",
    entityId: product.id,
    after: { name: data.name, type: data.type, slug },
    ipAddress: getIpFromRequest(req),
  });

  return adminJson(product, 201);
});
