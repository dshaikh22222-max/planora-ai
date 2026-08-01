import { NextRequest } from "next/server";
import { z } from "zod";
import { requireAdminPermission, adminJson, adminError, withAdminErrorBoundary } from "@/lib/admin/auth/verify-admin";
import { getBlogPostById, updateBlogPost, deleteBlogPost } from "@/lib/admin/repositories/blog.repository";
import { estimateReadingTime } from "@/lib/admin/utils/format";
import { writeAuditLog, getIpFromRequest } from "@/lib/admin/auth/audit";

const UpdatePostSchema = z.object({
  title: z.string().min(1).max(300).optional(),
  slug: z.string().optional(),
  excerpt: z.string().max(500).optional(),
  body: z.string().optional(),
  coverImage: z.string().nullable().optional(),
  status: z.enum(["DRAFT", "REVIEW", "PUBLISHED", "ARCHIVED"]).optional(),
  publishedAt: z.string().datetime().nullable().optional(),
  tags: z.array(z.string()).optional(),
  seoTitle: z.string().nullable().optional(),
  seoDesc: z.string().nullable().optional(),
  seoKeywords: z.array(z.string()).optional(),
  ogImage: z.string().nullable().optional(),
});

export const GET = withAdminErrorBoundary<{ params: { id: string } }>(async (_req, ctx) => {
  await requireAdminPermission("blog:read");
  const id = ctx?.params.id;
  if (!id) return adminError("BAD_REQUEST", "Post ID required", 400);

  const post = await getBlogPostById(id);
  if (!post) return adminError("NOT_FOUND", "Post not found", 404);

  return adminJson(post);
});

export const PUT = withAdminErrorBoundary<{ params: { id: string } }>(async (req, ctx) => {
  const session = await requireAdminPermission("blog:write");
  const id = ctx?.params.id;
  if (!id) return adminError("BAD_REQUEST", "Post ID required", 400);

  const body = await req.json();
  const parsed = UpdatePostSchema.safeParse(body);
  if (!parsed.success) {
    return adminError("VALIDATION_ERROR", "Invalid post data", 400, parsed.error.flatten());
  }

  const data = parsed.data;
  const readingTime = data.body ? estimateReadingTime(data.body) : undefined;

  const before = await getBlogPostById(id);
  if (!before) return adminError("NOT_FOUND", "Post not found", 404);

  await updateBlogPost(id, {
    ...data,
    readingTime,
    publishedAt: data.publishedAt === null ? null : data.publishedAt ? new Date(data.publishedAt) : undefined,
  });

  await writeAuditLog({
    adminUserId: session.adminId,
    action: "blog.update",
    entityType: "BlogPost",
    entityId: id,
    before: { status: before.status, title: before.title },
    after: { status: data.status, title: data.title },
    ipAddress: getIpFromRequest(req),
  });

  return adminJson({ success: true });
});

export const DELETE = withAdminErrorBoundary<{ params: { id: string } }>(async (req, ctx) => {
  const session = await requireAdminPermission("blog:delete");
  const id = ctx?.params.id;
  if (!id) return adminError("BAD_REQUEST", "Post ID required", 400);

  const post = await getBlogPostById(id);
  if (!post) return adminError("NOT_FOUND", "Post not found", 404);

  await deleteBlogPost(id);

  await writeAuditLog({
    adminUserId: session.adminId,
    action: "blog.delete",
    entityType: "BlogPost",
    entityId: id,
    before: { title: post.title },
    ipAddress: getIpFromRequest(req),
  });

  return adminJson({ success: true });
});
