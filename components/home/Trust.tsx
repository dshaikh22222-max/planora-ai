import { Button } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";

const audiences = [
  {
    label: "Architects & Planners",
    detail: "Scrutinize layouts against development control regulations before you submit.",
  },
  {
    label: "Developers & Builders",
    detail: "Cut permission timelines by catching compliance issues at the drawing stage.",
  },
  {
    label: "Government Agencies",
    detail: "Standardize scrutiny with an assistant that cites the exact regulation, every time.",
  },
  {
    label: "Legal & Consulting Teams",
    detail: "Search MRTP, UDCPR, and RERA across states from a single interface.",
  },
];

export function Trust() {
  return (
    <>
      <Section eyebrow="Built For" title="Trusted by the people who move plans through approval.">
        <div className="grid gap-8 sm:grid-cols-2">
          {audiences.map((a) => (
            <div key={a.label} className="border-l-2 border-blueprint-500 pl-5 dark:border-blueprint-400">
              <p className="font-display text-lg font-medium">{a.label}</p>
              <p className="mt-1.5 text-sm text-ink-500 dark:text-ink-300">{a.detail}</p>
            </div>
          ))}
        </div>
      </Section>

      <section className="grid-surface-fine border-t border-ink-100 dark:border-ink-800">
        <div className="mx-auto max-w-7xl px-6 py-24 text-center md:px-10">
          <h2 className="text-display-md mx-auto max-w-2xl font-medium">
            Start with a question. End with a citation.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-ink-500 dark:text-ink-300">
            Ask Town Planning AI anything about layout, permission, or compliance — and get
            an answer traceable to the exact section of law.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Button href="/products/town-planning-ai" size="lg">
              Try it free
            </Button>
            <Button href="/consulting" variant="secondary" size="lg">
              Talk to consulting
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
