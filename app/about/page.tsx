import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Section } from "@/components/ui/Section";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description: "Planora AI is building the AI layer for India's town planning system.",
  alternates: { canonical: "/about" },
};

const principles = [
  {
    title: "Cite everything",
    description: "An answer without a citation isn't an answer — it's a guess with good posture.",
  },
  {
    title: "Scope tightly",
    description: "Nine focused products beat one product that tries to do everything badly.",
  },
  {
    title: "Build for India first",
    description: "Pricing, payments, and regulatory coverage are designed around the Indian market from day one.",
  },
];

export default function AboutPage() {
  return (
    <>
      <section className="grid-surface border-b border-ink-100 dark:border-ink-800">
        <Container className="py-16 md:py-20">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "About", href: "/about" }]} />
          <h1 className="mt-6 max-w-2xl text-display-lg font-medium">{site.tagline}</h1>
          <p className="mt-5 max-w-xl text-lg text-ink-500 dark:text-ink-200">{site.description}</p>
        </Container>
      </section>

      <Section eyebrow="Principles" title="What we build on">
        <div className="grid gap-8 sm:grid-cols-3">
          {principles.map((p) => (
            <div key={p.title} className="border-l-2 border-blueprint-500 pl-5 dark:border-blueprint-400">
              <p className="font-display text-lg font-medium">{p.title}</p>
              <p className="mt-1.5 text-sm text-ink-500 dark:text-ink-300">{p.description}</p>
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}
