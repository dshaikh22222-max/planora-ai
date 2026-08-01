import type { Metadata } from "next";
import Link from "next/link";
import { listBlogPosts, getBlogStats } from "@/lib/admin/repositories/blog.repository";
import { StatsCard } from "@/components/admin/ui/StatsCard";
import { StatusBadge } from "@/components/admin/ui/StatusBadge";
import { formatDate, timeAgo } from "@/lib/admin/utils/format";
import { FileText, Plus, Clock, Eye, Edit3 } from "lucide-react";

export const metadata: Metadata = { title: "Blog" };

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; page?: string }>;
}) {
  const sp = await searchParams;
  const page = parseInt(sp.page ?? "1", 10);

  const [{ items, total, totalPages }, stats] = await Promise.all([
    listBlogPosts({ status: sp.status as never, page }),
    getBlogStats(),
  ]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Blog CMS</h1>
          <p className="text-sm text-ink-500">Write and manage blog posts</p>
        </div>
        <Link
          href="/admin/blog/new"
          className="flex items-center gap-2 rounded-xl bg-blueprint-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blueprint-900/40 transition hover:bg-blueprint-500"
        >
          <Plus size={15} />
          New Post
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <StatsCard title="Total" value={stats.total} icon={<FileText size={16} />} accent="blueprint" />
        <StatsCard title="Published" value={stats.published} icon={<Eye size={16} />} accent="emerald" />
        <StatsCard title="Drafts" value={stats.draft} icon={<Edit3 size={16} />} accent="amber" />
        <StatsCard title="In Review" value={stats.review} icon={<Clock size={16} />} accent="violet" />
      </div>

      {/* Status filter */}
      <div className="flex flex-wrap gap-2">
        {["All", "PUBLISHED", "DRAFT", "REVIEW", "ARCHIVED"].map((status) => {
          const isAll = status === "All";
          const isActive = isAll ? !sp.status : sp.status === status;
          const href = isAll ? "/admin/blog" : `/admin/blog?status=${status}`;
          return (
            <Link
              key={status}
              href={href}
              className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition ${
                isActive
                  ? "border-blueprint-500 bg-blueprint-600/20 text-blueprint-300"
                  : "border-white/10 bg-white/5 text-ink-400 hover:border-white/20 hover:text-white"
              }`}
            >
              {status === "All" ? "All Posts" : status.charAt(0) + status.slice(1).toLowerCase()}
            </Link>
          );
        })}
      </div>

      {/* Post list */}
      <div className="space-y-2">
        {items.length === 0 ? (
          <div className="rounded-xl border border-white/5 bg-ink-900 px-6 py-16 text-center">
            <FileText size={32} className="mx-auto mb-3 text-ink-700" />
            <p className="text-sm text-ink-500">No posts yet.</p>
            <Link
              href="/admin/blog/new"
              className="mt-3 inline-flex items-center gap-1.5 text-sm text-blueprint-400 hover:text-blueprint-300 transition"
            >
              <Plus size={14} /> Write the first post
            </Link>
          </div>
        ) : (
          items.map((post) => (
            <div
              key={post.id}
              className="flex items-start gap-4 rounded-xl border border-white/5 bg-ink-900 px-5 py-4 transition hover:border-white/10"
            >
              {/* Cover thumb */}
              {post.coverImage ? (
                <img
                  src={post.coverImage}
                  alt=""
                  className="h-16 w-24 shrink-0 rounded-lg object-cover"
                />
              ) : (
                <div className="flex h-16 w-24 shrink-0 items-center justify-center rounded-lg bg-white/5">
                  <FileText size={20} className="text-ink-700" />
                </div>
              )}

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <Link
                    href={`/admin/blog/${post.id}`}
                    className="truncate font-semibold text-white hover:text-blueprint-300 transition"
                  >
                    {post.title}
                  </Link>
                  <StatusBadge status={post.status} size="xs" />
                </div>
                <p className="mt-1 line-clamp-1 text-sm text-ink-500">{post.excerpt}</p>
                <div className="mt-2 flex flex-wrap items-center gap-3 text-[11px] text-ink-600">
                  {post.readingTime && (
                    <span className="flex items-center gap-1">
                      <Clock size={10} />
                      {post.readingTime} min read
                    </span>
                  )}
                  {post.publishedAt ? (
                    <span>Published {formatDate(post.publishedAt)}</span>
                  ) : (
                    <span>Updated {timeAgo(post.updatedAt)}</span>
                  )}
                  {post.tags.length > 0 && (
                    <span className="flex flex-wrap gap-1">
                      {post.tags.slice(0, 3).map((tag) => (
                        <span key={tag} className="rounded bg-white/5 px-1.5 py-0.5">
                          {tag}
                        </span>
                      ))}
                    </span>
                  )}
                </div>
              </div>

              <Link
                href={`/admin/blog/${post.id}`}
                className="shrink-0 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-ink-300 transition hover:border-white/20 hover:text-white"
              >
                Edit
              </Link>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <Link
              key={p}
              href={`/admin/blog?page=${p}${sp.status ? `&status=${sp.status}` : ""}`}
              className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-medium transition ${
                p === page ? "bg-blueprint-600 text-white" : "border border-white/10 text-ink-400 hover:text-white"
              }`}
            >
              {p}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
