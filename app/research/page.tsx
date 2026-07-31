import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { researchPosts } from "@/lib/research";

export const metadata: Metadata = {
  title: "Research",
  description: "Benchmarks and policy analysis behind the Planora AI product line.",
  alternates: { canonical: "/research" },
};

export default function ResearchIndexPage() {
  return (
    <Container className="py-16">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Research", href: "/research" }]} />
      <h1 className="mt-6 text-display-lg font-medium">Research</h1>
      <p className="mt-4 max-w-xl text-lg text-ink-500 dark:text-ink-200">
        Benchmarks and policy analysis behind the product line.
      </p>

      <div className="mt-14 flex flex-col divide-y divide-ink-100 border-y border-ink-100 dark:divide-ink-800 dark:border-ink-800">
        {researchPosts.map((post) => (
          <Link key={post.slug} href={`/research/${post.slug}`} className="group flex items-start justify-between gap-6 py-7">
            <div>
              <span className="label-mono">{post.tag}</span>
              <h2 className="mt-2 font-display text-lg font-medium group-hover:text-blueprint-600 dark:group-hover:text-blueprint-300">
                {post.title}
              </h2>
              <p className="mt-2 max-w-xl text-sm text-ink-500 dark:text-ink-300">{post.excerpt}</p>
            </div>
            <time className="shrink-0 font-mono text-xs text-ink-400 dark:text-ink-500" dateTime={post.date}>
              {new Date(post.date).toLocaleDateString("en-IN", { year: "numeric", month: "short" })}
            </time>
          </Link>
        ))}
      </div>
    </Container>
  );
}
