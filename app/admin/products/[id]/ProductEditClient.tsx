"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Loader2, Trash2 } from "lucide-react";
import Link from "next/link";
import { generateSlug, formatINR } from "@/lib/admin/utils/format";
import { StatusBadge } from "@/components/admin/ui/StatusBadge";
import type { ProductDetail } from "@/lib/admin/repositories/product.repository";

const TABS = ["General", "Pricing", "Type Details", "SEO"] as const;
type Tab = (typeof TABS)[number];

export default function ProductEditClient({ product }: { product: ProductDetail }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isDeleting, setIsDeleting] = useTransition();
  const [tab, setTab] = useState<Tab>("General");
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: product.name,
    slug: product.slug,
    shortDesc: product.shortDesc,
    longDesc: product.longDesc,
    status: product.status as "DRAFT" | "PUBLISHED" | "ARCHIVED" | "OUT_OF_STOCK",
    type: product.type as "DIGITAL" | "PHYSICAL" | "SUBSCRIPTION" | "SERVICE",
    price: product.price / 100,
    comparePrice: product.comparePrice ? String(product.comparePrice / 100) : "",
    thumbnailUrl: product.thumbnailUrl ?? "",
    tags: product.tags.join(", "),
    seoTitle: product.seoTitle ?? "",
    seoDesc: product.seoDesc ?? "",
    // Digital
    fileUrl: product.digitalAsset?.fileUrl ?? "",
    fileType: product.digitalAsset?.fileType ?? "pdf",
    version: product.digitalAsset?.version ?? "1.0.0",
    promptText: product.digitalAsset?.promptText ?? "",
    // Physical
    sku: product.physicalDetails?.sku ?? "",
    stock: product.physicalDetails?.stock ?? 0,
    weight: product.physicalDetails?.weight ? String(product.physicalDetails.weight) : "",
    shippingClass: product.physicalDetails?.shippingClass ?? "",
    warehouseNote: product.physicalDetails?.warehouseNote ?? "",
  });

  function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    setSaved(false);
  }

  async function handleSave(statusOverride?: typeof form.status) {
    setError(null);
    startTransition(async () => {
      const activeStatus = statusOverride ?? form.status;

      const payload = {
        name: form.name,
        slug: form.slug || generateSlug(form.name),
        shortDesc: form.shortDesc,
        longDesc: form.longDesc,
        status: activeStatus,
        price: Math.round(form.price * 100),
        comparePrice: form.comparePrice ? Math.round(Number(form.comparePrice) * 100) : null,
        thumbnailUrl: form.thumbnailUrl || null,
        tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
        seoTitle: form.seoTitle || null,
        seoDesc: form.seoDesc || null,
        digital: form.type === "DIGITAL" ? {
          fileUrl: form.fileUrl || undefined,
          fileType: form.fileType,
          version: form.version,
          promptText: form.promptText || undefined,
        } : undefined,
        physical: form.type === "PHYSICAL" ? {
          sku: form.sku,
          stock: form.stock,
          weight: form.weight ? Number(form.weight) : undefined,
          shippingClass: form.shippingClass || undefined,
          warehouseNote: form.warehouseNote || undefined,
        } : undefined,
      };

      const res = await fetch(`/api/admin/products/${product.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error?.message ?? "Failed to save product");
        return;
      }

      if (statusOverride) setForm((f) => ({ ...f, status: statusOverride }));
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
      router.refresh();
    });
  }

  async function handleDelete() {
    if (!confirm("Are you sure you want to delete this product?")) return;
    setIsDeleting(async () => {
      await fetch(`/api/admin/products/${product.id}`, { method: "DELETE" });
      router.push("/admin/products");
    });
  }

  const inputCls = "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-ink-600 outline-none transition focus:border-blueprint-500 focus:ring-1 focus:ring-blueprint-500/20";
  const labelCls = "mb-1.5 block text-xs font-medium text-ink-400";

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/products" className="rounded-lg border border-white/10 bg-white/5 p-2 text-ink-400 transition hover:text-white">
          <ArrowLeft size={16} />
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white truncate">{product.name}</h1>
            <StatusBadge status={form.status} size="xs" />
            <StatusBadge status={form.type} showDot={false} size="xs" />
          </div>
          <p className="text-sm text-ink-500 font-mono">
            {product.slug} · {formatINR(form.price * 100)}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {saved && <span className="text-xs text-emerald-400">Saved ✓</span>}
          <button onClick={() => handleSave()} disabled={isPending}
            className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-white/10 disabled:opacity-50">
            {isPending ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
            Save
          </button>
          {form.status !== "PUBLISHED" && (
            <button onClick={() => handleSave("PUBLISHED")} disabled={isPending}
              className="flex items-center gap-2 rounded-xl bg-blueprint-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blueprint-900/40 transition hover:bg-blueprint-500 disabled:opacity-50">
              Publish
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

      {/* Tabs */}
      <div className="flex gap-1 rounded-xl border border-white/5 bg-ink-900 p-1.5">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium transition ${
              tab === t ? "bg-white/10 text-white" : "text-ink-500 hover:text-white"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="rounded-xl border border-white/5 bg-ink-900 p-6 space-y-5">
        {tab === "General" && (
          <>
            <div>
              <label className={labelCls}>Product Name *</label>
              <input value={form.name} onChange={(e) => set("name", e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Status</label>
              <select value={form.status} onChange={(e) => set("status", e.target.value as typeof form.status)} className={inputCls}>
                <option value="DRAFT">Draft</option>
                <option value="PUBLISHED">Published</option>
                <option value="OUT_OF_STOCK">Out of Stock</option>
                <option value="ARCHIVED">Archived</option>
              </select>
            </div>
            <div>
              <label className={labelCls}>Slug</label>
              <input value={form.slug} onChange={(e) => set("slug", e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Short Description *</label>
              <input value={form.shortDesc} onChange={(e) => set("shortDesc", e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Long Description</label>
              <textarea value={form.longDesc} onChange={(e) => set("longDesc", e.target.value)} rows={5} className={inputCls + " resize-none"} />
            </div>
            <div>
              <label className={labelCls}>Tags (comma-separated)</label>
              <input value={form.tags} onChange={(e) => set("tags", e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Thumbnail URL</label>
              <input value={form.thumbnailUrl} onChange={(e) => set("thumbnailUrl", e.target.value)} className={inputCls} />
            </div>
          </>
        )}

        {tab === "Pricing" && (
          <>
            <div>
              <label className={labelCls}>Price (₹)</label>
              <input type="number" min={0} step={0.01} value={form.price} onChange={(e) => set("price", Number(e.target.value))} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Compare-at Price (₹)</label>
              <input type="number" min={0} step={0.01} value={form.comparePrice} onChange={(e) => set("comparePrice", e.target.value)} className={inputCls} />
            </div>
          </>
        )}

        {tab === "Type Details" && form.type === "DIGITAL" && (
          <>
            <div>
              <label className={labelCls}>File Type</label>
              <select value={form.fileType} onChange={(e) => set("fileType", e.target.value)} className={inputCls}>
                <option value="pdf">PDF</option>
                <option value="apk">APK</option>
                <option value="zip">ZIP</option>
                <option value="prompt">AI Prompt (text)</option>
              </select>
            </div>
            {form.fileType === "prompt" ? (
              <div>
                <label className={labelCls}>Prompt Text</label>
                <textarea value={form.promptText} onChange={(e) => set("promptText", e.target.value)} rows={8} className={inputCls + " resize-none font-mono text-xs"} />
              </div>
            ) : (
              <div>
                <label className={labelCls}>File URL</label>
                <input value={form.fileUrl} onChange={(e) => set("fileUrl", e.target.value)} className={inputCls} />
              </div>
            )}
            <div>
              <label className={labelCls}>Version</label>
              <input value={form.version} onChange={(e) => set("version", e.target.value)} className={inputCls} />
            </div>
          </>
        )}

        {tab === "Type Details" && form.type === "PHYSICAL" && (
          <>
            <div>
              <label className={labelCls}>SKU</label>
              <input value={form.sku} onChange={(e) => set("sku", e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Stock Quantity</label>
              <input type="number" min={0} value={form.stock} onChange={(e) => set("stock", Number(e.target.value))} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Weight (grams)</label>
              <input type="number" min={0} value={form.weight} onChange={(e) => set("weight", e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Shipping Class</label>
              <input value={form.shippingClass} onChange={(e) => set("shippingClass", e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Warehouse Note</label>
              <textarea value={form.warehouseNote} onChange={(e) => set("warehouseNote", e.target.value)} rows={3} className={inputCls + " resize-none"} />
            </div>
          </>
        )}

        {tab === "Type Details" && !["DIGITAL", "PHYSICAL"].includes(form.type) && (
          <p className="text-sm text-ink-500">No additional configuration needed for {form.type}.</p>
        )}

        {tab === "SEO" && (
          <>
            <div>
              <label className={labelCls}>SEO Title</label>
              <input value={form.seoTitle} onChange={(e) => set("seoTitle", e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Meta Description</label>
              <textarea value={form.seoDesc} onChange={(e) => set("seoDesc", e.target.value)} rows={3} className={inputCls + " resize-none"} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
