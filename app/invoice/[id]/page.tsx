import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Invoice",
  robots: { index: false },
};

export default async function InvoicePage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) redirect("/account");

  const invoice = await prisma.invoice.findUnique({
    where: { id: params.id },
    include: { purchase: { include: { user: true } } },
  });

  if (!invoice || invoice.purchase.user.email !== session.user.email) notFound();

  const format = (n: number) =>
    n.toLocaleString("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 2 });

  return (
    <Container className="py-16 print:py-0">
      <div className="mx-auto max-w-2xl rounded-lg border border-ink-100 p-10 dark:border-ink-800 print:border-0">
        <div className="flex items-start justify-between">
          <div>
            <p className="font-display text-xl font-medium">Glash (Planora AI)</p>
            <p className="mt-1 text-sm text-ink-500 dark:text-ink-300">Maharashtra, India</p>
            <p className="mt-1 font-mono text-xs text-ink-400">GSTIN: 27AAAAA0000A1Z5</p>
          </div>
          <div className="text-right">
            <p className="label-mono">Tax Invoice</p>
            <p className="mt-1 font-mono text-sm">{invoice.invoiceNumber}</p>
            <p className="mt-1 text-xs text-ink-400">
              {new Date(invoice.createdAt).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })}
            </p>
          </div>
        </div>

        <div className="mt-10 border-t border-ink-100 pt-6 dark:border-ink-800">
          <p className="label-mono mb-2">Billed to</p>
          <p className="text-sm">{invoice.purchase.user.name ?? invoice.purchase.user.email}</p>
          <p className="text-sm text-ink-500 dark:text-ink-300">{invoice.purchase.user.email}</p>
          <p className="text-sm text-ink-500 dark:text-ink-300">{invoice.buyerState}, India</p>
        </div>

        <table className="mt-10 w-full text-sm">
          <thead>
            <tr className="border-b border-ink-100 text-left text-ink-400 dark:border-ink-800">
              <th className="pb-3 font-normal">Description</th>
              <th className="pb-3 text-right font-normal">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-ink-100 dark:border-ink-800">
              <td className="py-3">{invoice.purchase.itemName}</td>
              <td className="py-3 text-right">{format(invoice.subtotal)}</td>
            </tr>
          </tbody>
        </table>

        <div className="ml-auto mt-6 flex max-w-xs flex-col gap-2 text-sm">
          <div className="flex justify-between text-ink-500 dark:text-ink-300">
            <span>Subtotal</span>
            <span>{format(invoice.subtotal)}</span>
          </div>
          <div className="flex justify-between text-ink-500 dark:text-ink-300">
            <span>{invoice.gstType === "CGST_SGST" ? "CGST + SGST (18%)" : "IGST (18%)"}</span>
            <span>{format(invoice.gstAmount)}</span>
          </div>
          <div className="mt-2 flex justify-between border-t border-ink-100 pt-2 font-display text-base font-medium dark:border-ink-800">
            <span>Total</span>
            <span>{format(invoice.total)}</span>
          </div>
        </div>
      </div>
    </Container>
  );
}
