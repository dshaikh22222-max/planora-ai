export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  date: string; // ISO
  category: string;
  readTime: string;
};

export const blogPosts: BlogPost[] = [
  {
    slug: "why-town-planning-needs-ai",
    title: "Why Town Planning Needs AI, Not Just Automation",
    excerpt:
      "Automation speeds up paperwork. AI reads the paperwork. Here's why that distinction matters for India's planning system.",
    date: "2026-06-02",
    category: "Product",
    readTime: "6 min read",
  },
  {
    slug: "udcpr-common-mistakes",
    title: "Five UDCPR Compliance Mistakes We See Every Week",
    excerpt:
      "The most common setback, FSI, and premium calculation errors that get layout plans sent back — and how to catch them earlier.",
    date: "2026-05-14",
    category: "Compliance",
    readTime: "5 min read",
  },
  {
    slug: "building-citation-first-ai",
    title: "Building a Citation-First AI for Legal Documents",
    excerpt:
      "How Town Planning AI's retrieval pipeline decides what to cite, when to fall back to the LLM, and how it avoids hallucinated sections.",
    date: "2026-04-22",
    category: "Engineering",
    readTime: "8 min read",
  },
];

export function getPostBySlug(slug: string) {
  return blogPosts.find((p) => p.slug === slug);
}
