// ─────────────────────────────────────────────────────────────
// Razorpay Admin API Helper — Pure fetch client
// Uses RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET from process.env
// ─────────────────────────────────────────────────────────────

function getBasicAuthHeader(): string {
  const keyId = process.env.RAZORPAY_KEY_ID ?? "";
  const keySecret = process.env.RAZORPAY_KEY_SECRET ?? "";
  const credentials = Buffer.from(`${keyId}:${keySecret}`).toString("base64");
  return `Basic ${credentials}`;
}

export type RazorpayRefundResult = {
  id: string;
  payment_id: string;
  amount: number;
  currency: string;
  status: string;
};

/**
 * Issue a refund for a payment via Razorpay REST API
 */
export async function issueRazorpayRefund(params: {
  paymentId: string;
  amountInPaise?: number;
  notes?: Record<string, string>;
}): Promise<RazorpayRefundResult> {
  const auth = getBasicAuthHeader();
  if (!process.env.RAZORPAY_KEY_ID) {
    throw new Error("RAZORPAY_KEY_ID is not configured in environment variables");
  }

  const res = await fetch(`https://api.razorpay.com/v1/payments/${params.paymentId}/refund`, {
    method: "POST",
    headers: {
      Authorization: auth,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      amount: params.amountInPaise,
      notes: params.notes,
    }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error?.description ?? `Razorpay refund failed with status ${res.status}`);
  }

  return data as RazorpayRefundResult;
}

export type RazorpaySubscriptionFetchResult = {
  id: string;
  plan_id: string;
  status: string;
  current_start: number;
  current_end: number;
  ended_at: number | null;
  quantity: number;
  notes?: Record<string, string>;
};

/**
 * Fetch subscription status from Razorpay API
 */
export async function fetchRazorpaySubscription(
  subscriptionId: string
): Promise<RazorpaySubscriptionFetchResult> {
  const auth = getBasicAuthHeader();
  const res = await fetch(`https://api.razorpay.com/v1/subscriptions/${subscriptionId}`, {
    headers: { Authorization: auth },
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error?.description ?? `Razorpay fetch subscription failed: ${res.status}`);
  }

  return data as RazorpaySubscriptionFetchResult;
}

/**
 * Cancel a subscription on Razorpay
 */
export async function cancelRazorpaySubscription(
  subscriptionId: string,
  cancelAtCycleEnd = false
): Promise<void> {
  const auth = getBasicAuthHeader();
  const res = await fetch(
    `https://api.razorpay.com/v1/subscriptions/${subscriptionId}/cancel`,
    {
      method: "POST",
      headers: { Authorization: auth, "Content-Type": "application/json" },
      body: JSON.stringify({ cancel_at_cycle_end: cancelAtCycleEnd ? 1 : 0 }),
    }
  );

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error?.description ?? "Razorpay subscription cancellation failed");
  }
}
