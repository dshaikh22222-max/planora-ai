import { NextRequest } from "next/server";
import { z } from "zod";
import { requireAdminPermission, adminJson, adminError, withAdminErrorBoundary } from "@/lib/admin/auth/verify-admin";
import { PrismaClient } from "@prisma/client";
import { writeAuditLog, getIpFromRequest } from "@/lib/admin/auth/audit";

const prisma = new PrismaClient();

const CreateLayerSchema = z.object({
  name: z.string().min(1),
  code: z.string().min(1),
  category: z.string().min(1),
  type: z.enum(["VECTOR", "RASTER", "WMS", "WMTS", "TILE_3D"]),
  url: z.string().optional(),
  opacity: z.number().min(0).max(1).default(1.0),
  isPublic: z.boolean().default(true),
});

export const GET = withAdminErrorBoundary(async () => {
  await requireAdminPermission("settings:read");
  const layers = await prisma.gisLayer.findMany({
    orderBy: { createdAt: "desc" },
  });
  return adminJson({ layers });
});

export const POST = withAdminErrorBoundary(async (req: NextRequest) => {
  const session = await requireAdminPermission("settings:write");

  const body = await req.json();
  const parsed = CreateLayerSchema.safeParse(body);
  if (!parsed.success) {
    return adminError("VALIDATION_ERROR", "Invalid GIS layer payload", 400, parsed.error.flatten());
  }

  const { name, code, category, type, url, opacity, isPublic } = parsed.data;

  const existing = await prisma.gisLayer.findUnique({ where: { code } });
  if (existing) {
    return adminError("CODE_EXISTS", `GIS Layer with code ${code} already exists`, 409);
  }

  const layer = await prisma.gisLayer.create({
    data: {
      name,
      code,
      category,
      type,
      url,
      opacity,
      isPublic,
    },
  });

  await writeAuditLog({
    adminUserId: session.adminId,
    action: "gis.layer.created",
    ipAddress: getIpFromRequest(req) ?? "127.0.0.1",
  });

  return adminJson({ layer }, 201);
});
