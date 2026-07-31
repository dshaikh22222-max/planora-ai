export type InvoiceLineItem = { description: string; amount: number };

export type Invoice = {
  id: string;
  date: string;
  seller: { name: string; gstin: string; address: string };
  buyer: { name: string; email: string; gstin?: string; state: string };
  items: InvoiceLineItem[];
  subtotal: number;
  gst:
    | { type: "CGST_SGST"; rate: number; cgst: number; sgst: number }
    | { type: "IGST"; rate: number; igst: number };
  total: number;
};

const SELLER_STATE = "Maharashtra";
const GST_RATE = 18;

/**
 * Splits GST into CGST+SGST when the buyer is in the same state as the
 * seller (Maharashtra), or IGST for inter-state transactions — matching how
 * GST actually applies to a Maharashtra-registered seller under Indian law.
 */
export function computeGst(subtotal: number, buyerState: string): Invoice["gst"] {
  const gstAmount = Math.round((subtotal * GST_RATE) / 100);
  if (buyerState.trim().toLowerCase() === SELLER_STATE.toLowerCase()) {
    return { type: "CGST_SGST", rate: GST_RATE, cgst: gstAmount / 2, sgst: gstAmount / 2 };
  }
  return { type: "IGST", rate: GST_RATE, igst: gstAmount };
}

export function generateInvoiceId() {
  const now = new Date();
  const stamp = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}`;
  const rand = Math.floor(100000 + Math.random() * 900000);
  return `PL-${stamp}-${rand}`;
}

export function buildInvoice(params: {
  buyerName: string;
  buyerEmail: string;
  buyerState: string;
  buyerGstin?: string;
  planName: string;
  /** Amount in paise, exclusive of GST. */
  amountInPaise: number;
}): Invoice {
  const subtotal = params.amountInPaise / 100;
  const gst = computeGst(subtotal, params.buyerState);
  const gstTotal = gst.type === "CGST_SGST" ? gst.cgst + gst.sgst : gst.igst;

  return {
    id: generateInvoiceId(),
    date: new Date().toISOString(),
    seller: {
      name: "Glash (Planora AI)",
      gstin: "27AAAAA0000A1Z5",
      address: "Maharashtra, India",
    },
    buyer: {
      name: params.buyerName,
      email: params.buyerEmail,
      gstin: params.buyerGstin,
      state: params.buyerState,
    },
    items: [{ description: `Planora AI — ${params.planName} plan (monthly)`, amount: subtotal }],
    subtotal,
    gst,
    total: subtotal + gstTotal,
  };
}
