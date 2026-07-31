import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { blogPosts } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog",
  description: "Product updates, compliance notes, and engineering writing from the Planora AI team.",
  alternates: { canonical: "/blog" },
};

export default function BlogIndexPage() {
  return (
    <Container className="py-16">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Blog", href: "/blog" }]} />
      <h1 className="mt-6 text-display-lg font-medium">Blog</h1>
      <p className="mt-4 max-w-xl text-lg text-ink-500 dark:text-ink-200">
        Product updates, compliance notes, and engineering writing.
      </p>

      <div className="mt-14 grid gap-px overflow-hidden rounded-lg border border-ink-100 bg-ink-100 dark:border-ink-800 dark:bg-ink-800 md:grid-cols-2">
        {blogPosts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="group flex flex-col justify-between bg-paper p-6 transition-colors hover:bg-white dark:bg-ink-900 dark:hover:bg-ink-800"
          >
            <div>
              <div className="flex items-center gap-3 text-xs text-ink-400 dark:text-ink-500">
                <span className="label-mono">{post.category}</span>
                <span>{post.readTime}</span>
              </div>
              <h2 className="mt-3 font-display text-lg font-medium group-hover:text-blueprint-600 dark:group-hover:text-blueprint-300">
                {post.title}
              </h2>
              <p className="mt-2 text-sm text-ink-500 dark:text-ink-300">{post.excerpt}</p>
            </div>
            <time className="mt-6 font-mono text-xs text-ink-400 dark:text-ink-500" dateTime={post.date}>
              {new Date(post.date).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })}
            </time>
          </Link>
        ))}
      </div>
    </Container>
  );
}
