import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";

export const metadata: Metadata = {
  title: "Terms",
  description: "Terms of service for Planora AI.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <Container className="py-16">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Terms", href: "/terms" }]} />
      <div className="prose mt-8 max-w-2xl dark:prose-invert prose-headings:font-display">
        <h1>Terms of Service</h1>
        <p>Last updated: July 2026</p>

        <h2>1. Acceptance of terms</h2>
        <p>By using Planora AI products, you agree to these terms and our Privacy Policy.</p>

        <h2>2. Use of the service</h2>
        <p>
          Planora AI provides informational and workflow tools for town planning and building
          compliance. Output is provided for reference and does not constitute legal advice or a
          guarantee of regulatory approval.
        </p>

        <h2>3. Accounts and billing</h2>
        <p>
          Paid plans are billed on a recurring basis via Razorpay or Stripe. You may cancel at
          any time; access continues through the end of the billing period.
        </p>

        <h2>4. Acceptable use</h2>
        <p>You agree not to misuse the service, attempt to circumvent usage limits, or resell access without authorization.</p>

        <h2>5. Limitation of liability</h2>
        <p>Planora AI is provided &quot;as is.&quot; We are not liable for decisions made based on product output without independent verification.</p>

        <h2>6. Changes to these terms</h2>
        <p>We may update these terms from time to time; continued use constitutes acceptance of the revised terms.</p>

        <p className="mt-8 text-sm italic">
          This is placeholder terms text for the site build. Replace with counsel-reviewed
          language before launch.
        </p>
      </div>
    </Container>
  );
}
