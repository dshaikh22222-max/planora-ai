import { prisma } from "@/lib/prisma";
import type { ContentStatus } from "@prisma/client";

// ── Settings (key-value store) ─────────────────────────────────

export async function getAllSettings() {
  return prisma.siteSettings.findMany({ orderBy: [{ group: "asc" }, { key: "asc" }] });
}

export async function getSettingsByGroup(group: string) {
  return prisma.siteSettings.findMany({ where: { group }, orderBy: { key: "asc" } });
}

export async function getSettingValue(key: string): Promise<string | null> {
  const s = await prisma.siteSettings.findUnique({ where: { key }, select: { value: true } });
  return s?.value ?? null;
}

export async function upsertSetting(
  key: string,
  value: string,
  options?: { type?: string; group?: string; label?: string; updatedBy?: string }
): Promise<void> {
  await prisma.siteSettings.upsert({
    where: { key },
    create: { key, value, type: options?.type ?? "text", group: options?.group ?? "general", label: options?.label, updatedBy: options?.updatedBy },
    update: { value, updatedBy: options?.updatedBy, ...(options?.label ? { label: options.label } : {}) },
  });
}

export async function bulkUpsertSettings(
  entries: { key: string; value: string }[],
  updatedBy: string
): Promise<void> {
  await Promise.all(
    entries.map(({ key, value }) =>
      prisma.siteSettings.upsert({
        where: { key },
        create: { key, value, updatedBy },
        update: { value, updatedBy },
      })
    )
  );
}

// ── CMS Pages ──────────────────────────────────────────────────

export async function listCmsPages() {
  return prisma.cmsPage.findMany({
    select: { id: true, slug: true, title: true, status: true, updatedAt: true },
    orderBy: { updatedAt: "desc" },
  });
}

export async function getCmsPageBySlug(slug: string) {
  return prisma.cmsPage.findUnique({ where: { slug } });
}

export async function upsertCmsPage(
  slug: string,
  data: { title: string; sections: object; status?: ContentStatus; seoTitle?: string; seoDesc?: string; updatedBy?: string }
): Promise<void> {
  await prisma.cmsPage.upsert({
    where: { slug },
    create: { slug, ...data, sections: data.sections as import("@prisma/client").Prisma.JsonArray },
    update: { ...data, sections: data.sections as import("@prisma/client").Prisma.JsonArray },
  });
}
