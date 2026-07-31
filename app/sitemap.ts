import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { products } from "@/lib/products";
import { blogPosts } from "@/lib/blog";
import { researchPosts } from "@/lib/research";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "",
    "/products",
    "/apps",
    "/projects",
    "/blog",
    "/research",
    "/docs",
    "/docs/api",
    "/pricing",
    "/marketplace",
    "/templates",
    "/courses",
    "/consulting",
    "/community",
    "/careers",
    "/about",
    "/contact",
    "/privacy",
    "/terms",
  ];

  const productRoutes = products.map((p) => `/products/${p.slug}`);
  const blogRoutes = blogPosts.map((p) => `/blog/${p.slug}`);
  const researchRoutes = researchPosts.map((p) => `/research/${p.slug}`);

  // NOTE: marketplace items and courses are purchased directly from their
  // index pages (no individual detail-page routes yet), so they aren't
  // listed here — add them once /marketplace/[slug] and /courses/[slug]
  // pages exist.
  return [...staticRoutes, ...productRoutes, ...blogRoutes, ...researchRoutes].map((route) => ({
    url: `${site.url}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "daily" : "weekly",
    priority: route === "" ? 1 : 0.7,
  }));
}
