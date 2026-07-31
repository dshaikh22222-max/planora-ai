import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Planora AI collects, uses, and protects your data.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <Container className="py-16">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Privacy Policy", href: "/privacy" }]} />
      <div className="prose mt-8 max-w-2xl dark:prose-invert prose-headings:font-display">
        <h1>Privacy Policy</h1>
        <p>Last updated: July 2026</p>

        <h2>1. Information we collect</h2>
        <p>
          We collect information you provide directly — such as account details and support
          requests — and usage data generated when you interact with Planora AI products.
        </p>

        <h2>2. How we use information</h2>
        <p>
          We use collected information to operate and improve our products, process payments,
          provide support, and communicate product updates.
        </p>

        <h2>3. Data sharing</h2>
        <p>
          We do not sell personal data. Information is shared only with service providers
          necessary to operate the platform (such as payment processors) or when required by law.
        </p>

        <h2>4. Data retention</h2>
        <p>We retain account and usage data for as long as your account is active, or as needed to comply with legal obligations.</p>

        <h2>5. Your rights</h2>
        <p>You may request access to, correction of, or deletion of your personal data by contacting hello@planora.ai.</p>

        <h2>6. Contact</h2>
        <p>Questions about this policy can be directed to hello@planora.ai.</p>

        <p className="mt-8 text-sm italic">
          This is placeholder policy text for the site build. Replace with counsel-reviewed
          language before launch.
        </p>
      </div>
    </Container>
  );
}
