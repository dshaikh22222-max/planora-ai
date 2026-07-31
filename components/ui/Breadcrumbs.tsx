import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { site } from "@/lib/site";

export type Crumb = { label: string; href: string };

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.label,
      item: `${site.url}${item.href}`,
    })),
  };

  return (
    <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-sm text-ink-500 dark:text-ink-400">
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {items.map((item, i) => (
        <span key={item.href} className="flex items-center gap-1.5">
          {i > 0 && <ChevronRight className="h-3.5 w-3.5" />}
          {i === items.length - 1 ? (
            <span className="text-ink-700 dark:text-ink-200">{item.label}</span>
          ) : (
            <Link href={item.href} className="hover:text-ink-900 dark:hover:text-white">
              {item.label}
            </Link>
          )}
        </span>
      ))}
    </nav>
  );
}
