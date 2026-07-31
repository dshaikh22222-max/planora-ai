import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Careers",
  description: "Open roles at Planora AI.",
  alternates: { canonical: "/careers" },
};

const roles = [
  { title: "Founding ML Engineer — Retrieval", location: "Remote (India)", type: "Full-time" },
  { title: "Frontend Engineer — Next.js", location: "Remote (India)", type: "Full-time" },
  { title: "Legal Research Analyst — Town Planning", location: "Pune / Remote", type: "Full-time" },
  { title: "Developer Advocate", location: "Remote (India)", type: "Contract" },
];

export default function CareersPage() {
  return (
    <Container className="py-16">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Careers", href: "/careers" }]} />
      <h1 className="mt-6 text-display-lg font-medium">Careers</h1>
      <p className="mt-4 max-w-xl text-lg text-ink-500 dark:text-ink-200">
        We&apos;re a small team building the AI layer for India&apos;s town planning system.
      </p>

      <div className="mt-14 flex flex-col divide-y divide-ink-100 border-y border-ink-100 dark:divide-ink-800 dark:border-ink-800">
        {roles.map((role) => (
          <div key={role.title} className="flex flex-wrap items-center justify-between gap-4 py-6">
            <div>
              <p className="font-display text-base font-medium">{role.title}</p>
              <p className="mt-1 text-sm text-ink-500 dark:text-ink-300">
                {role.location} · {role.type}
              </p>
            </div>
            <Button href="/contact" variant="secondary" size="sm">
              Apply
            </Button>
          </div>
        ))}
      </div>
    </Container>
  );
}
