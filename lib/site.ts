export const site = {
  name: "Planora AI",
  tagline: "Building the Future of Town Planning with AI",
  description:
    "Planora AI builds AI-powered town planning, building permission, and land-development tools for India — from layout scrutiny to UDCPR and MRTP compliance, backed by section-level citations.",
  url: "https://planora.ai",
  twitter: "@planoraai",
  locale: "en_IN",
};

export const primaryNav = [
  { label: "Products", href: "/products" },
  { label: "Town Planning AI", href: "/products/town-planning-ai" },
  { label: "GIS Portal", href: "/gis" },
  { label: "Apps", href: "/apps" },
  { label: "Projects", href: "/projects" },
  { label: "Blog", href: "/blog" },
  { label: "Research", href: "/research" },
  { label: "Docs", href: "/docs" },
  { label: "Pricing", href: "/pricing" },
] as const;

export const footerNav = {
  Product: [
    { label: "Products", href: "/products" },
    { label: "Marketplace", href: "/marketplace" },
    { label: "Templates", href: "/templates" },
    { label: "Pricing", href: "/pricing" },
    { label: "API Access", href: "/docs/api" },
  ],
  Learn: [
    { label: "Blog", href: "/blog" },
    { label: "Research", href: "/research" },
    { label: "Documentation", href: "/docs" },
    { label: "Courses", href: "/courses" },
  ],
  Company: [
    { label: "About", href: "/about" },
    { label: "Careers", href: "/careers" },
    { label: "Consulting", href: "/consulting" },
    { label: "Community", href: "/community" },
    { label: "Contact", href: "/contact" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms", href: "/terms" },
  ],
} as const;
