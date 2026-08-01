import { prisma } from "@/lib/prisma";

// ── Queries ────────────────────────────────────────────────────

export async function listMediaFiles(filters?: {
  folder?: string;
  mimeType?: string;
  search?: string;
  page?: number;
  pageSize?: number;
}) {
  const page = filters?.page ?? 1;
  const pageSize = filters?.pageSize ?? 50;
  const skip = (page - 1) * pageSize;

  const where = {
    ...(filters?.folder ? { folder: filters.folder } : {}),
    ...(filters?.mimeType
      ? { mimeType: { startsWith: filters.mimeType } }
      : {}),
    ...(filters?.search
      ? { originalName: { contains: filters.search, mode: "insensitive" as const } }
      : {}),
  };

  const [items, total] = await Promise.all([
    prisma.mediaFile.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: pageSize,
    }),
    prisma.mediaFile.count({ where }),
  ]);

  return { items, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
}

export async function getMediaFileById(id: string) {
  return prisma.mediaFile.findUnique({ where: { id } });
}

// ── Mutations ──────────────────────────────────────────────────

export async function createMediaFile(data: {
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  width?: number;
  height?: number;
  altText?: string;
  folder?: string;
  uploadedBy: string;
}) {
  return prisma.mediaFile.create({ data });
}

export async function updateMediaFile(
  id: string,
  data: Partial<{ altText: string; folder: string }>
): Promise<void> {
  await prisma.mediaFile.update({ where: { id }, data });
}

export async function deleteMediaFile(id: string): Promise<void> {
  await prisma.mediaFile.delete({ where: { id } });
}

export async function getMediaStats() {
  const result = await prisma.mediaFile.aggregate({ _sum: { size: true }, _count: true });
  return { count: result._count, totalSize: result._sum.size ?? 0 };
}
