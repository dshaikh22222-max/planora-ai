"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Globe, Plus, Trash2, Save, Loader2, CheckCircle2 } from "lucide-react";
import { StatsCard } from "@/components/admin/ui/StatsCard";

interface SeoItem {
  id: string;
  path: string;
  title: string;
  description: string;
  keywords: string[];
  ogImage: string | null;
  canonical: string | null;
  noIndex: boolean;
}

interface SeoClientProps {
  initialItems: SeoItem[];
  stats: {
    totalIndexablePages: number;
    publishedProducts: number;
    publishedBlogPosts: number;
    customSeoOverrides: number;
  };
}

export default function SeoClient({ initialItems, stats }: SeoClientProps) {
  const router = useRouter();
  const [items, setItems] = useState<SeoItem[]>(initialItems);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  // Form state for creating/editing an override
  const [form, setForm] = useState({
    path: "/",
    title: "",
    description: "",
    keywords: "",
    ogImage: "",
    canonical: "",
    noIndex: false,
  });

  async function handleSave() {
    if (!form.path || !form.title || !form.description) {
      setError("Path, Title, and Meta Description are required");
      return;
    }
    setError(null);

    startTransition(async () => {
      const payload = {
        path: form.path,
        title: form.title,
        description: form.description,
        keywords: form.keywords.split(",").map((k) => k.trim()).filter(Boolean),
        ogImage: form.ogImage || undefined,
        canonical: form.canonical || undefined,
        noIndex: form.noIndex,
      };

      const res = await fetch("/api/admin/seo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error?.message ?? "Save failed");
        return;
      }

      router.refresh();
    });
  }

  async function handleDelete(path: string) {
    if (!confirm(`Delete SEO override for ${path}?`)) return;
    startTransition(async () => {
      await fetch(`/api/admin/seo?path=${encodeURIComponent(path)}`, { method: "DELETE" });
      router.refresh();
    });
  }

  const inputCls = "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-ink-600 outline-none transition focus:border-blueprint-500";
  const labelCls = "mb-1.5 block text-xs font-medium text-ink-400";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">SEO & Meta Management</h1>
          <p className="text-sm text-ink-500">Configure route-level title tags, meta descriptions, and indexing</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <StatsCard title="Total Indexable Pages" value={stats.totalIndexablePages} icon={<Globe size={16} />} accent="blueprint" />
        <StatsCard title="Published Products" value={stats.publishedProducts} icon={<CheckCircle2 size={16} />} accent="emerald" />
        <StatsCard title="Published Blog Posts" value={stats.publishedBlogPosts} icon={<Globe size={16} />} accent="violet" />
        <StatsCard title="Custom Route Overrides" value={stats.customSeoOverrides} icon={<Plus size={16} />} accent="amber" />
      </div>

      {error && (
        <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">
          {error}
        </div>
      )}

      {/* Add / Edit Form */}
      <div className="rounded-xl border border-white/5 bg-ink-900 p-6 space-y-4">
        <h2 className="text-base font-semibold text-white">Add / Edit Route Meta Tags</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Route Path (e.g. &quot;/&quot;, &quot;/pricing&quot;) *</label>
            <input value={form.path} onChange={(e) => setForm((f) => ({ ...f, path: e.target.value }))} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>SEO Title Tag *</label>
            <input value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} placeholder="Page Title — Planora AI" className={inputCls} />
          </div>
        </div>

        <div>
          <label className={labelCls}>Meta Description (150–160 chars) *</label>
          <textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} rows={2} placeholder="Concise page summary for search engine snippet..." className={inputCls + " resize-none"} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Keywords (comma-separated)</label>
            <input value={form.keywords} onChange={(e) => setForm((f) => ({ ...f, keywords: e.target.value }))} placeholder="ai, town planning, urban design" className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>OpenGraph Image URL</label>
            <input value={form.ogImage} onChange={(e) => setForm((f) => ({ ...f, ogImage: e.target.value }))} placeholder="https://..." className={inputCls} />
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <label className="flex items-center gap-2 text-xs text-ink-300">
            <input type="checkbox" checked={form.noIndex} onChange={(e) => setForm((f) => ({ ...f, noIndex: e.target.checked }))} className="h-4 w-4 rounded accent-rose-500" />
            Set <code className="font-mono text-rose-400">noindex</code> header (hide from Google search)
          </label>

          <button
            onClick={handleSave}
            disabled={isPending}
            className="flex items-center gap-2 rounded-xl bg-blueprint-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blueprint-500 disabled:opacity-50"
          >
            {isPending ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
            Save SEO Rule
          </button>
        </div>
      </div>

      {/* Overrides Table */}
      <div className="overflow-hidden rounded-xl border border-white/5 bg-ink-900">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/5">
              {["Path", "Title", "Meta Description", "noindex", "Actions"].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-widest text-ink-500">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {initialItems.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-12 text-center text-sm text-ink-600">
                  No custom route SEO rules added yet.
                </td>
              </tr>
            ) : (
              initialItems.map((item) => (
                <tr key={item.path} className="transition hover:bg-white/[0.02]">
                  <td className="px-4 py-3 font-mono font-medium text-blueprint-400">
                    {item.path}
                  </td>
                  <td className="px-4 py-3 font-medium text-white max-w-xs truncate">
                    {item.title}
                  </td>
                  <td className="px-4 py-3 text-xs text-ink-400 max-w-md truncate">
                    {item.description}
                  </td>
                  <td className="px-4 py-3">
                    {item.noIndex ? (
                      <span className="rounded bg-rose-500/20 px-2 py-0.5 text-[10px] font-mono font-semibold text-rose-400">noindex</span>
                    ) : (
                      <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-[10px] font-mono font-semibold text-emerald-400">indexed</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleDelete(item.path)}
                      className="rounded p-1.5 text-ink-600 hover:text-rose-400 transition"
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
