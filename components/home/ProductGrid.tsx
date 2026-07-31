import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { products } from "@/lib/products";
import { Section } from "@/components/ui/Section";

const statusStyles: Record<string, string> = {
  Live: "text-blueprint-600 dark:text-blueprint-300",
  Beta: "text-stamp-500",
  "In Development": "text-ink-400 dark:text-ink-400",
};

export function ProductGrid() {
  return (
    <Section
      eyebrow="Product Line"
      title="One platform, nine specialists."
      description="Every Planora AI product is scoped to a single part of the planning workflow — trained, cited, and versioned independently."
    >
      <div className="grid gap-px overflow-hidden rounded-lg border border-ink-100 bg-ink-100 dark:border-ink-800 dark:bg-ink-800 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <Link
            key={product.slug}
            href={`/products/${product.slug}`}
            className="group relative flex flex-col justify-between bg-paper p-6 transition-colors hover:bg-white dark:bg-ink-900 dark:hover:bg-ink-800"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-ink-400 dark:text-ink-500">{product.code}</span>
                <ArrowUpRight className="h-4 w-4 text-ink-300 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-ink-900 dark:text-ink-600 dark:group-hover:text-white" />
              </div>
              <h3 className="mt-3 font-display text-lg font-medium">{product.name}</h3>
              <p className="mt-2 text-sm text-ink-500 dark:text-ink-300">{product.summary}</p>
            </div>
            <span className={`label-mono mt-6 ${statusStyles[product.status]}`}>{product.status}</span>
          </Link>
        ))}
      </div>
    </Section>
  );
}
