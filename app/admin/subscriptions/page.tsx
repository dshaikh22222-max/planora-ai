import type { Metadata } from "next";
import Link from "next/link";
import { listSubscriptions, getSubscriptionStats } from "@/lib/admin/repositories/subscription.repository";
import { StatsCard } from "@/components/admin/ui/StatsCard";
import { StatusBadge } from "@/components/admin/ui/StatusBadge";
import { formatINR, formatDate } from "@/lib/admin/utils/format";
import { RefreshCw, CheckCircle, Clock, AlertTriangle, XCircle, DollarSign } from "lucide-react";

export const metadata: Metadata = { title: "Subscriptions" };

export default async function SubscriptionsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; provider?: string; search?: string; page?: string }>;
}) {
  const sp = await searchParams;
  const page = parseInt(sp.page ?? "1", 10);
  const [{ items, total, totalPages }, stats] = await Promise.all([
    listSubscriptions({
      status: sp.status as never,
      provider: sp.provider,
      search: sp.search,
      page,
      pageSize: 20,
    }),
    getSubscriptionStats(),
  ]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Subscription Management</h1>
          <p className="text-sm text-ink-500">Track recurring revenue and active subscriber plans</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-5">
        <StatsCard title="Monthly Recurring (MRR)" value={formatINR(stats.mrrInPaise)} icon={<DollarSign size={16} />} accent="emerald" />
        <StatsCard title="Active Subs" value={stats.active} icon={<CheckCircle size={16} />} accent="blueprint" />
        <StatsCard title="Trialing" value={stats.trialing} icon={<Clock size={16} />} accent="violet" />
        <StatsCard title="Past Due" value={stats.pastDue} icon={<AlertTriangle size={16} />} accent="amber" />
        <StatsCard title="Cancelled" value={stats.cancelled} icon={<XCircle size={16} />} accent="rose" />
      </div>

      {/* Status Filters */}
      <div className="flex flex-wrap gap-2">
        {["All", "ACTIVE", "TRIALING", "PAST_DUE", "CANCELLED", "EXPIRED"].map((status) => {
          const isAll = status === "All";
          const isActive = isAll ? !sp.status : sp.status === status;
          const href = isAll ? "/admin/subscriptions" : `/admin/subscriptions?status=${status}`;
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
              {status === "All" ? "All Subscriptions" : status.charAt(0) + status.slice(1).toLowerCase()}
            </Link>
          );
        })}
      </div>

      {/* Subscriptions Table */}
      <div className="overflow-hidden rounded-xl border border-white/5 bg-ink-900">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/5">
              {["Plan", "Status", "Provider", "Amount / Cycle", "Period End", "Actions"].map((h) => (
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
                  No subscriptions found.
                </td>
              </tr>
            ) : (
              items.map((sub) => (
                <tr key={sub.id} className="transition hover:bg-white/[0.02]">
                  <td className="px-4 py-3">
                    <p className="font-semibold text-white">{sub.planName}</p>
                    <p className="font-mono text-[11px] text-ink-600">{sub.providerSubId}</p>
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={sub.status} size="xs" />
                  </td>
                  <td className="px-4 py-3 font-mono text-xs uppercase text-ink-400">
                    {sub.provider}
                  </td>
                  <td className="px-4 py-3 font-mono text-ink-200">
                    {formatINR(sub.amount)} / {sub.interval}
                  </td>
                  <td className="px-4 py-3 text-ink-500 text-xs">
                    {formatDate(sub.currentPeriodEnd)}
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/subscriptions/${sub.id}`}
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
              href={`/admin/subscriptions?page=${p}${sp.status ? `&status=${sp.status}` : ""}`}
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
