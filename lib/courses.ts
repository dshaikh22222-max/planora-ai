export type Course = {
  slug: string;
  title: string;
  description: string;
  duration: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  priceInPaise: number;
};

export const courses: Course[] = [
  {
    slug: "udcpr-fundamentals",
    title: "UDCPR Fundamentals for Practicing Architects",
    description: "A practical walkthrough of setbacks, FSI, and premium calculations under UDCPR, with worked examples.",
    duration: "3.5 hours",
    level: "Beginner",
    priceInPaise: 149900,
  },
  {
    slug: "building-permission-workflow",
    title: "Navigating the Building Permission Workflow",
    description: "End-to-end walkthrough of documentation, common rejection reasons, and how to structure a clean submission.",
    duration: "2.5 hours",
    level: "Intermediate",
    priceInPaise: 99900,
  },
  {
    slug: "reading-development-plans",
    title: "Reading Municipal Development Plans Like a Planner",
    description: "How to interpret zoning classifications and cross-reference a development plan against a proposed project.",
    duration: "4 hours",
    level: "Advanced",
    priceInPaise: 199900,
  },
];

export function getCourseBySlug(slug: string) {
  return courses.find((c) => c.slug === slug);
}
