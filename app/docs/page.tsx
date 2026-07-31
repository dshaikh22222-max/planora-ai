import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";

export const metadata: Metadata = {
  title: "Documentation",
  description: "Guides and API reference for building with the Planora AI product line.",
  alternates: { canonical: "/docs" },
};

const sections = [
  { title: "Getting Started", description: "Create an account and make your first query.", href: "/docs" },
  { title: "API Reference", description: "Authenticate and call the Planora AI API directly.", href: "/docs/api" },
  { title: "Rate Limits & Plans", description: "Understand usage limits across Free, Pro, and Developer plans.", href: "/pricing" },
  { title: "Webhooks", description: "Subscribe to events for long-running scrutiny jobs.", href: "/docs/api" },
];

export default function DocsPage() {
  return (
    <Container className="py-16">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Docs", href: "/docs" }]} />
      <h1 className="mt-6 text-display-lg font-medium">Documentation</h1>
      <p className="mt-4 max-w-xl text-lg text-ink-500 dark:text-ink-200">
        Guides and reference material for building with Planora AI.
      </p>

      <div className="mt-14 grid gap-px overflow-hidden rounded-lg border border-ink-100 bg-ink-100 dark:border-ink-800 dark:bg-ink-800 sm:grid-cols-2">
        {sections.map((s) => (
          <Link
            key={s.title}
            href={s.href}
            className="group flex items-start justify-between gap-4 bg-paper p-6 transition-colors hover:bg-white dark:bg-ink-900 dark:hover:bg-ink-800"
          >
            <div>
              <h2 className="font-display text-base font-medium">{s.title}</h2>
              <p className="mt-1.5 text-sm text-ink-500 dark:text-ink-300">{s.description}</p>
            </div>
            <ArrowUpRight className="h-4 w-4 shrink-0 text-ink-300 group-hover:text-ink-900 dark:text-ink-600 dark:group-hover:text-white" />
          </Link>
        ))}
      </div>
    </Container>
  );
}
