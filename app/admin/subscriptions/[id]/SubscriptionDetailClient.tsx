"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, RefreshCw, XCircle, CheckCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import { formatINR, formatDate } from "@/lib/admin/utils/format";
import { StatusBadge } from "@/components/admin/ui/StatusBadge";

interface SubscriptionDetail {
  id: string;
  userId: string;
  planId: string;
  planName: string;
  status: string;
  provider: string;
  providerSubId: string;
  amount: number;
  interval: string;
  currentPeriodStart: Date | string;
  currentPeriodEnd: Date | string;
  cancelAtPeriodEnd: boolean;
  canceledAt: Date | string | null;
  createdAt: Date | string;
}

export default function SubscriptionDetailClient({ sub }: { sub: SubscriptionDetail }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [status, setStatus] = useState(sub.status);
  const [cancelAtPeriodEnd, setCancelAtPeriodEnd] = useState(sub.cancelAtPeriodEnd);
  const [cancelGateway, setCancelGateway] = useState(true);

  async function handleSaveStatus() {
    setError(null);
    startTransition(async () => {
      const res = await fetch(`/api/admin/subscriptions/${sub.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status,
          cancelAtPeriodEnd,
          cancelProviderSub: cancelGateway && status === "CANCELLED",
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error?.message ?? "Update failed");
        return;
      }

      router.refresh();
    });
  }

  const inputCls = "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-ink-600 outline-none transition focus:border-blueprint-500";
  const labelCls = "mb-1.5 block text-xs font-medium text-ink-400";

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/subscriptions" className="rounded-lg border border-white/10 bg-white/5 p-2 text-ink-400 transition hover:text-white">
          <ArrowLeft size={16} />
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white">{sub.planName}</h1>
            <StatusBadge status={status} size="xs" />
          </div>
          <p className="text-sm text-ink-500 font-mono">
            {sub.providerSubId} · {formatINR(sub.amount)}/{sub.interval}
          </p>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">
          {error}
        </div>
      )}

      <div className="rounded-xl border border-white/5 bg-ink-900 p-6 space-y-5">
        <h2 className="text-base font-semibold text-white">Subscription Management</h2>

        <div>
          <label className={labelCls}>Status</label>
          <select value={status} onChange={(e) => setStatus(e.target.value)} className={inputCls}>
            <option value="ACTIVE">Active</option>
            <option value="TRIALING">Trialing</option>
            <option value="PAST_DUE">Past Due</option>
            <option value="PAUSED">Paused</option>
            <option value="CANCELLED">Cancelled</option>
            <option value="EXPIRED">Expired</option>
          </select>
        </div>

        <label className="flex items-center gap-2 text-xs text-ink-300">
          <input
            type="checkbox"
            checked={cancelAtPeriodEnd}
            onChange={(e) => setCancelAtPeriodEnd(e.target.checked)}
            className="h-4 w-4 rounded accent-blueprint-500"
          />
          Cancel at current period end ({formatDate(sub.currentPeriodEnd)})
        </label>

        {status === "CANCELLED" && (
          <label className="flex items-center gap-2 text-xs text-rose-300">
            <input
              type="checkbox"
              checked={cancelGateway}
              onChange={(e) => setCancelGateway(e.target.checked)}
              className="h-4 w-4 rounded accent-rose-500"
            />
            Execute cancellation directly on Razorpay / Stripe gateway
          </label>
        )}

        <button
          onClick={handleSaveStatus}
          disabled={isPending}
          className="flex items-center gap-2 rounded-xl bg-blueprint-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blueprint-500 disabled:opacity-50"
        >
          {isPending ? <Loader2 size={14} className="animate-spin" /> : null}
          Save Changes
        </button>
      </div>

      <div className="rounded-xl border border-white/5 bg-ink-900 p-6 space-y-3">
        <h3 className="text-xs font-semibold uppercase tracking-widest text-ink-500">Billing Cycle Information</h3>
        <dl className="space-y-2 text-xs text-ink-400">
          <div className="flex justify-between border-b border-white/5 py-1">
            <dt>Provider</dt><dd className="font-mono uppercase text-white">{sub.provider}</dd>
          </div>
          <div className="flex justify-between border-b border-white/5 py-1">
            <dt>Current Period Start</dt><dd className="text-white">{formatDate(sub.currentPeriodStart)}</dd>
          </div>
          <div className="flex justify-between border-b border-white/5 py-1">
            <dt>Current Period End</dt><dd className="text-white">{formatDate(sub.currentPeriodEnd)}</dd>
          </div>
          <div className="flex justify-between py-1">
            <dt>Created Date</dt><dd className="text-white">{formatDate(sub.createdAt)}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
