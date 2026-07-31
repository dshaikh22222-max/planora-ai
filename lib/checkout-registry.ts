import { tiers } from "./pricing";
import { marketplaceItems } from "./marketplace";
import { courses } from "./courses";

export type CheckoutItem = {
  id: string;
  name: string;
  amountInPaise: number;
  mode: "subscription" | "payment";
};

export type CheckoutKind = "plan" | "marketplace" | "course";

/**
 * Resolves a (kind, id) pair to a priced, checkoutable item — always
 * server-side, never trusting a client-supplied amount. Add a new sellable
 * thing by adding it to pricing.ts / marketplace.ts / courses.ts; this
 * function doesn't need to change.
 */
export function resolveCheckoutItem(kind: string, id: string): CheckoutItem | null {
  if (kind === "plan") {
    const tier = tiers.find((t) => t.name === id);
    if (!tier?.amountInPaise) return null;
    return { id: tier.name, name: `${tier.name} plan`, amountInPaise: tier.amountInPaise, mode: "subscription" };
  }

  if (kind === "marketplace") {
    const item = marketplaceItems.find((i) => i.slug === id);
    if (!item) return null;
    return { id: item.slug, name: item.name, amountInPaise: item.priceInPaise, mode: "payment" };
  }

  if (kind === "course") {
    const course = courses.find((c) => c.slug === id);
    if (!course) return null;
    return { id: course.slug, name: course.title, amountInPaise: course.priceInPaise, mode: "payment" };
  }

  return null;
}
