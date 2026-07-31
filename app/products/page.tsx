import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { ProductGrid } from "@/components/home/ProductGrid";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Products",
  description:
    "Nine AI products covering every stage of the Indian town planning workflow — from layout scrutiny to building permissions to cross-state rule search.",
  alternates: { canonical: "/products" },
};

export default function ProductsPage() {
  return (
    <>
      <section className="border-b border-ink-100 dark:border-ink-800">
        <Container className="py-14">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Products", href: "/products" }]} />
          <h1 className="mt-6 text-display-lg font-medium">Products</h1>
          <p className="mt-4 max-w-xl text-lg text-ink-500 dark:text-ink-200">
            {site.tagline}. Nine specialists, one platform — each scoped to a single part of the
            planning workflow.
          </p>
        </Container>
      </section>
      <ProductGrid />
    </>
  );
}
