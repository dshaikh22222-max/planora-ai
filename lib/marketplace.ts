export type MarketplaceItem = {
  slug: string;
  name: string;
  category: "Template" | "Report" | "Dataset";
  description: string;
  priceInPaise: number;
};

export const marketplaceItems: MarketplaceItem[] = [
  {
    slug: "layout-scrutiny-checklist",
    name: "Layout Scrutiny Checklist (UDCPR)",
    category: "Template",
    description: "A structured, editable checklist covering every UDCPR clause a layout plan is commonly scrutinized against.",
    priceInPaise: 29900,
  },
  {
    slug: "building-permission-document-kit",
    name: "Building Permission Document Kit",
    category: "Template",
    description: "Ready-to-fill templates for the full building-permission document set, organized by submission stage.",
    priceInPaise: 39900,
  },
  {
    slug: "mrtp-clause-reference-report",
    name: "MRTP Act Clause Reference Report",
    category: "Report",
    description: "A structured, section-indexed summary of the Maharashtra Regional and Town Planning Act for quick reference.",
    priceInPaise: 49900,
  },
  {
    slug: "state-fsi-comparison-dataset",
    name: "Cross-State FSI Comparison Dataset",
    category: "Dataset",
    description: "A structured dataset comparing FSI, setback, and open-space rules across a sample of Indian states.",
    priceInPaise: 59900,
  },
];

export function getMarketplaceItemBySlug(slug: string) {
  return marketplaceItems.find((i) => i.slug === slug);
}
