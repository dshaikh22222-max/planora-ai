import { prisma } from "@/lib/prisma";

export async function listSeoMetadata() {
  return prisma.seoMetadata.findMany({
    orderBy: { path: "asc" },
  });
}

export async function getSeoMetadataByPath(path: string) {
  return prisma.seoMetadata.findUnique({
    where: { path },
  });
}

export async function upsertSeoMetadata(
  path: string,
  data: {
    title: string;
    description: string;
    keywords?: string[];
    ogImage?: string;
    canonical?: string;
    noIndex?: boolean;
    updatedBy?: string;
  }
): Promise<void> {
  await prisma.seoMetadata.upsert({
    where: { path },
    create: {
      path,
      title: data.title,
      description: data.description,
      keywords: data.keywords ?? [],
      ogImage: data.ogImage,
      canonical: data.canonical,
      noIndex: data.noIndex ?? false,
      updatedBy: data.updatedBy,
    },
    update: {
      title: data.title,
      description: data.description,
      keywords: data.keywords ?? [],
      ogImage: data.ogImage,
      canonical: data.canonical,
      noIndex: data.noIndex ?? false,
      updatedBy: data.updatedBy,
    },
  });
}

export async function deleteSeoMetadata(path: string): Promise<void> {
  await prisma.seoMetadata.delete({ where: { path } });
}

export async function getSitemapStats() {
  const [productsCount, blogPostsCount, customSeoCount] = await Promise.all([
    prisma.product.count({ where: { status: "PUBLISHED" } }),
    prisma.blogPost.count({ where: { status: "PUBLISHED" } }),
    prisma.seoMetadata.count({ where: { noIndex: false } }),
  ]);

  return {
    totalIndexablePages: productsCount + blogPostsCount + customSeoCount + 8, // + static routes (home, pricing, etc.)
    publishedProducts: productsCount,
    publishedBlogPosts: blogPostsCount,
    customSeoOverrides: customSeoCount,
  };
}
