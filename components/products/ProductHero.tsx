import { Check } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import type { Product } from "@/lib/products";

const statusStyles: Record<string, string> = {
  Live: "text-blueprint-600 dark:text-blueprint-300",
  Beta: "text-stamp-500",
  "In Development": "text-ink-400",
};

export function ProductHero({ product }: { product: Product }) {
  return (
    <section className="grid-surface border-b border-ink-100 dark:border-ink-800">
      <Container className="py-16 md:py-20">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Products", href: "/products" },
            { label: product.name, href: `/products/${product.slug}` },
          ]}
        />

        <div className="mt-8 grid gap-10 lg:grid-cols-[1.3fr_0.7fr]">
          <div>
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs text-ink-400 dark:text-ink-500">{product.code}</span>
              <span className={`label-mono ${statusStyles[product.status]}`}>{product.status}</span>
            </div>
            <h1 className="mt-3 text-display-lg font-medium">{product.name}</h1>
            <p className="mt-5 max-w-xl text-lg text-ink-500 dark:text-ink-200">{product.description}</p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button href="/pricing" size="lg">
                {product.status === "Live" ? "Get started" : "Join the waitlist"}
              </Button>
              <Button href="/contact" variant="secondary" size="lg">
                Talk to us
              </Button>
            </div>
          </div>

          <div className="rounded-lg border border-ink-100 bg-paper p-6 dark:border-ink-800 dark:bg-ink-800/40">
            <p className="label-mono mb-4">What&apos;s included</p>
            <ul className="flex flex-col gap-3">
              {product.features.map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-sm text-ink-700 dark:text-ink-200">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-blueprint-500 dark:text-blueprint-300" />
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>
    </section>
  );
}
