import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { fulfillPurchase } from "@/lib/fulfill-purchase";

export async function POST(req: NextRequest) {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "Webhook secret not configured." }, { status: 503 });
  }

  const rawBody = await req.text();
  const signature = req.headers.get("x-razorpay-signature");

  const expectedSignature = crypto.createHmac("sha256", secret).update(rawBody).digest("hex");
  if (!signature || signature !== expectedSignature) {
    return NextResponse.json({ error: "Invalid signature." }, { status: 400 });
  }

  const event = JSON.parse(rawBody);

  if (event.event === "payment.captured") {
    const payment = event.payload.payment.entity;
    const { itemId, itemName, kind, userEmail } = payment.notes ?? {};

    if (userEmail && itemId && itemName) {
      const { invoice } = await fulfillPurchase({
        userEmail,
        kind: kind ?? "plan",
        itemId,
        itemName,
        amountInPaise: payment.amount,
        provider: "razorpay",
        providerRef: payment.order_id,
      });
      console.log("Razorpay payment captured — invoice generated:", invoice.invoiceNumber);
    } else {
      console.warn("Razorpay payment.captured missing expected notes; skipping fulfillment.", payment.id);
    }
  }

  return NextResponse.json({ received: true });
}
