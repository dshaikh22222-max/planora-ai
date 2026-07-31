import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { resolveCheckoutItem } from "@/lib/checkout-registry";

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

  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    return NextResponse.json(
      { error: "Razorpay isn't configured on this deployment yet. Set RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET." },
      { status: 503 }
    );
  }

  const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });

  try {
    const order = await razorpay.orders.create({
      amount: item.amountInPaise,
      currency: "INR",
      receipt: `planora_${item.id}_${Date.now()}`,
      notes: {
        itemId: item.id,
        itemName: item.name,
        kind: item.mode === "subscription" ? "plan" : body.kind,
        userEmail: session.user.email,
      },
    });

    return NextResponse.json({ orderId: order.id, amount: order.amount, keyId });
  } catch (err) {
    console.error("Razorpay order creation failed", err);
    return NextResponse.json({ error: "Could not create Razorpay order." }, { status: 502 });
  }
}
