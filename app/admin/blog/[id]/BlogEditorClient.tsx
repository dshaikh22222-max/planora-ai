"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Loader2, Eye, Trash2 } from "lucide-react";
import Link from "next/link";
import { RichTextEditor } from "@/components/admin/ui/RichTextEditor";
import { estimateReadingTime, generateSlug, formatDate } from "@/lib/admin/utils/format";
import { StatusBadge } from "@/components/admin/ui/StatusBadge";

interface Post {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  coverImage: string | null;
  status: string;
  publishedAt: Date | null;
  tags: string[];
  seoTitle: string | null;
  seoDesc: string | null;
  readingTime: number | null;
  updatedAt: Date;
}

export default function BlogEditorClient({ post }: { post: Post }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isDeleting, setIsDeleting] = useTransition();
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    body: post.body,
    coverImage: post.coverImage ?? "",
    status: post.status as "DRAFT" | "REVIEW" | "PUBLISHED" | "ARCHIVED",
    publishedAt: post.publishedAt ? new Date(post.publishedAt).toISOString().slice(0, 16) : "",
    tags: post.tags.join(", "),
    seoTitle: post.seoTitle ?? "",
    seoDesc: post.seoDesc ?? "",
  });

  function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    setSaved(false);
  }

  const readingTime = estimateReadingTime(form.body);

  async function handleSave(status?: typeof form.status) {
    setError(null);
    startTransition(async () => {
      const payload = {
        title: form.title,
        slug: form.slug || generateSlug(form.title),
        excerpt: form.excerpt,
        body: form.body,
        coverImage: form.coverImage || null,
        status: status ?? form.status,
        publishedAt:
          (status ?? form.status) === "PUBLISHED"
            ? form.publishedAt || new Date().toISOString()
            : null,
        tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
        readingTime,
        seoTitle: form.seoTitle || null,
        seoDesc: form.seoDesc || null,
      };

      const res = await fetch(`/api/admin/blog/${post.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error?.message ?? "Failed to save");
        return;
      }

      if (status) setForm((f) => ({ ...f, status }));
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    });
  }

  async function handleDelete() {
    if (!confirm("Delete this post permanently?")) return;
    setIsDeleting(async () => {
      await fetch(`/api/admin/blog/${post.id}`, { method: "DELETE" });
      router.push("/admin/blog");
    });
  }

  const inputCls = "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-ink-600 outline-none transition focus:border-blueprint-500 focus:ring-1 focus:ring-blueprint-500/20";
  const labelCls = "mb-1.5 block text-xs font-medium text-ink-400";

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/blog" className="rounded-lg border border-white/10 bg-white/5 p-2 text-ink-400 transition hover:text-white">
          <ArrowLeft size={16} />
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white truncate">{post.title}</h1>
            <StatusBadge status={form.status} size="xs" />
          </div>
          <p className="text-sm text-ink-500">
            {readingTime} min · Last saved {formatDate(post.updatedAt)}
          </p>
        </div>
        <div className="flex gap-2">
          {saved && <span className="text-xs text-emerald-400 self-center">Saved ✓</span>}
          <button onClick={() => handleSave()} disabled={isPending}
            className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-white/10 disabled:opacity-50">
            {isPending ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
            Save
          </button>
          {form.status !== "PUBLISHED" && (
            <button onClick={() => handleSave("PUBLISHED")} disabled={isPending}
              className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-500 disabled:opacity-50">
              <Eye size={14} /> Publish
            </button>
          )}
          <button onClick={handleDelete} disabled={isDeleting}
            className="rounded-xl border border-rose-800/40 bg-rose-900/20 p-2.5 text-rose-400 transition hover:bg-rose-900/40 disabled:opacity-50">
            <Trash2 size={15} />
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">
          {error}
        </div>
      )}

      <div className="grid grid-cols-3 gap-6">
        {/* Editor */}
        <div className="col-span-2 space-y-5">
          <input
            value={form.title}
            onChange={(e) => set("title", e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-transparent px-4 py-3 text-2xl font-bold text-white placeholder-ink-700 outline-none transition focus:border-blueprint-500"
          />
          <div>
            <label className={labelCls}>Slug</label>
            <input value={form.slug} onChange={(e) => set("slug", e.target.value)} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Excerpt</label>
            <textarea value={form.excerpt} onChange={(e) => set("excerpt", e.target.value)} rows={2} className={inputCls + " resize-none"} />
          </div>
          <div>
            <label className={labelCls}>Body</label>
            <RichTextEditor content={form.body} onChange={(html) => set("body", html)} />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          <div className="rounded-xl border border-white/5 bg-ink-900 p-4 space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-ink-500">Status</h3>
            <select value={form.status} onChange={(e) => set("status", e.target.value as typeof form.status)} className={inputCls}>
              <option value="DRAFT">Draft</option>
              <option value="REVIEW">In Review</option>
              <option value="PUBLISHED">Published</option>
              <option value="ARCHIVED">Archived</option>
            </select>
          </div>
          <div className="rounded-xl border border-white/5 bg-ink-900 p-4 space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-ink-500">Cover Image</h3>
            {form.coverImage && <img src={form.coverImage} alt="" className="w-full rounded-lg object-cover aspect-video" />}
            <input value={form.coverImage} onChange={(e) => set("coverImage", e.target.value)} placeholder="Paste image URL" className={inputCls} />
          </div>
          <div className="rounded-xl border border-white/5 bg-ink-900 p-4 space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-ink-500">Tags</h3>
            <input value={form.tags} onChange={(e) => set("tags", e.target.value)} placeholder="ai, planning, tips" className={inputCls} />
          </div>
          <div className="rounded-xl border border-white/5 bg-ink-900 p-4 space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-ink-500">SEO</h3>
            <div>
              <label className={labelCls}>SEO Title</label>
              <input value={form.seoTitle} onChange={(e) => set("seoTitle", e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Meta Description</label>
              <textarea value={form.seoDesc} onChange={(e) => set("seoDesc", e.target.value)} rows={3} className={inputCls + " resize-none"} />
              <p className="mt-1 text-right text-[11px] text-ink-700">{form.seoDesc.length}/160</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
