import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { MarketplaceCard } from "@/components/marketplace/MarketplaceCard";
import { marketplaceItems } from "@/lib/marketplace";

export const metadata: Metadata = {
  title: "Templates",
  description: "Ready-to-use compliance and permission templates for architects, planners, and consultants.",
  alternates: { canonical: "/templates" },
};

export default function TemplatesPage() {
  const templates = marketplaceItems.filter((i) => i.category === "Template");

  return (
    <Container className="py-16">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Templates", href: "/templates" }]} />
      <h1 className="mt-6 text-display-lg font-medium">Templates</h1>
      <p className="mt-4 max-w-xl text-lg text-ink-500 dark:text-ink-200">
        Ready-to-fill templates for compliance checks and permission applications.
      </p>

      <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {templates.map((item) => (
          <MarketplaceCard key={item.slug} item={item} />
        ))}
      </div>
    </Container>
  );
}
