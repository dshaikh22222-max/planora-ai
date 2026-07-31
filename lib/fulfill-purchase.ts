import { prisma } from "@/lib/prisma";
import { computeGst, generateInvoiceId } from "@/lib/invoice";

export async function fulfillPurchase(params: {
  userEmail: string;
  kind: string; // plan | marketplace | course
  itemId: string;
  itemName: string;
  amountInPaise: number;
  provider: "razorpay" | "stripe";
  providerRef: string;
  buyerState?: string;
}) {
  const buyerState = params.buyerState ?? "Maharashtra";
  const subtotal = params.amountInPaise / 100;
  const gst = computeGst(subtotal, buyerState);
  const gstAmount = gst.type === "CGST_SGST" ? gst.cgst + gst.sgst : gst.igst;

  const user = await prisma.user.upsert({
    where: { email: params.userEmail },
    update: {},
    create: { email: params.userEmail },
  });

  const purchase = await prisma.purchase.create({
    data: {
      userId: user.id,
      kind: params.kind,
      itemId: params.itemId,
      itemName: params.itemName,
      amountInPaise: params.amountInPaise,
      provider: params.provider,
      providerRef: params.providerRef,
    },
  });

  const invoice = await prisma.invoice.create({
    data: {
      purchaseId: purchase.id,
      invoiceNumber: generateInvoiceId(),
      subtotal,
      gstType: gst.type,
      gstAmount,
      total: subtotal + gstAmount,
      buyerState,
    },
  });

  // A "plan" purchase activates that plan on the account immediately.
  if (params.kind === "plan") {
    await prisma.user.update({ where: { id: user.id }, data: { plan: params.itemName } });
  }

  return { user, purchase, invoice };
}
