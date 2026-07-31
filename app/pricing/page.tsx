import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Section } from "@/components/ui/Section";
import { PricingTable } from "@/components/pricing/PricingTable";
import { FAQSection } from "@/components/products/FAQSection";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Simple, transparent pricing for Planora AI — from a free tier for individuals to enterprise and government plans, billed in INR with GST-ready invoicing.",
  alternates: { canonical: "/pricing" },
};

const pricingFaqs = [
  {
    question: "What payment methods do you support?",
    answer: "Razorpay and Stripe, covering UPI, credit and debit cards, and net banking.",
  },
  {
    question: "Do you provide GST invoices?",
    answer: "Yes — every paid plan generates a GST-ready invoice automatically after payment.",
  },
  {
    question: "Can I switch plans later?",
    answer: "Yes, you can upgrade or downgrade at any time; billing is prorated for the current cycle.",
  },
  {
    question: "Is there a discount for annual billing?",
    answer: "Annual billing is available on Pro and Developer plans at a reduced effective monthly rate.",
  },
];

export default function PricingPage() {
  return (
    <>
      <section className="grid-surface border-b border-ink-100 dark:border-ink-800">
        <Container className="py-16 text-center md:py-20">
          <Breadcrumbs
            items={[{ label: "Home", href: "/" }, { label: "Pricing", href: "/pricing" }]}
          />
          <h1 className="mx-auto mt-6 max-w-2xl text-display-lg font-medium">
            Simple pricing, priced for India.
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-ink-500 dark:text-ink-200">
            Every plan bills in INR via Razorpay or Stripe, with GST-ready invoicing built in.
          </p>
        </Container>
      </section>

      <Section>
        <PricingTable />
      </Section>

      <FAQSection faqs={pricingFaqs} />
    </>
  );
}
