import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { projects } from "@/lib/projects";

export const metadata: Metadata = {
  title: "Projects",
  description: "Platform-scale projects and tools built alongside the Planora AI product line.",
  alternates: { canonical: "/projects" },
};

export default function ProjectsPage() {
  return (
    <Container className="py-16">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Projects", href: "/projects" }]} />
      <h1 className="mt-6 text-display-lg font-medium">Projects</h1>
      <p className="mt-4 max-w-xl text-lg text-ink-500 dark:text-ink-200">
        Platform-scale tools and initiatives, built alongside the product line.
      </p>

      <div className="mt-14 flex flex-col divide-y divide-ink-100 border-y border-ink-100 dark:divide-ink-800 dark:border-ink-800">
        {projects.map((project) => (
          <div key={project.name} className="flex flex-wrap items-start justify-between gap-6 py-8">
            <div className="max-w-xl">
              <h2 className="font-display text-lg font-medium">{project.name}</h2>
              <p className="mt-2 text-sm text-ink-500 dark:text-ink-300">{project.description}</p>
            </div>
            <span className="font-mono text-xs text-ink-400 dark:text-ink-500">{project.stack}</span>
          </div>
        ))}
      </div>
    </Container>
  );
}
