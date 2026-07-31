import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "API Reference",
  description: "Authenticate and query the Planora AI API.",
  alternates: { canonical: "/docs/api" },
};

const endpoint = `curl https://api.planora.ai/v1/town-planning/query \\
  -H "Authorization: Bearer $PLANORA_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "query": "What is the minimum front setback under UDCPR for a residential plot?",
    "state": "maharashtra"
  }'`;

export default function ApiDocsPage() {
  return (
    <Container className="py-16">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Docs", href: "/docs" },
          { label: "API Reference", href: "/docs/api" },
        ]}
      />
      <h1 className="mt-6 text-display-lg font-medium">API Reference</h1>
      <p className="mt-4 max-w-xl text-lg text-ink-500 dark:text-ink-200">
        The Planora AI API is available on the Developer, Enterprise, and Government plans.
      </p>

      <div className="mt-10 max-w-2xl">
        <p className="label-mono mb-3">Example request</p>
        <pre className="overflow-x-auto rounded-lg border border-ink-100 bg-ink-900 p-5 text-xs text-ink-100 dark:border-ink-800">
          <code>{endpoint}</code>
        </pre>
      </div>

      <div className="mt-10 flex gap-4">
        <Button href="/pricing">View Developer plan</Button>
        <Button href="/contact" variant="secondary">
          Request API access
        </Button>
      </div>
    </Container>
  );
}
