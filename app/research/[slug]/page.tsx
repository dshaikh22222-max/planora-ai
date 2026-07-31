import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { researchPosts, getResearchBySlug } from "@/lib/research";
import { site } from "@/lib/site";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";

export function generateStaticParams() {
  return researchPosts.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const post = getResearchBySlug(params.slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/research/${post.slug}` },
  };
}

export default async function ResearchPostPage({ params }: { params: { slug: string } }) {
  const post = getResearchBySlug(params.slug);
  if (!post) notFound();

  let Content;
  try {
    Content = (await import(`@/content/research/${params.slug}.mdx`)).default;
  } catch {
    notFound();
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    author: { "@type": "Organization", name: site.name },
  };

  return (
    <Container className="py-16">
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Research", href: "/research" },
          { label: post.title, href: `/research/${post.slug}` },
        ]}
      />
      <article className="mx-auto mt-8 max-w-2xl">
        <span className="label-mono">{post.tag}</span>
        <h1 className="mt-3 text-display-lg font-medium">{post.title}</h1>
        <time className="mt-4 block font-mono text-xs text-ink-400 dark:text-ink-500" dateTime={post.date}>
          {new Date(post.date).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })}
        </time>
        <div className="prose mt-10 max-w-none dark:prose-invert prose-headings:font-display prose-a:text-blueprint-600 dark:prose-a:text-blueprint-300">
          <Content />
        </div>
      </article>
    </Container>
  );
}
