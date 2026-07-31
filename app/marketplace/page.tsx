import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { MarketplaceCard } from "@/components/marketplace/MarketplaceCard";
import { marketplaceItems } from "@/lib/marketplace";

export const metadata: Metadata = {
  title: "Marketplace",
  description: "Premium templates, reports, and datasets for town planning professionals — one-time purchase, instant access.",
  alternates: { canonical: "/marketplace" },
};

export default function MarketplacePage() {
  return (
    <Container className="py-16">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Marketplace", href: "/marketplace" }]} />
      <h1 className="mt-6 text-display-lg font-medium">Marketplace</h1>
      <p className="mt-4 max-w-xl text-lg text-ink-500 dark:text-ink-200">
        Premium templates, reports, and datasets — one-time purchase, instant access.
      </p>

      <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {marketplaceItems.map((item) => (
          <MarketplaceCard key={item.slug} item={item} />
        ))}
      </div>
    </Container>
  );
}
