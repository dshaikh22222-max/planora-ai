export type Tier = {
  name: string;
  price: string;
  period?: string;
  audience: string;
  features: string[];
  cta: string;
  href: string;
  highlighted?: boolean;
  /** Present only on tiers with fixed recurring pricing that can be checked out directly. */
  amountInPaise?: number;
};

export const tiers: Tier[] = [
  {
    name: "Free",
    price: "₹0",
    audience: "For individuals exploring Planora AI",
    features: [
      "20 queries/month on Town Planning AI",
      "Community access",
      "Public templates library",
    ],
    cta: "Start free",
    href: "/contact",
  },
  {
    name: "Pro",
    price: "₹999",
    period: "/month",
    audience: "For planners, architects, and consultants",
    features: [
      "Unlimited Town Planning AI queries",
      "Layout Scrutiny AI (beta access)",
      "Premium templates & reports",
      "Priority email support",
    ],
    cta: "Start Pro",
    href: "/contact",
    highlighted: true,
    amountInPaise: 99900,
  },
  {
    name: "Developer",
    price: "₹4,999",
    period: "/month",
    audience: "For teams building on Planora AI",
    features: [
      "Full API access",
      "Higher rate limits",
      "Webhook support",
      "Sandbox + production keys",
    ],
    cta: "Get API access",
    href: "/docs/api",
    amountInPaise: 499900,
  },
  {
    name: "Enterprise",
    price: "Custom",
    audience: "For developers, builders, and large consulting firms",
    features: [
      "Dedicated onboarding",
      "SLA-backed support",
      "Custom data integrations",
      "Invoice billing, GST-ready",
    ],
    cta: "Talk to sales",
    href: "/contact",
  },
  {
    name: "Government",
    price: "Custom",
    audience: "For municipal and state planning authorities",
    features: [
      "On-premise / private-cloud deployment options",
      "Standardized scrutiny workflows",
      "Audit-ready citation trails",
      "Dedicated account management",
    ],
    cta: "Contact government desk",
    href: "/contact",
  },
];
