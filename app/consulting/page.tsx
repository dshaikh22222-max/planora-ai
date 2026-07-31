import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { BookingForm } from "@/components/consulting/BookingForm";

export const metadata: Metadata = {
  title: "Consulting",
  description: "Book time with the Planora AI team for compliance review, integration support, or government partnerships.",
  alternates: { canonical: "/consulting" },
};

const offerings = [
  { title: "Compliance review", detail: "A working session on a specific layout, permission, or site plan." },
  { title: "API integration", detail: "Help wiring Planora AI products into your internal tools or workflows." },
  { title: "Government partnerships", detail: "Scoping a deployment for a municipal or state planning authority." },
];

export default function ConsultingPage() {
  return (
    <Container className="py-16">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Consulting", href: "/consulting" }]} />
      <div className="mt-8 grid gap-14 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <h1 className="text-display-lg font-medium">Consulting</h1>
          <p className="mt-4 max-w-md text-lg text-ink-500 dark:text-ink-200">
            Book a session directly with the team building Planora AI.
          </p>
          <div className="mt-10 flex flex-col gap-6">
            {offerings.map((o) => (
              <div key={o.title} className="border-l-2 border-blueprint-500 pl-5 dark:border-blueprint-400">
                <p className="font-display text-base font-medium">{o.title}</p>
                <p className="mt-1 text-sm text-ink-500 dark:text-ink-300">{o.detail}</p>
              </div>
            ))}
          </div>
        </div>
        <BookingForm />
      </div>
    </Container>
  );
}
