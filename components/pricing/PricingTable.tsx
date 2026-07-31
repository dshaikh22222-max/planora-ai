import { Check } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { CheckoutButton } from "@/components/checkout/CheckoutButton";
import { cn } from "@/lib/utils";
import { tiers } from "@/lib/pricing";

export function PricingTable() {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {tiers.map((tier) => (
        <div
          key={tier.name}
          className={cn(
            "flex flex-col rounded-lg border p-7",
            tier.highlighted
              ? "border-blueprint-500 bg-blueprint-50/50 dark:border-blueprint-400 dark:bg-blueprint-900/20"
              : "border-ink-100 bg-paper dark:border-ink-800 dark:bg-ink-800/30"
          )}
        >
          {tier.highlighted && (
            <span className="label-mono mb-4 w-fit rounded-full bg-blueprint-500 px-2.5 py-1 text-white">
              Most popular
            </span>
          )}
          <h3 className="font-display text-lg font-medium">{tier.name}</h3>
          <p className="mt-1 text-sm text-ink-500 dark:text-ink-300">{tier.audience}</p>
          <div className="mt-5 flex items-baseline gap-1">
            <span className="font-display text-3xl font-medium">{tier.price}</span>
            {tier.period && <span className="text-sm text-ink-400">{tier.period}</span>}
          </div>
          <ul className="mt-6 flex flex-1 flex-col gap-2.5">
            {tier.features.map((f) => (
              <li key={f} className="flex items-start gap-2.5 text-sm text-ink-700 dark:text-ink-200">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-blueprint-500 dark:text-blueprint-300" />
                {f}
              </li>
            ))}
          </ul>
          {tier.amountInPaise ? (
            <div className="mt-7">
              <CheckoutButton kind="plan" id={tier.name} label={`${tier.name} plan`} highlighted={tier.highlighted} />
            </div>
          ) : (
            <Button
              href={tier.href}
              variant={tier.highlighted ? "primary" : "secondary"}
              className="mt-7 w-full"
            >
              {tier.cta}
            </Button>
          )}
        </div>
      ))}
    </div>
  );
}
