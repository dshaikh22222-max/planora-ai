import type { Metadata } from "next";
import Link from "next/link";
import { listProducts, getProductStats } from "@/lib/admin/repositories/product.repository";
import { StatsCard } from "@/components/admin/ui/StatsCard";
import { StatusBadge } from "@/components/admin/ui/StatusBadge";
import { formatINR, formatDate } from "@/lib/admin/utils/format";
import { Package, Plus, Download, Truck, TrendingUp } from "lucide-react";

export const metadata: Metadata = { title: "Products" };

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; type?: string; page?: string }>;
}) {
  const sp = await searchParams;
  const page = parseInt(sp.page ?? "1", 10);
  const [{ items, total, totalPages }, stats] = await Promise.all([
    listProducts({
      status: sp.status as never,
      type: sp.type as never,
      page,
      pageSize: 20,
    }),
    getProductStats(),
  ]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Products</h1>
          <p className="text-sm text-ink-500">Manage digital and physical products</p>
        </div>
        <Link
          href="/admin/products/new"
          className="flex items-center gap-2 rounded-xl bg-blueprint-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blueprint-900/40 transition hover:bg-blueprint-500"
        >
          <Plus size={15} />
          Add Product
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-5">
        <StatsCard title="Total" value={stats.total} icon={<Package size={16} />} accent="blueprint" />
        <StatsCard title="Published" value={stats.published} icon={<TrendingUp size={16} />} accent="emerald" />
        <StatsCard title="Drafts" value={stats.draft} icon={<Package size={16} />} accent="amber" />
        <StatsCard title="Digital" value={stats.digital} icon={<Download size={16} />} accent="violet" />
        <StatsCard title="Physical" value={stats.physical} icon={<Truck size={16} />} accent="rose" />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {[
          { label: "All", status: undefined, type: undefined },
          { label: "Published", status: "PUBLISHED" },
          { label: "Drafts", status: "DRAFT" },
          { label: "Digital", type: "DIGITAL" },
          { label: "Physical", type: "PHYSICAL" },
        ].map((f) => {
          const isActive =
            (sp.status ?? null) === (f.status ?? null) &&
            (sp.type ?? null) === (f.type ?? null);
          const params = new URLSearchParams();
          if (f.status) params.set("status", f.status);
          if (f.type) params.set("type", f.type);
          return (
            <Link
              key={f.label}
              href={`/admin/products?${params}`}
              className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition ${
                isActive
                  ? "border-blueprint-500 bg-blueprint-600/20 text-blueprint-300"
                  : "border-white/10 bg-white/5 text-ink-400 hover:border-white/20 hover:text-white"
              }`}
            >
              {f.label}
            </Link>
          );
        })}
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-white/5 bg-ink-900">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/5">
              {["Name", "Type", "Status", "Price", "Created", "Actions"].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-widest text-ink-500">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {items.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-16 text-center text-sm text-ink-600">
                  No products yet.{" "}
                  <Link href="/admin/products/new" className="text-blueprint-400 hover:underline">
                    Create the first one
                  </Link>
                </td>
              </tr>
            ) : (
              items.map((product) => (
                <tr key={product.id} className="transition hover:bg-white/[0.02]">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {product.thumbnailUrl ? (
                        <img
                          src={product.thumbnailUrl}
                          alt=""
                          className="h-8 w-8 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5">
                          <Package size={14} className="text-ink-600" />
                        </div>
                      )}
                      <div>
                        <Link
                          href={`/admin/products/${product.id}`}
                          className="font-medium text-white hover:text-blueprint-300 transition"
                        >
                          {product.name}
                        </Link>
                        <p className="font-mono text-[11px] text-ink-600">{product.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={product.type} showDot={false} size="xs" />
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={product.status} size="xs" />
                  </td>
                  <td className="px-4 py-3 font-mono text-ink-200">
                    {product.price === 0 ? "Free" : formatINR(product.price)}
                  </td>
                  <td className="px-4 py-3 text-ink-500">
                    {formatDate(product.createdAt)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/admin/products/${product.id}`}
                        className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-ink-300 transition hover:border-white/20 hover:text-white"
                      >
                        Edit
                      </Link>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <Link
              key={p}
              href={`/admin/products?page=${p}${sp.status ? `&status=${sp.status}` : ""}${sp.type ? `&type=${sp.type}` : ""}`}
              className={`h-8 w-8 rounded-lg text-xs font-medium transition flex items-center justify-center ${
                p === page
                  ? "bg-blueprint-600 text-white"
                  : "border border-white/10 text-ink-400 hover:border-white/20 hover:text-white"
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
