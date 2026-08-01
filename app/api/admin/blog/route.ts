import { NextRequest } from "next/server";
import { z } from "zod";
import { requireAdminPermission, adminJson, adminError, withAdminErrorBoundary } from "@/lib/admin/auth/verify-admin";
import { listBlogPosts, createBlogPost, getBlogStats } from "@/lib/admin/repositories/blog.repository";
import { generateSlug, estimateReadingTime } from "@/lib/admin/utils/format";
import { writeAuditLog, getIpFromRequest } from "@/lib/admin/auth/audit";
import type { ContentStatus } from "@prisma/client";

const CreatePostSchema = z.object({
  title: z.string().min(1).max(300),
  slug: z.string().optional(),
  excerpt: z.string().min(1).max(500),
  body: z.string().default(""),
  coverImage: z.string().url().optional(),
  status: z.enum(["DRAFT", "REVIEW", "PUBLISHED", "ARCHIVED"]).default("DRAFT"),
  publishedAt: z.string().datetime().optional(),
  tags: z.array(z.string()).default([]),
  seoTitle: z.string().optional(),
  seoDesc: z.string().optional(),
  seoKeywords: z.array(z.string()).default([]),
});

export const GET = withAdminErrorBoundary(async (req: NextRequest) => {
  await requireAdminPermission("blog:read");

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status") as ContentStatus | null;
  const search = searchParams.get("search") ?? undefined;
  const page = parseInt(searchParams.get("page") ?? "1", 10);

  const [result, stats] = await Promise.all([
    listBlogPosts({ status: status ?? undefined, search, page }),
    getBlogStats(),
  ]);

  return adminJson({ ...result, stats });
});

export const POST = withAdminErrorBoundary(async (req: NextRequest) => {
  const session = await requireAdminPermission("blog:write");

  const body = await req.json();
  const parsed = CreatePostSchema.safeParse(body);
  if (!parsed.success) {
    return adminError("VALIDATION_ERROR", "Invalid blog post data", 400, parsed.error.flatten());
  }

  const data = parsed.data;
  const slug = data.slug || generateSlug(data.title);
  const readingTime = estimateReadingTime(data.body);

  const post = await createBlogPost({
    ...data,
    slug,
    readingTime,
    authorId: session.adminId,
    publishedAt: data.publishedAt ? new Date(data.publishedAt) : undefined,
  });

  await writeAuditLog({
    adminUserId: session.adminId,
    action: "blog.create",
    entityType: "BlogPost",
    entityId: post.id,
    after: { title: data.title, status: data.status },
    ipAddress: getIpFromRequest(req),
  });

  return adminJson(post, 201);
});
