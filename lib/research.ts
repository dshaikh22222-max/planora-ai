export type ResearchPost = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  tag: string;
};

export const researchPosts: ResearchPost[] = [
  {
    slug: "retrieval-accuracy-benchmark",
    title: "Benchmarking Retrieval Accuracy Across Indian Planning Statutes",
    excerpt:
      "An internal benchmark measuring section-level retrieval accuracy across MRTP, UDCPR, and RERA, and where retrieval alone isn't enough.",
    date: "2026-05-30",
    tag: "Benchmark",
  },
  {
    slug: "state-regulation-variance",
    title: "How Much Do Setback Rules Actually Vary Across States?",
    excerpt:
      "A structural comparison of setback, FSI, and open-space requirements across a sample of Indian states, and what it means for a cross-state rule engine.",
    date: "2026-03-11",
    tag: "Policy Analysis",
  },
];

export function getResearchBySlug(slug: string) {
  return researchPosts.find((p) => p.slug === slug);
}
