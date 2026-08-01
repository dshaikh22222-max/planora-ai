"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Crown, ShoppingBag, Shield, Loader2 } from "lucide-react";
import Link from "next/link";
import { formatINR, formatDate } from "@/lib/admin/utils/format";
import { StatusBadge } from "@/components/admin/ui/StatusBadge";

interface PurchaseItem {
  id: string;
  kind: string;
  itemId: string;
  itemName: string;
  amountInPaise: number;
  provider: string;
  providerRef: string;
  status: string;
  createdAt: Date | string;
}

interface SubscriptionItem {
  id: string;
  planName: string;
  status: string;
  provider: string;
  amount: number;
  interval: string;
  currentPeriodEnd: Date | string;
}

interface UserDetail {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  plan: string;
  createdAt: Date | string;
  purchases: PurchaseItem[];
  subscriptions: SubscriptionItem[];
  accounts: { provider: string }[];
}

export default function UserDetailClient({ user }: { user: UserDetail }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [plan, setPlan] = useState(user.plan);

  async function handleUpdatePlan() {
    setError(null);
    startTransition(async () => {
      const res = await fetch(`/api/admin/users/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error?.message ?? "Failed to update user plan");
        return;
      }

      router.refresh();
    });
  }

  const inputCls = "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white placeholder-ink-600 outline-none transition focus:border-blueprint-500";
  const labelCls = "mb-1 block text-xs font-medium text-ink-400";

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/users" className="rounded-lg border border-white/10 bg-white/5 p-2 text-ink-400 transition hover:text-white">
          <ArrowLeft size={16} />
        </Link>
        <div className="flex items-center gap-3 flex-1">
          {user.image ? (
            <img src={user.image} alt="" className="h-10 w-10 rounded-full object-cover" />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blueprint-600/20 text-sm font-bold text-blueprint-300">
              {user.name?.charAt(0)?.toUpperCase() ?? user.email?.charAt(0)?.toUpperCase() ?? "?"}
            </div>
          )}
          <div>
            <h1 className="text-xl font-bold text-white">{user.name ?? "Unnamed User"}</h1>
            <p className="text-xs text-ink-500">{user.email} · Member since {formatDate(user.createdAt)}</p>
          </div>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">
          {error}
        </div>
      )}

      <div className="grid grid-cols-3 gap-6">
        {/* Main purchase history — 2 cols */}
        <div className="col-span-2 space-y-5">
          {/* Purchase History */}
          <div className="rounded-xl border border-white/5 bg-ink-900 p-5 space-y-3">
            <div className="flex items-center gap-2">
              <ShoppingBag size={16} className="text-blueprint-400" />
              <h2 className="text-sm font-semibold text-white">Purchase History ({user.purchases.length})</h2>
            </div>

            {user.purchases.length === 0 ? (
              <p className="text-xs text-ink-600 py-4">No completed purchases.</p>
            ) : (
              <div className="divide-y divide-white/5">
                {user.purchases.map((p) => (
                  <div key={p.id} className="flex items-center justify-between py-3">
                    <div>
                      <p className="font-medium text-sm text-white">{p.itemName}</p>
                      <p className="text-xs text-ink-500">{p.kind} · {formatDate(p.createdAt)}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-mono text-sm text-white">{formatINR(p.amountInPaise)}</p>
                      <StatusBadge status={p.status} size="xs" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Subscriptions */}
          <div className="rounded-xl border border-white/5 bg-ink-900 p-5 space-y-3">
            <div className="flex items-center gap-2">
              <Crown size={16} className="text-amber-400" />
              <h2 className="text-sm font-semibold text-white">Subscriptions ({user.subscriptions.length})</h2>
            </div>

            {user.subscriptions.length === 0 ? (
              <p className="text-xs text-ink-600 py-4">No active or past subscriptions.</p>
            ) : (
              <div className="divide-y divide-white/5">
                {user.subscriptions.map((s) => (
                  <div key={s.id} className="flex items-center justify-between py-3">
                    <div>
                      <p className="font-medium text-sm text-white">{s.planName}</p>
                      <p className="text-xs text-ink-500">{formatINR(s.amount)}/{s.interval} · Ends {formatDate(s.currentPeriodEnd)}</p>
                    </div>
                    <StatusBadge status={s.status} size="xs" />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Plan Control — 1 col */}
        <div className="space-y-5">
          <div className="rounded-xl border border-white/5 bg-ink-900 p-4 space-y-4">
            <div className="flex items-center gap-2">
              <Shield size={16} className="text-emerald-400" />
              <h3 className="text-xs font-semibold uppercase tracking-widest text-ink-500">Plan Tier Override</h3>
            </div>

            <div>
              <label className={labelCls}>Active Plan</label>
              <select value={plan} onChange={(e) => setPlan(e.target.value)} className={inputCls}>
                <option value="Free">Free</option>
                <option value="Pro">Pro</option>
                <option value="Developer">Developer</option>
                <option value="Enterprise">Enterprise</option>
                <option value="Government">Government</option>
              </select>
            </div>

            <button
              onClick={handleUpdatePlan}
              disabled={isPending}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-blueprint-600 py-2.5 text-xs font-semibold text-white transition hover:bg-blueprint-500 disabled:opacity-50"
            >
              {isPending ? <Loader2 size={14} className="animate-spin" /> : null}
              Update Plan Tier
            </button>
          </div>

          {/* Auth Providers */}
          <div className="rounded-xl border border-white/5 bg-ink-900 p-4 space-y-2">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-ink-500">Connected Accounts</h3>
            {user.accounts.length === 0 ? (
              <p className="text-xs text-ink-600">Email magic link only</p>
            ) : (
              <div className="flex flex-wrap gap-1.5">
                {user.accounts.map((acc) => (
                  <span key={acc.provider} className="rounded bg-white/5 px-2 py-1 text-xs text-ink-300 font-mono uppercase">
                    {acc.provider}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
