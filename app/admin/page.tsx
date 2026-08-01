import type { Metadata } from "next";
import { cookies } from "next/headers";
import { verifyAdminToken } from "@/lib/admin/auth/token";
import { ADMIN_CONFIG } from "@/lib/admin/config";
import { StatsCard } from "@/components/admin/ui/StatsCard";
import { prisma } from "@/lib/prisma";
import {
  Users, ShoppingCart, DollarSign, TrendingUp,
  Package, FileText, BarChart2, ArrowRight,
} from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = { title: "Dashboard" };

// Fetch live stats from the existing DB models (read-only, safe)
async function getDashboardStats() {
  const [
    totalUsers,
    totalPurchases,
    revenueResult,
    recentPurchases,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.purchase.count({ where: { status: "completed" } }),
    prisma.purchase.aggregate({
      _sum: { amountInPaise: true },
      where: { status: "completed" },
    }),
    prisma.purchase.findMany({
      take: 8,
      orderBy: { createdAt: "desc" },
      where: { status: "completed" },
      include: { user: { select: { name: true, email: true } } },
    }),
  ]);

  const totalRevenueInPaise = revenueResult._sum.amountInPaise ?? 0;
  const totalRevenueINR = totalRevenueInPaise / 100;

  return { totalUsers, totalPurchases, totalRevenueINR, recentPurchases };
}

function formatINR(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

function timeAgo(date: Date): string {
  const diff = Date.now() - date.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default async function AdminDashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_CONFIG.cookieName)?.value ?? "";
  const payload = await verifyAdminToken(token);
  const stats = await getDashboardStats();

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">
            {greeting}, {payload?.name?.split(" ")[0] ?? "Admin"} 👋
          </h1>
          <p className="mt-1 text-sm text-ink-500">
            Here&apos;s what&apos;s happening with Planora AI today.
          </p>
        </div>
        <div className="text-right text-xs text-ink-600">
          <p>
            {new Date().toLocaleDateString("en-IN", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
          <p className="mt-0.5 font-mono">
            {new Date().toLocaleTimeString("en-IN", { timeStyle: "short" })} IST
          </p>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatsCard
          title="Total Users"
          value={stats.totalUsers.toLocaleString("en-IN")}
          subtitle="Registered accounts"
          icon={<Users size={18} />}
          accent="blueprint"
        />
        <StatsCard
          title="Total Revenue"
          value={formatINR(stats.totalRevenueINR)}
          subtitle="All-time completed orders"
          icon={<DollarSign size={18} />}
          accent="emerald"
        />
        <StatsCard
          title="Total Orders"
          value={stats.totalPurchases.toLocaleString("en-IN")}
          subtitle="Completed purchases"
          icon={<ShoppingCart size={18} />}
          accent="amber"
        />
        <StatsCard
          title="Avg. Order Value"
          value={
            stats.totalPurchases > 0
              ? formatINR(stats.totalRevenueINR / stats.totalPurchases)
              : "₹0"
          }
          subtitle="Revenue per order"
          icon={<TrendingUp size={18} />}
          accent="violet"
        />
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Recent Orders — spans 2 cols */}
        <div className="xl:col-span-2">
          <div className="rounded-xl border border-white/5 bg-ink-900">
            <div className="flex items-center justify-between border-b border-white/5 px-5 py-4">
              <div className="flex items-center gap-2">
                <ShoppingCart size={15} className="text-ink-500" />
                <h2 className="text-sm font-semibold text-white">Recent Orders</h2>
              </div>
              <Link
                href="/admin/orders"
                className="flex items-center gap-1 text-xs text-blueprint-400 hover:text-blueprint-300 transition"
              >
                View all <ArrowRight size={12} />
              </Link>
            </div>

            <div className="divide-y divide-white/5">
              {stats.recentPurchases.length === 0 ? (
                <p className="px-5 py-8 text-center text-sm text-ink-600">
                  No orders yet.
                </p>
              ) : (
                stats.recentPurchases.map((purchase) => (
                  <div
                    key={purchase.id}
                    className="flex items-center gap-4 px-5 py-3.5 hover:bg-white/2 transition"
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blueprint-600/20 text-[11px] font-semibold text-blueprint-300">
                      {purchase.user?.name?.charAt(0)?.toUpperCase() ??
                        purchase.user?.email?.charAt(0)?.toUpperCase() ??
                        "?"}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-white">
                        {purchase.itemName}
                      </p>
                      <p className="truncate text-xs text-ink-500">
                        {purchase.user?.name ?? purchase.user?.email ?? "Unknown"}
                        {" · "}
                        <span className="font-mono">{purchase.kind}</span>
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-white">
                        {formatINR(purchase.amountInPaise / 100)}
                      </p>
                      <p className="text-[11px] text-ink-600">
                        {timeAgo(purchase.createdAt)}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="space-y-3">
          <h2 className="px-1 text-xs font-semibold uppercase tracking-widest text-ink-600">
            Quick Actions
          </h2>

          {[
            { label: "Add New Product", href: "/admin/products/new", icon: Package, color: "text-blueprint-400 bg-blueprint-600/15" },
            { label: "Write Blog Post", href: "/admin/blog/new", icon: FileText, color: "text-emerald-400 bg-emerald-600/15" },
            { label: "View Analytics", href: "/admin/analytics", icon: BarChart2, color: "text-violet-400 bg-violet-600/15" },
            { label: "Manage Users", href: "/admin/users", icon: Users, color: "text-amber-400 bg-amber-600/15" },
            { label: "Pending Orders", href: "/admin/orders?status=PENDING", icon: ShoppingCart, color: "text-rose-400 bg-rose-600/15" },
          ].map(({ label, href, icon: Icon, color }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 rounded-xl border border-white/5 bg-ink-900 px-4 py-3.5 transition hover:border-white/10 hover:bg-white/5"
            >
              <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${color}`}>
                <Icon size={16} />
              </div>
              <span className="flex-1 text-sm font-medium text-white">{label}</span>
              <ArrowRight size={14} className="text-ink-700" />
            </Link>
          ))}
        </div>
      </div>

      {/* Phase notice */}
      <div className="rounded-xl border border-blueprint-700/30 bg-blueprint-900/20 px-5 py-4">
        <div className="flex items-start gap-3">
          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blueprint-600/30 text-blueprint-400">
            <BarChart2 size={12} />
          </div>
          <div>
            <p className="text-sm font-medium text-blueprint-200">
              Phase 0 Complete — Foundation Ready
            </p>
            <p className="mt-0.5 text-xs text-blueprint-400/70">
              Authentication, RBAC, middleware, and this shell are live.
              Phase 1 (Products, Blog, Media) is next.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
