import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { fulfillPurchase } from "@/lib/fulfill-purchase";

export async function POST(req: NextRequest) {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!secretKey || !webhookSecret) {
    return NextResponse.json({ error: "Stripe webhook not configured." }, { status: 503 });
  }

  const stripe = new Stripe(secretKey, { apiVersion: "2024-06-20" });
  const rawBody = await req.text();
  const signature = req.headers.get("stripe-signature");

  let event: Stripe.Event;
  try {
    if (!signature) throw new Error("Missing stripe-signature header");
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (err) {
    console.error("Stripe webhook signature verification failed", err);
    return NextResponse.json({ error: "Invalid signature." }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const { itemId, itemName, kind, userEmail } = session.metadata ?? {};

    if (userEmail && itemId && itemName) {
      const { invoice } = await fulfillPurchase({
        userEmail,
        kind: kind ?? "plan",
        itemId,
        itemName,
        amountInPaise: session.amount_total ?? 0,
        provider: "stripe",
        providerRef: session.id,
      });
      console.log("Stripe checkout completed — invoice generated:", invoice.invoiceNumber);
    } else {
      console.warn("Stripe checkout.session.completed missing expected metadata; skipping fulfillment.", session.id);
    }
  }

  return NextResponse.json({ received: true });
}
