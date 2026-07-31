import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { resolveCheckoutItem } from "@/lib/checkout-registry";
import { site } from "@/lib/site";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Sign in to continue.", requiresAuth: true }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const item = body ? resolveCheckoutItem(body.kind, body.id) : null;

  if (!item) {
    return NextResponse.json({ error: "Unknown or non-checkoutable item." }, { status: 400 });
  }

  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    return NextResponse.json(
      { error: "Stripe isn't configured on this deployment yet. Set STRIPE_SECRET_KEY." },
      { status: 503 }
    );
  }

  const stripe = new Stripe(secretKey, { apiVersion: "2024-06-20" });

  try {
    const checkoutSession = await stripe.checkout.sessions.create({
      mode: item.mode,
      customer_email: session.user.email,
      line_items: [
        {
          price_data: {
            currency: "inr",
            unit_amount: item.amountInPaise,
            ...(item.mode === "subscription" ? { recurring: { interval: "month" } } : {}),
            product_data: { name: `Planora AI — ${item.name}` },
          },
          quantity: 1,
        },
      ],
      metadata: {
        itemId: item.id,
        itemName: item.name,
        kind: item.mode === "subscription" ? "plan" : body.kind,
        userEmail: session.user.email,
      },
      success_url: `${site.url}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${site.url}/checkout/cancel`,
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (err) {
    console.error("Stripe session creation failed", err);
    return NextResponse.json({ error: "Could not create Stripe checkout session." }, { status: 502 });
  }
}
