"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import type { CheckoutKind } from "@/lib/checkout-registry";

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => { open: () => void };
  }
}

function loadScript(src: string) {
  return new Promise<void>((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) return resolve();
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load payment script."));
    document.body.appendChild(script);
  });
}

export function CheckoutButton({
  kind,
  id,
  label,
  highlighted,
}: {
  kind: CheckoutKind;
  id: string;
  /** Shown on hover/description of what's being purchased, e.g. plan or product name. */
  label: string;
  highlighted?: boolean;
}) {
  const [loading, setLoading] = useState<"razorpay" | "stripe" | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function payWithRazorpay() {
    setLoading("razorpay");
    setError(null);
    try {
      const res = await fetch("/api/checkout/razorpay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind, id }),
      });
      const data = await res.json();
      if (res.status === 401) {
        window.location.href = "/account";
        return;
      }
      if (!res.ok) throw new Error(data.error || "Something went wrong.");

      await loadScript("https://checkout.razorpay.com/v1/checkout.js");
      const rzp = new window.Razorpay({
        key: data.keyId,
        amount: data.amount,
        currency: "INR",
        name: "Planora AI",
        description: label,
        order_id: data.orderId,
        handler: () => {
          window.location.href = "/checkout/success";
        },
        theme: { color: "#1F5FA8" },
      });
      rzp.open();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(null);
    }
  }

  async function payWithStripe() {
    setLoading("stripe");
    setError(null);
    try {
      const res = await fetch("/api/checkout/stripe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind, id }),
      });
      const data = await res.json();
      if (res.status === 401) {
        window.location.href = "/account";
        return;
      }
      if (!res.ok) throw new Error(data.error || "Something went wrong.");
      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setLoading(null);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        <Button
          onClick={payWithRazorpay}
          variant={highlighted ? "primary" : "secondary"}
          className="flex-1"
          disabled={loading !== null}
        >
          {loading === "razorpay" ? "Redirecting…" : "Razorpay"}
        </Button>
        <Button onClick={payWithStripe} variant="secondary" className="flex-1" disabled={loading !== null}>
          {loading === "stripe" ? "Redirecting…" : "Stripe"}
        </Button>
      </div>
      {error && <p className="text-xs text-stamp-500">{error}</p>}
    </div>
  );
}
