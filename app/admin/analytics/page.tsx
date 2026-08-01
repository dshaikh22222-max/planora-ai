import type { Metadata } from "next";
import { getAnalyticsData } from "@/lib/admin/repositories/analytics.repository";
import { StatsCard } from "@/components/admin/ui/StatsCard";
import { formatINR, formatDate } from "@/lib/admin/utils/format";
import { BarChart3, TrendingUp, Users, DollarSign, ShoppingCart, PieChart } from "lucide-react";

export const metadata: Metadata = { title: "Analytics" };

export default async function AnalyticsPage() {
  const data = await getAnalyticsData();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Analytics & Performance</h1>
          <p className="text-sm text-ink-500">Revenue, order distribution, and user acquisition insights</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <StatsCard
          title="Total Revenue"
          value={formatINR(data.overview.totalRevenueInPaise)}
          subtitle="All-time gross volume"
          icon={<DollarSign size={16} />}
          accent="emerald"
        />
        <StatsCard
          title="30-Day Revenue"
          value={formatINR(data.overview.monthlyRevenueInPaise)}
          subtitle="Last 30 days"
          icon={<TrendingUp size={16} />}
          accent="blueprint"
        />
        <StatsCard
          title="Total Orders"
          value={data.overview.totalOrders.toLocaleString("en-IN")}
          subtitle="Completed purchases"
          icon={<ShoppingCart size={16} />}
          accent="violet"
        />
        <StatsCard
          title="Avg Order Value"
          value={formatINR(data.overview.avgOrderValueInPaise)}
          subtitle="Revenue per completed order"
          icon={<BarChart3 size={16} />}
          accent="amber"
        />
      </div>

      {/* Analytics Breakdown Grid */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {/* Revenue by Product Category */}
        <div className="rounded-xl border border-white/5 bg-ink-900 p-5 space-y-4">
          <div className="flex items-center gap-2">
            <PieChart size={16} className="text-blueprint-400" />
            <h2 className="text-sm font-semibold text-white">Revenue by Category</h2>
          </div>

          {data.revenueByKind.length === 0 ? (
            <p className="text-xs text-ink-600 py-6 text-center">No completed sales yet.</p>
          ) : (
            <div className="space-y-3">
              {data.revenueByKind.map((item) => {
                const percentage =
                  data.overview.totalRevenueInPaise > 0
                    ? Math.round((item.totalAmountInPaise / data.overview.totalRevenueInPaise) * 100)
                    : 0;
                return (
                  <div key={item.kind} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="font-medium text-white capitalize">{item.kind}</span>
                      <span className="font-mono text-ink-300">
                        {formatINR(item.totalAmountInPaise)} ({percentage}%)
                      </span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-white/5">
                      <div
                        className="h-full bg-gradient-to-r from-blueprint-500 to-blueprint-400 rounded-full"
                        style={{ width: `${Math.max(percentage, 4)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* User Plan Distribution */}
        <div className="rounded-xl border border-white/5 bg-ink-900 p-5 space-y-4">
          <div className="flex items-center gap-2">
            <Users size={16} className="text-emerald-400" />
            <h2 className="text-sm font-semibold text-white">User Plan Distribution</h2>
          </div>

          <div className="space-y-3">
            {data.userPlans.map((planItem) => {
              const pct =
                data.overview.totalUsers > 0
                  ? Math.round((planItem.count / data.overview.totalUsers) * 100)
                  : 0;
              return (
                <div key={planItem.plan} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-medium text-white">{planItem.plan} Plan</span>
                    <span className="font-mono text-ink-300">
                      {planItem.count.toLocaleString("en-IN")} users ({pct}%)
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-white/5">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full"
                      style={{ width: `${Math.max(pct, 4)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent Purchases Activity */}
      <div className="rounded-xl border border-white/5 bg-ink-900 p-5 space-y-4">
        <h2 className="text-sm font-semibold text-white">Recent Sales Log</h2>
        <div className="divide-y divide-white/5 text-sm">
          {data.recentPurchases.map((p) => (
            <div key={p.id} className="flex items-center justify-between py-3">
              <div>
                <p className="font-medium text-white">{p.itemName}</p>
                <p className="text-xs text-ink-500">{p.kind} · {formatDate(p.createdAt)}</p>
              </div>
              <p className="font-mono font-semibold text-emerald-400">
                +{formatINR(p.amountInPaise)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
