import { CheckoutButton } from "@/components/checkout/CheckoutButton";
import type { MarketplaceItem } from "@/lib/marketplace";

export function MarketplaceCard({ item }: { item: MarketplaceItem }) {
  const price = (item.priceInPaise / 100).toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  });

  return (
    <div className="flex flex-col rounded-lg border border-ink-100 bg-paper p-6 dark:border-ink-800 dark:bg-ink-800/30">
      <span className="label-mono w-fit">{item.category}</span>
      <h3 className="mt-3 font-display text-lg font-medium">{item.name}</h3>
      <p className="mt-2 flex-1 text-sm text-ink-500 dark:text-ink-300">{item.description}</p>
      <div className="mt-6 flex items-center justify-between">
        <span className="font-display text-xl font-medium">{price}</span>
      </div>
      <div className="mt-4">
        <CheckoutButton kind="marketplace" id={item.slug} label={item.name} />
      </div>
    </div>
  );
}
