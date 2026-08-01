"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Truck, RotateCcw, CheckCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import { formatINR, formatDate } from "@/lib/admin/utils/format";
import { StatusBadge } from "@/components/admin/ui/StatusBadge";

interface Fulfillment {
  id: string;
  carrier: string;
  trackingNumber: string;
  shippedAt: Date | string;
  notes?: string | null;
}

interface OrderDetail {
  id: string;
  orderNumber: string;
  userId: string;
  status: string;
  totalAmount: number;
  currency: string;
  shippingAddress: {
    name?: string;
    line1?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    phone?: string;
  } | null;
  trackingNumber: string | null;
  carrier: string | null;
  notes: string | null;
  refundReason: string | null;
  refundedAmount: number | null;
  createdAt: Date | string;
  fulfillments: Fulfillment[];
}

export default function OrderDetailClient({ order }: { order: OrderDetail }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  // Status state
  const [status, setStatus] = useState(order.status);
  const [notes, setNotes] = useState(order.notes ?? "");

  // Fulfillment form
  const [carrier, setCarrier] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");

  // Refund form
  const [refundReason, setRefundReason] = useState("");
  const [issueRazorpay, setIssueRazorpay] = useState(false);

  async function handleStatusUpdate(newStatus?: string) {
    setError(null);
    startTransition(async () => {
      const res = await fetch(`/api/admin/orders/${order.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: newStatus ?? status,
          notes,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error?.message ?? "Update failed");
        return;
      }

      if (newStatus) setStatus(newStatus);
      router.refresh();
    });
  }

  async function handleAddFulfillment() {
    if (!carrier || !trackingNumber) return;
    setError(null);
    startTransition(async () => {
      const res = await fetch(`/api/admin/orders/${order.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fulfillment: { carrier, trackingNumber },
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error?.message ?? "Fulfillment update failed");
        return;
      }

      setCarrier("");
      setTrackingNumber("");
      setStatus("SHIPPED");
      router.refresh();
    });
  }

  async function handleRefund() {
    if (!refundReason) return;
    setError(null);
    startTransition(async () => {
      const res = await fetch(`/api/admin/orders/${order.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          refund: {
            reason: refundReason,
            issueRazorpayRefund: issueRazorpay,
          },
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error?.message ?? "Refund failed");
        return;
      }

      setStatus("REFUNDED");
      router.refresh();
    });
  }

  const inputCls = "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-ink-600 outline-none transition focus:border-blueprint-500 focus:ring-1 focus:ring-blueprint-500/20";
  const labelCls = "mb-1.5 block text-xs font-medium text-ink-400";

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/orders" className="rounded-lg border border-white/10 bg-white/5 p-2 text-ink-400 transition hover:text-white">
          <ArrowLeft size={16} />
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white font-mono">{order.orderNumber}</h1>
            <StatusBadge status={status} size="xs" />
          </div>
          <p className="text-sm text-ink-500">
            Placed on {formatDate(order.createdAt)} · Total {formatINR(order.totalAmount)}
          </p>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">
          {error}
        </div>
      )}

      <div className="grid grid-cols-3 gap-6">
        {/* Main Details — 2 cols */}
        <div className="col-span-2 space-y-5">
          {/* Status & Notes */}
          <div className="rounded-xl border border-white/5 bg-ink-900 p-5 space-y-4">
            <h2 className="text-sm font-semibold text-white">Order Status</h2>
            <div className="flex gap-3">
              <select value={status} onChange={(e) => setStatus(e.target.value)} className={inputCls + " flex-1"}>
                <option value="PENDING">Pending</option>
                <option value="PROCESSING">Processing</option>
                <option value="SHIPPED">Shipped</option>
                <option value="FULFILLED">Fulfilled</option>
                <option value="DELIVERED">Delivered</option>
                <option value="CANCELLED">Cancelled</option>
                <option value="REFUNDED">Refunded</option>
              </select>
              <button
                onClick={() => handleStatusUpdate()}
                disabled={isPending}
                className="rounded-xl bg-blueprint-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blueprint-500 disabled:opacity-50"
              >
                {isPending ? <Loader2 size={14} className="animate-spin" /> : "Save Status"}
              </button>
            </div>
            <div>
              <label className={labelCls}>Internal Notes</label>
              <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} placeholder="Customer service notes…" className={inputCls + " resize-none"} />
            </div>
          </div>

          {/* Fulfillment Tracking */}
          <div className="rounded-xl border border-white/5 bg-ink-900 p-5 space-y-4">
            <div className="flex items-center gap-2">
              <Truck size={16} className="text-blueprint-400" />
              <h2 className="text-sm font-semibold text-white">Fulfillment & Shipment</h2>
            </div>

            {order.fulfillments.length > 0 && (
              <div className="space-y-2 border-b border-white/5 pb-4">
                {order.fulfillments.map((f) => (
                  <div key={f.id} className="flex items-center justify-between rounded-lg bg-white/5 p-3 text-xs">
                    <div>
                      <span className="font-semibold text-white">{f.carrier}:</span>{" "}
                      <span className="font-mono text-blueprint-300">{f.trackingNumber}</span>
                    </div>
                    <span className="text-ink-500">{formatDate(f.shippedAt)}</span>
                  </div>
                ))}
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>Carrier</label>
                <input value={carrier} onChange={(e) => setCarrier(e.target.value)} placeholder="e.g. BlueDart / Delhivery" className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Tracking Number</label>
                <input value={trackingNumber} onChange={(e) => setTrackingNumber(e.target.value)} placeholder="e.g. AWB-98765432" className={inputCls} />
              </div>
            </div>

            <button
              onClick={handleAddFulfillment}
              disabled={isPending || !carrier || !trackingNumber}
              className="flex items-center gap-2 rounded-xl border border-blueprint-500/30 bg-blueprint-600/15 px-4 py-2 text-xs font-semibold text-blueprint-300 transition hover:bg-blueprint-600/25 disabled:opacity-50"
            >
              <CheckCircle size={14} /> Add Tracking & Mark Shipped
            </button>
          </div>

          {/* Refund Actions */}
          <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-5 space-y-4">
            <div className="flex items-center gap-2">
              <RotateCcw size={16} className="text-rose-400" />
              <h2 className="text-sm font-semibold text-rose-200">Issue Refund</h2>
            </div>

            <div>
              <label className={labelCls}>Refund Reason *</label>
              <input value={refundReason} onChange={(e) => setRefundReason(e.target.value)} placeholder="e.g. Customer requested cancellation" className={inputCls} />
            </div>

            <label className="flex items-center gap-2 text-xs text-ink-300">
              <input type="checkbox" checked={issueRazorpay} onChange={(e) => setIssueRazorpay(e.target.checked)} className="h-4 w-4 rounded accent-rose-500" />
              Execute automatic refund on Razorpay gateway
            </label>

            <button
              onClick={handleRefund}
              disabled={isPending || !refundReason}
              className="rounded-xl bg-rose-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-rose-500 disabled:opacity-50"
            >
              Process Refund ({formatINR(order.totalAmount)})
            </button>
          </div>
        </div>

        {/* Sidebar Info — 1 col */}
        <div className="space-y-5">
          {/* Shipping Address */}
          <div className="rounded-xl border border-white/5 bg-ink-900 p-4 space-y-2">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-ink-500">Shipping Address</h3>
            {order.shippingAddress ? (
              <div className="text-xs text-ink-300 space-y-1">
                <p className="font-semibold text-white">{order.shippingAddress.name ?? "—"}</p>
                <p>{order.shippingAddress.line1}</p>
                <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}</p>
                {order.shippingAddress.phone && <p className="font-mono text-ink-500">{order.shippingAddress.phone}</p>}
              </div>
            ) : (
              <p className="text-xs text-ink-600">Digital fulfillment (no physical address)</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
