"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import Link from "next/link";
import { generateSlug } from "@/lib/admin/utils/format";

const TABS = ["General", "Pricing", "Type", "SEO"] as const;
type Tab = (typeof TABS)[number];

export default function NewProductPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [tab, setTab] = useState<Tab>("General");
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: "",
    slug: "",
    shortDesc: "",
    longDesc: "",
    type: "DIGITAL" as "DIGITAL" | "PHYSICAL" | "SUBSCRIPTION" | "SERVICE",
    price: 0,
    comparePrice: "",
    thumbnailUrl: "",
    tags: "",
    seoTitle: "",
    seoDesc: "",
    // Digital-specific
    fileUrl: "",
    fileType: "pdf" as string,
    version: "1.0.0",
    promptText: "",
    // Physical-specific
    sku: "",
    stock: 0,
    weight: "",
    shippingClass: "",
    warehouseNote: "",
  });

  function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => {
      const updated = { ...f, [key]: value };
      if (key === "name" && !f.slug) updated.slug = generateSlug(String(value));
      return updated;
    });
  }

  async function handleSave(status: "DRAFT" | "PUBLISHED" = "DRAFT") {
    setError(null);
    startTransition(async () => {
      const payload = {
        name: form.name,
        slug: form.slug || generateSlug(form.name),
        shortDesc: form.shortDesc,
        longDesc: form.longDesc,
        type: form.type,
        price: Math.round(form.price * 100), // convert to paise
        comparePrice: form.comparePrice ? Math.round(Number(form.comparePrice) * 100) : undefined,
        thumbnailUrl: form.thumbnailUrl || undefined,
        tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
        seoTitle: form.seoTitle || undefined,
        seoDesc: form.seoDesc || undefined,
      };

      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error?.message ?? "Failed to create product");
        return;
      }

      const { id } = await res.json();

      // Update status, digital/physical sub-resources
      await fetch(`/api/admin/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status,
          ...(form.type === "DIGITAL" ? {
            digital: {
              fileUrl: form.fileUrl || undefined,
              fileType: form.fileType,
              version: form.version,
              promptText: form.promptText || undefined,
            },
          } : {}),
          ...(form.type === "PHYSICAL" ? {
            physical: {
              sku: form.sku,
              stock: form.stock,
              weight: form.weight ? Number(form.weight) : undefined,
              shippingClass: form.shippingClass || undefined,
              warehouseNote: form.warehouseNote || undefined,
            },
          } : {}),
        }),
      });

      router.push(`/admin/products/${id}`);
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
          <h1 className="text-xl font-bold text-white">New Product</h1>
          <p className="text-sm text-ink-500">Fill in the details and save as draft or publish</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => handleSave("DRAFT")}
            disabled={isPending || !form.name}
            className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-white/10 disabled:opacity-50"
          >
            {isPending ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
            Save Draft
          </button>
          <button
            onClick={() => handleSave("PUBLISHED")}
            disabled={isPending || !form.name}
            className="flex items-center gap-2 rounded-xl bg-blueprint-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blueprint-900/40 transition hover:bg-blueprint-500 disabled:opacity-50"
          >
            {isPending ? <Loader2 size={14} className="animate-spin" /> : null}
            Publish
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

      {/* Tab content */}
      <div className="rounded-xl border border-white/5 bg-ink-900 p-6 space-y-5">
        {tab === "General" && (
          <>
            <div>
              <label className={labelCls}>Product Name *</label>
              <input value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="e.g. Town Planning AI Premium" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Slug</label>
              <input value={form.slug} onChange={(e) => set("slug", e.target.value)} placeholder="auto-generated" className={inputCls} />
              <p className="mt-1 text-xs text-ink-600">Auto-filled from name. Edit to customize URL.</p>
            </div>
            <div>
              <label className={labelCls}>Short Description *</label>
              <input value={form.shortDesc} onChange={(e) => set("shortDesc", e.target.value)} placeholder="One-line product summary" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Long Description</label>
              <textarea value={form.longDesc} onChange={(e) => set("longDesc", e.target.value)} rows={5} placeholder="Full product description" className={inputCls + " resize-none"} />
            </div>
            <div>
              <label className={labelCls}>Type</label>
              <select value={form.type} onChange={(e) => set("type", e.target.value as typeof form.type)} className={inputCls}>
                <option value="DIGITAL">Digital (APK, PDF, ZIP, Prompt)</option>
                <option value="PHYSICAL">Physical (shipped item)</option>
                <option value="SUBSCRIPTION">Subscription</option>
                <option value="SERVICE">Service</option>
              </select>
            </div>
            <div>
              <label className={labelCls}>Tags (comma-separated)</label>
              <input value={form.tags} onChange={(e) => set("tags", e.target.value)} placeholder="ai, planning, pdf" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Thumbnail URL</label>
              <input value={form.thumbnailUrl} onChange={(e) => set("thumbnailUrl", e.target.value)} placeholder="https://..." className={inputCls} />
            </div>
          </>
        )}

        {tab === "Pricing" && (
          <>
            <div>
              <label className={labelCls}>Price (₹)</label>
              <input type="number" min={0} step={0.01} value={form.price} onChange={(e) => set("price", Number(e.target.value))} placeholder="0 = Free" className={inputCls} />
              <p className="mt-1 text-xs text-ink-600">Enter 0 for free products.</p>
            </div>
            <div>
              <label className={labelCls}>Compare-at Price (₹) — crossed-out &quot;was&quot; price</label>
              <input type="number" min={0} step={0.01} value={form.comparePrice} onChange={(e) => set("comparePrice", e.target.value)} placeholder="Optional" className={inputCls} />
            </div>
          </>
        )}

        {tab === "Type" && form.type === "DIGITAL" && (
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
                <textarea value={form.promptText} onChange={(e) => set("promptText", e.target.value)} rows={8} placeholder="Enter the AI prompt content here..." className={inputCls + " resize-none font-mono text-xs"} />
              </div>
            ) : (
              <div>
                <label className={labelCls}>File URL (Vercel Blob / S3)</label>
                <input value={form.fileUrl} onChange={(e) => set("fileUrl", e.target.value)} placeholder="https://..." className={inputCls} />
                <p className="mt-1 text-xs text-ink-600">Upload via Media Library, then paste URL here.</p>
              </div>
            )}
            <div>
              <label className={labelCls}>Version</label>
              <input value={form.version} onChange={(e) => set("version", e.target.value)} placeholder="1.0.0" className={inputCls} />
            </div>
          </>
        )}

        {tab === "Type" && form.type === "PHYSICAL" && (
          <>
            <div>
              <label className={labelCls}>SKU *</label>
              <input value={form.sku} onChange={(e) => set("sku", e.target.value)} placeholder="e.g. PLN-001" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Stock Quantity</label>
              <input type="number" min={0} value={form.stock} onChange={(e) => set("stock", Number(e.target.value))} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Weight (grams)</label>
              <input type="number" min={0} value={form.weight} onChange={(e) => set("weight", e.target.value)} placeholder="Optional" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Shipping Class</label>
              <input value={form.shippingClass} onChange={(e) => set("shippingClass", e.target.value)} placeholder="standard / express" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Warehouse Note</label>
              <textarea value={form.warehouseNote} onChange={(e) => set("warehouseNote", e.target.value)} rows={3} className={inputCls + " resize-none"} />
            </div>
          </>
        )}

        {tab === "Type" && !["DIGITAL", "PHYSICAL"].includes(form.type) && (
          <p className="text-sm text-ink-500">No additional fields for {form.type} products.</p>
        )}

        {tab === "SEO" && (
          <>
            <div>
              <label className={labelCls}>SEO Title</label>
              <input value={form.seoTitle} onChange={(e) => set("seoTitle", e.target.value)} placeholder="Defaults to product name" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Meta Description</label>
              <textarea value={form.seoDesc} onChange={(e) => set("seoDesc", e.target.value)} rows={3} placeholder="150–160 characters recommended" className={inputCls + " resize-none"} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
