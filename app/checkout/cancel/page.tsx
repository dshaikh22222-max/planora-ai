import type { Metadata } from "next";
import { XCircle } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Payment cancelled",
  robots: { index: false },
};

export default function CheckoutCancelPage() {
  return (
    <Container className="flex flex-col items-center py-24 text-center">
      <XCircle className="h-12 w-12 text-stamp-500" />
      <h1 className="mt-6 text-display-md font-medium">Payment cancelled</h1>
      <p className="mt-3 max-w-md text-ink-500 dark:text-ink-300">
        No charge was made. You can try again anytime from the pricing page.
      </p>
      <Button href="/pricing" className="mt-8">
        Back to pricing
      </Button>
    </Container>
  );
}
