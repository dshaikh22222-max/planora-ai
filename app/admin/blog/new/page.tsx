"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Loader2, Eye } from "lucide-react";
import Link from "next/link";
import { RichTextEditor } from "@/components/admin/ui/RichTextEditor";
import { generateSlug, estimateReadingTime } from "@/lib/admin/utils/format";

export default function NewBlogPostPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    title: "",
    slug: "",
    excerpt: "",
    body: "",
    coverImage: "",
    status: "DRAFT" as "DRAFT" | "REVIEW" | "PUBLISHED",
    publishedAt: "",
    tags: "",
    seoTitle: "",
    seoDesc: "",
  });

  function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => {
      const updated = { ...f, [key]: value };
      if (key === "title" && !f.slug) updated.slug = generateSlug(String(value));
      return updated;
    });
  }

  const readingTime = estimateReadingTime(form.body);

  async function handleSave(status: typeof form.status = "DRAFT") {
    if (!form.title.trim()) { setError("Title is required"); return; }
    if (!form.excerpt.trim()) { setError("Excerpt is required"); return; }
    setError(null);

    startTransition(async () => {
      const payload = {
        title: form.title,
        slug: form.slug || generateSlug(form.title),
        excerpt: form.excerpt,
        body: form.body,
        coverImage: form.coverImage || undefined,
        status,
        publishedAt: status === "PUBLISHED" ? (form.publishedAt || new Date().toISOString()) : undefined,
        tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
        seoTitle: form.seoTitle || undefined,
        seoDesc: form.seoDesc || undefined,
      };

      const res = await fetch("/api/admin/blog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error?.message ?? "Failed to save post");
        return;
      }

      const { id } = await res.json();
      router.push(`/admin/blog/${id}`);
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
          <h1 className="text-xl font-bold text-white">New Blog Post</h1>
          <p className="text-sm text-ink-500">
            {readingTime} min read estimate
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => handleSave("DRAFT")} disabled={isPending}
            className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-white/10 disabled:opacity-50">
            {isPending ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
            Save Draft
          </button>
          <button onClick={() => handleSave("REVIEW")} disabled={isPending}
            className="flex items-center gap-2 rounded-xl border border-amber-600/40 bg-amber-600/15 px-4 py-2.5 text-sm font-medium text-amber-300 transition hover:bg-amber-600/25 disabled:opacity-50">
            Submit for Review
          </button>
          <button onClick={() => handleSave("PUBLISHED")} disabled={isPending}
            className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-900/40 transition hover:bg-emerald-500 disabled:opacity-50">
            {isPending ? <Loader2 size={14} className="animate-spin" /> : <Eye size={14} />}
            Publish
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">
          {error}
        </div>
      )}

      <div className="grid grid-cols-3 gap-6">
        {/* Main editor — 2/3 width */}
        <div className="col-span-2 space-y-5">
          <div>
            <input
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
              placeholder="Post title…"
              className="w-full rounded-xl border border-white/10 bg-transparent px-4 py-3 text-2xl font-bold text-white placeholder-ink-700 outline-none transition focus:border-blueprint-500"
            />
          </div>

          <div>
            <label className={labelCls}>Slug</label>
            <input value={form.slug} onChange={(e) => set("slug", e.target.value)} placeholder="auto-filled" className={inputCls} />
          </div>

          <div>
            <label className={labelCls}>Excerpt *</label>
            <textarea value={form.excerpt} onChange={(e) => set("excerpt", e.target.value)} rows={2} placeholder="Short description shown in post cards" className={inputCls + " resize-none"} />
          </div>

          <div>
            <label className={labelCls}>Body</label>
            <RichTextEditor
              content={form.body}
              onChange={(html) => set("body", html)}
              placeholder="Start writing your post…"
            />
          </div>
        </div>

        {/* Sidebar — 1/3 width */}
        <div className="space-y-5">
          {/* Cover image */}
          <div className="rounded-xl border border-white/5 bg-ink-900 p-4 space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-ink-500">Cover Image</h3>
            {form.coverImage && (
              <img src={form.coverImage} alt="" className="w-full rounded-lg object-cover aspect-video" />
            )}
            <input value={form.coverImage} onChange={(e) => set("coverImage", e.target.value)} placeholder="Paste image URL" className={inputCls} />
          </div>

          {/* Tags */}
          <div className="rounded-xl border border-white/5 bg-ink-900 p-4 space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-ink-500">Tags</h3>
            <input value={form.tags} onChange={(e) => set("tags", e.target.value)} placeholder="ai, planning, tips (comma-separated)" className={inputCls} />
            {form.tags && (
              <div className="flex flex-wrap gap-1.5">
                {form.tags.split(",").filter(Boolean).map((tag) => (
                  <span key={tag.trim()} className="rounded-full bg-white/8 px-2.5 py-0.5 text-xs text-ink-300">
                    {tag.trim()}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* SEO */}
          <div className="rounded-xl border border-white/5 bg-ink-900 p-4 space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-ink-500">SEO</h3>
            <div>
              <label className={labelCls}>SEO Title</label>
              <input value={form.seoTitle} onChange={(e) => set("seoTitle", e.target.value)} placeholder="Defaults to post title" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Meta Description</label>
              <textarea value={form.seoDesc} onChange={(e) => set("seoDesc", e.target.value)} rows={3} placeholder="150–160 chars" className={inputCls + " resize-none"} />
              <p className="mt-1 text-right text-[11px] text-ink-700">{form.seoDesc.length}/160</p>
            </div>
          </div>

          {/* Publish date */}
          <div className="rounded-xl border border-white/5 bg-ink-900 p-4 space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-ink-500">Schedule</h3>
            <div>
              <label className={labelCls}>Publish Date (optional)</label>
              <input type="datetime-local" value={form.publishedAt} onChange={(e) => set("publishedAt", e.target.value)} className={inputCls} />
              <p className="mt-1 text-xs text-ink-600">Leave blank to publish immediately.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
