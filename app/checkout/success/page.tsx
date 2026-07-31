import type { Metadata } from "next";
import { CheckCircle2 } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Payment successful",
  robots: { index: false },
};

export default function CheckoutSuccessPage() {
  return (
    <Container className="flex flex-col items-center py-24 text-center">
      <CheckCircle2 className="h-12 w-12 text-blueprint-500 dark:text-blueprint-300" />
      <h1 className="mt-6 text-display-md font-medium">Payment successful</h1>
      <p className="mt-3 max-w-md text-ink-500 dark:text-ink-300">
        Your plan is now active. A GST-ready invoice has been generated and will be emailed to
        you shortly.
      </p>
      <Button href="/" className="mt-8">
        Back to home
      </Button>
    </Container>
  );
}
