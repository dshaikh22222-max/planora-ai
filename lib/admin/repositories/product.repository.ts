// ─────────────────────────────────────────────────────────────
// Product Repository — Prisma data access layer
// No business logic — only DB queries.
// ─────────────────────────────────────────────────────────────

import { prisma } from "@/lib/prisma";
import type { ProductStatus, ProductType } from "@prisma/client";

export type ProductListItem = {
  id: string;
  slug: string;
  name: string;
  type: string;
  status: string;
  price: number;
  thumbnailUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type ProductDetail = {
  id: string;
  slug: string;
  name: string;
  shortDesc: string;
  longDesc: string;
  type: string;
  status: string;
  price: number;
  comparePrice: number | null;
  currency: string;
  thumbnailUrl: string | null;
  tags: string[];
  seoTitle: string | null;
  seoDesc: string | null;
  seoKeywords: string[];
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
  digitalAsset: {
    id: string;
    fileUrl: string | null;
    fileName: string | null;
    fileSize: number | null;
    fileType: string | null;
    promptText: string | null;
    version: string;
    downloadLimit: number | null;
  } | null;
  physicalDetails: {
    id: string;
    sku: string;
    stock: number;
    weight: number | null;
    dimensions: unknown;
    shippingClass: string | null;
    warehouseNote: string | null;
  } | null;
};

// ── Queries ────────────────────────────────────────────────────

export async function listProducts(filters?: {
  status?: ProductStatus;
  type?: ProductType;
  search?: string;
  page?: number;
  pageSize?: number;
}) {
  const page = filters?.page ?? 1;
  const pageSize = filters?.pageSize ?? 20;
  const skip = (page - 1) * pageSize;

  const where = {
    ...(filters?.status ? { status: filters.status } : {}),
    ...(filters?.type ? { type: filters.type } : {}),
    ...(filters?.search
      ? { name: { contains: filters.search, mode: "insensitive" as const } }
      : {}),
  };

  const [items, total] = await Promise.all([
    prisma.product.findMany({
      where,
      select: {
        id: true,
        slug: true,
        name: true,
        type: true,
        status: true,
        price: true,
        thumbnailUrl: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
      skip,
      take: pageSize,
    }),
    prisma.product.count({ where }),
  ]);

  return { items, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
}

export async function getProductById(id: string): Promise<ProductDetail | null> {
  return prisma.product.findUnique({
    where: { id },
    include: {
      digitalAsset: true,
      physicalDetails: true,
    },
  }) as Promise<ProductDetail | null>;
}

export async function getProductBySlug(slug: string): Promise<ProductDetail | null> {
  return prisma.product.findUnique({
    where: { slug },
    include: { digitalAsset: true, physicalDetails: true },
  }) as Promise<ProductDetail | null>;
}

// ── Mutations ──────────────────────────────────────────────────

export async function createProduct(data: {
  slug: string;
  name: string;
  shortDesc: string;
  longDesc: string;
  type: ProductType;
  price: number;
  comparePrice?: number;
  thumbnailUrl?: string;
  tags?: string[];
  seoTitle?: string;
  seoDesc?: string;
  seoKeywords?: string[];
}): Promise<{ id: string }> {
  return prisma.product.create({
    data,
    select: { id: true },
  });
}

export async function updateProduct(
  id: string,
  data: Partial<{
    slug: string;
    name: string;
    shortDesc: string;
    longDesc: string;
    type: ProductType;
    status: ProductStatus;
    price: number;
    comparePrice: number | null;
    thumbnailUrl: string | null;
    tags: string[];
    seoTitle: string | null;
    seoDesc: string | null;
    seoKeywords: string[];
    sortOrder: number;
  }>
): Promise<void> {
  await prisma.product.update({ where: { id }, data });
}

export async function updateProductStatus(id: string, status: ProductStatus): Promise<void> {
  await prisma.product.update({ where: { id }, data: { status } });
}

export async function deleteProduct(id: string): Promise<void> {
  await prisma.product.delete({ where: { id } });
}

// ── Digital Asset ──────────────────────────────────────────────

export async function upsertDigitalAsset(
  productId: string,
  data: Partial<{
    fileUrl: string | null;
    fileName: string | null;
    fileSize: number | null;
    fileType: string | null;
    promptText: string | null;
    version: string;
    downloadLimit: number | null;
  }>
): Promise<void> {
  await prisma.digitalAsset.upsert({
    where: { productId },
    create: { productId, ...data },
    update: data,
  });
}

// ── Physical Product ───────────────────────────────────────────

export async function upsertPhysicalProduct(
  productId: string,
  data: Partial<{
    sku: string;
    stock: number;
    weight: number;
    dimensions: object;
    shippingClass: string;
    warehouseNote: string;
  }>
): Promise<void> {
  const existing = await prisma.physicalProduct.findUnique({ where: { productId } });
  if (existing) {
    await prisma.physicalProduct.update({ where: { productId }, data });
  } else {
    await prisma.physicalProduct.create({
      data: {
        productId,
        sku: data.sku ?? `SKU-${Date.now()}`,
        ...data,
      },
    });
  }
}

// ── Stats ──────────────────────────────────────────────────────

export async function getProductStats() {
  const [total, published, draft, digital, physical] = await Promise.all([
    prisma.product.count(),
    prisma.product.count({ where: { status: "PUBLISHED" } }),
    prisma.product.count({ where: { status: "DRAFT" } }),
    prisma.product.count({ where: { type: "DIGITAL" } }),
    prisma.product.count({ where: { type: "PHYSICAL" } }),
  ]);
  return { total, published, draft, digital, physical };
}
