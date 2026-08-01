import type { Metadata } from "next";
import { listSeoMetadata, getSitemapStats } from "@/lib/admin/repositories/seo.repository";
import SeoClient from "./SeoClient";

export const metadata: Metadata = { title: "SEO Management" };

export default async function SeoPage() {
  const [items, stats] = await Promise.all([
    listSeoMetadata(),
    getSitemapStats(),
  ]);

  return <SeoClient initialItems={items as never} stats={stats} />;
}
