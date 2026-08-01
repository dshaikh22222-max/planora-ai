import type { Metadata } from "next";
import Link from "next/link";
import { listOrders, getOrderStats } from "@/lib/admin/repositories/order.repository";
import { StatsCard } from "@/components/admin/ui/StatsCard";
import { StatusBadge } from "@/components/admin/ui/StatusBadge";
import { formatINR, formatDate, timeAgo } from "@/lib/admin/utils/format";
import { ShoppingCart, Clock, Truck, CheckCircle2, RotateCcw, AlertTriangle } from "lucide-react";

export const metadata: Metadata = { title: "Orders" };

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; search?: string; page?: string }>;
}) {
  const sp = await searchParams;
  const page = parseInt(sp.page ?? "1", 10);
  const [{ items, total, totalPages }, stats] = await Promise.all([
    listOrders({
      status: sp.status as never,
      search: sp.search,
      page,
      pageSize: 20,
    }),
    getOrderStats(),
  ]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Order Management</h1>
          <p className="text-sm text-ink-500">Track and fulfill customer orders</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-6">
        <StatsCard title="Total" value={stats.total} icon={<ShoppingCart size={16} />} accent="blueprint" />
        <StatsCard title="Pending" value={stats.pending} icon={<Clock size={16} />} accent="amber" />
        <StatsCard title="Processing" value={stats.processing} icon={<AlertTriangle size={16} />} accent="violet" />
        <StatsCard title="Shipped" value={stats.shipped} icon={<Truck size={16} />} accent="blueprint" />
        <StatsCard title="Fulfilled" value={stats.fulfilled} icon={<CheckCircle2 size={16} />} accent="emerald" />
        <StatsCard title="Refunded" value={stats.refunded} icon={<RotateCcw size={16} />} accent="rose" />
      </div>

      {/* Status Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {["All", "PENDING", "PROCESSING", "SHIPPED", "FULFILLED", "REFUNDED", "CANCELLED"].map((status) => {
          const isAll = status === "All";
          const isActive = isAll ? !sp.status : sp.status === status;
          const href = isAll ? "/admin/orders" : `/admin/orders?status=${status}`;
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
              {status === "All" ? "All Orders" : status.charAt(0) + status.slice(1).toLowerCase()}
            </Link>
          );
        })}
      </div>

      {/* Orders Table */}
      <div className="overflow-hidden rounded-xl border border-white/5 bg-ink-900">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/5">
              {["Order #", "Status", "Amount", "Carrier / Tracking", "Created", "Actions"].map((h) => (
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
                  No orders found.
                </td>
              </tr>
            ) : (
              items.map((order) => (
                <tr key={order.id} className="transition hover:bg-white/[0.02]">
                  <td className="px-4 py-3 font-mono font-medium text-white">
                    {order.orderNumber}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={order.status} size="xs" />
                  </td>
                  <td className="px-4 py-3 font-mono text-ink-200">
                    {formatINR(order.totalAmount)}
                  </td>
                  <td className="px-4 py-3 text-xs text-ink-400">
                    {order.carrier ? (
                      <div className="font-mono">
                        <span className="text-white font-semibold">{order.carrier}:</span>{" "}
                        {order.trackingNumber}
                      </div>
                    ) : (
                      <span className="text-ink-700">No shipment details</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-ink-500 text-xs">
                    {timeAgo(order.createdAt)}
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-ink-300 transition hover:border-white/20 hover:text-white"
                    >
                      Manage
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <Link
              key={p}
              href={`/admin/orders?page=${p}${sp.status ? `&status=${sp.status}` : ""}`}
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
