import type { Metadata } from "next";
import Link from "next/link";
import { listEndUsers, getUserStats } from "@/lib/admin/repositories/user-mgmt.repository";
import { StatsCard } from "@/components/admin/ui/StatsCard";
import { formatDate } from "@/lib/admin/utils/format";
import { Users, Crown, ShieldCheck, Zap } from "lucide-react";

export const metadata: Metadata = { title: "End Users" };

export default async function UsersPage({
  searchParams,
}: {
  searchParams: Promise<{ plan?: string; search?: string; page?: string }>;
}) {
  const sp = await searchParams;
  const page = parseInt(sp.page ?? "1", 10);

  const [{ items, total, totalPages }, stats] = await Promise.all([
    listEndUsers({
      plan: sp.plan,
      search: sp.search,
      page,
      pageSize: 20,
    }),
    getUserStats(),
  ]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">End User Management</h1>
          <p className="text-sm text-ink-500">Manage registered user accounts and plan tiers</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <StatsCard title="Total Users" value={stats.total.toLocaleString("en-IN")} icon={<Users size={16} />} accent="blueprint" />
        <StatsCard title="Pro Plan" value={stats.pro.toLocaleString("en-IN")} icon={<Crown size={16} />} accent="emerald" />
        <StatsCard title="Free Plan" value={stats.free.toLocaleString("en-IN")} icon={<Zap size={16} />} accent="amber" />
        <StatsCard title="Enterprise" value={stats.enterprise.toLocaleString("en-IN")} icon={<ShieldCheck size={16} />} accent="violet" />
      </div>

      {/* Plan Filters */}
      <div className="flex flex-wrap gap-2">
        {["All", "Free", "Pro", "Developer", "Enterprise", "Government"].map((plan) => {
          const isAll = plan === "All";
          const isActive = isAll ? !sp.plan : sp.plan === plan;
          const href = isAll ? "/admin/users" : `/admin/users?plan=${plan}`;
          return (
            <Link
              key={plan}
              href={href}
              className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition ${
                isActive
                  ? "border-blueprint-500 bg-blueprint-600/20 text-blueprint-300"
                  : "border-white/10 bg-white/5 text-ink-400 hover:border-white/20 hover:text-white"
              }`}
            >
              {plan === "All" ? "All Users" : plan}
            </Link>
          );
        })}
      </div>

      {/* Users Table */}
      <div className="overflow-hidden rounded-xl border border-white/5 bg-ink-900">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/5">
              {["User", "Plan Tier", "Purchases", "Joined Date", "Actions"].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-widest text-ink-500">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {items.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-16 text-center text-sm text-ink-600">
                  No users found.
                </td>
              </tr>
            ) : (
              items.map((user) => (
                <tr key={user.id} className="transition hover:bg-white/[0.02]">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {user.image ? (
                        <img src={user.image} alt="" className="h-8 w-8 rounded-full object-cover" />
                      ) : (
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blueprint-600/20 text-xs font-semibold text-blueprint-300">
                          {user.name?.charAt(0)?.toUpperCase() ?? user.email?.charAt(0)?.toUpperCase() ?? "?"}
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-white">{user.name ?? "Unnamed User"}</p>
                        <p className="text-xs text-ink-500">{user.email ?? "No email"}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex rounded-full border border-blueprint-500/30 bg-blueprint-600/15 px-2.5 py-0.5 text-xs font-mono font-medium text-blueprint-300">
                      {user.plan}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-mono text-ink-300">
                    {user._count.purchases} orders
                  </td>
                  <td className="px-4 py-3 text-ink-500 text-xs">
                    {formatDate(user.createdAt)}
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/users/${user.id}`}
                      className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-ink-300 transition hover:border-white/20 hover:text-white"
                    >
                      View Details
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
              href={`/admin/users?page=${p}${sp.plan ? `&plan=${sp.plan}` : ""}`}
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
