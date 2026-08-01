import { prisma } from "@/lib/prisma";
import type { ContentStatus } from "@prisma/client";

// ── Queries ────────────────────────────────────────────────────

export async function listBlogPosts(filters?: {
  status?: ContentStatus;
  search?: string;
  page?: number;
  pageSize?: number;
}) {
  const page = filters?.page ?? 1;
  const pageSize = filters?.pageSize ?? 20;
  const skip = (page - 1) * pageSize;

  const where = {
    ...(filters?.status ? { status: filters.status } : {}),
    ...(filters?.search
      ? { title: { contains: filters.search, mode: "insensitive" as const } }
      : {}),
  };

  const [items, total] = await Promise.all([
    prisma.blogPost.findMany({
      where,
      select: {
        id: true, slug: true, title: true, status: true,
        publishedAt: true, authorId: true, readingTime: true,
        tags: true, createdAt: true, updatedAt: true, excerpt: true, coverImage: true,
      },
      orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
      skip,
      take: pageSize,
    }),
    prisma.blogPost.count({ where }),
  ]);

  return { items, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
}

export async function getBlogPostById(id: string) {
  return prisma.blogPost.findUnique({ where: { id } });
}

export async function getBlogPostBySlug(slug: string) {
  return prisma.blogPost.findUnique({ where: { slug } });
}

// ── Mutations ──────────────────────────────────────────────────

export async function createBlogPost(data: {
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  authorId: string;
  coverImage?: string;
  tags?: string[];
  readingTime?: number;
  seoTitle?: string;
  seoDesc?: string;
  seoKeywords?: string[];
  status?: ContentStatus;
  publishedAt?: Date;
}): Promise<{ id: string }> {
  return prisma.blogPost.create({ data, select: { id: true } });
}

export async function updateBlogPost(
  id: string,
  data: Partial<{
    slug: string;
    title: string;
    excerpt: string;
    body: string;
    coverImage: string | null;
    status: ContentStatus;
    publishedAt: Date | null;
    tags: string[];
    readingTime: number;
    seoTitle: string | null;
    seoDesc: string | null;
    seoKeywords: string[];
    ogImage: string | null;
  }>
): Promise<void> {
  await prisma.blogPost.update({ where: { id }, data });
}

export async function deleteBlogPost(id: string): Promise<void> {
  await prisma.blogPost.delete({ where: { id } });
}

export async function getBlogStats() {
  const [total, published, draft, review] = await Promise.all([
    prisma.blogPost.count(),
    prisma.blogPost.count({ where: { status: "PUBLISHED" } }),
    prisma.blogPost.count({ where: { status: "DRAFT" } }),
    prisma.blogPost.count({ where: { status: "REVIEW" } }),
  ]);
  return { total, published, draft, review };
}
