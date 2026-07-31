import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { buildInvoice } from "@/lib/invoice";

export const metadata: Metadata = {
  title: "Invoice (demo)",
  robots: { index: false },
};

export default function InvoiceDemoPage() {
  const invoice = buildInvoice({
    buyerName: "Rahul Deshmukh",
    buyerEmail: "rahul@example.com",
    buyerState: "Maharashtra",
    buyerGstin: "27BBBBB1111B1Z2",
    planName: "Pro",
    amountInPaise: 99900,
  });

  const format = (n: number) =>
    n.toLocaleString("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 2 });

  return (
    <Container className="py-16 print:py-0">
      <div className="mx-auto max-w-2xl rounded-lg border border-ink-100 p-10 dark:border-ink-800 print:border-0">
        <div className="flex items-start justify-between">
          <div>
            <p className="font-display text-xl font-medium">{invoice.seller.name}</p>
            <p className="mt-1 text-sm text-ink-500 dark:text-ink-300">{invoice.seller.address}</p>
            <p className="mt-1 font-mono text-xs text-ink-400">GSTIN: {invoice.seller.gstin}</p>
          </div>
          <div className="text-right">
            <p className="label-mono">Tax Invoice</p>
            <p className="mt-1 font-mono text-sm">{invoice.id}</p>
            <p className="mt-1 text-xs text-ink-400">
              {new Date(invoice.date).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })}
            </p>
          </div>
        </div>

        <div className="mt-10 border-t border-ink-100 pt-6 dark:border-ink-800">
          <p className="label-mono mb-2">Billed to</p>
          <p className="text-sm">{invoice.buyer.name}</p>
          <p className="text-sm text-ink-500 dark:text-ink-300">{invoice.buyer.email}</p>
          <p className="text-sm text-ink-500 dark:text-ink-300">{invoice.buyer.state}, India</p>
          {invoice.buyer.gstin && <p className="font-mono text-xs text-ink-400">GSTIN: {invoice.buyer.gstin}</p>}
        </div>

        <table className="mt-10 w-full text-sm">
          <thead>
            <tr className="border-b border-ink-100 text-left text-ink-400 dark:border-ink-800">
              <th className="pb-3 font-normal">Description</th>
              <th className="pb-3 text-right font-normal">Amount</th>
            </tr>
          </thead>
          <tbody>
            {invoice.items.map((item) => (
              <tr key={item.description} className="border-b border-ink-100 dark:border-ink-800">
                <td className="py-3">{item.description}</td>
                <td className="py-3 text-right">{format(item.amount)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="ml-auto mt-6 flex max-w-xs flex-col gap-2 text-sm">
          <div className="flex justify-between text-ink-500 dark:text-ink-300">
            <span>Subtotal</span>
            <span>{format(invoice.subtotal)}</span>
          </div>
          {invoice.gst.type === "CGST_SGST" ? (
            <>
              <div className="flex justify-between text-ink-500 dark:text-ink-300">
                <span>CGST ({invoice.gst.rate / 2}%)</span>
                <span>{format(invoice.gst.cgst)}</span>
              </div>
              <div className="flex justify-between text-ink-500 dark:text-ink-300">
                <span>SGST ({invoice.gst.rate / 2}%)</span>
                <span>{format(invoice.gst.sgst)}</span>
              </div>
            </>
          ) : (
            <div className="flex justify-between text-ink-500 dark:text-ink-300">
              <span>IGST ({invoice.gst.rate}%)</span>
              <span>{format(invoice.gst.igst)}</span>
            </div>
          )}
          <div className="mt-2 flex justify-between border-t border-ink-100 pt-2 font-display text-base font-medium dark:border-ink-800">
            <span>Total</span>
            <span>{format(invoice.total)}</span>
          </div>
        </div>

        <p className="mt-10 text-xs text-ink-400">
          This is a design preview generated from live invoice logic (lib/invoice.ts). Real
          invoices are generated on payment webhook events once account records exist.
        </p>
      </div>
    </Container>
  );
}
