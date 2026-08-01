// ─────────────────────────────────────────────────────────────
// GIS Repository — Database Access & Spatial Query Layer
// ─────────────────────────────────────────────────────────────

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getGisLayers() {
  try {
    const layers = await prisma.gisLayer.findMany({
      where: { isVisible: true },
      orderBy: { createdAt: "asc" },
    });
    return layers;
  } catch (error) {
    console.error("[GIS Repo] Error fetching layers:", error);
    return [];
  }
}

export async function searchLandRecords(query: string) {
  try {
    const records = await prisma.landRecord.findMany({
      where: {
        OR: [
          { surveyNo: { contains: query, mode: "insensitive" } },
          { gatNo: { contains: query, mode: "insensitive" } },
          { ctsNo: { contains: query, mode: "insensitive" } },
          { ownerName: { contains: query, mode: "insensitive" } },
          { village: { contains: query, mode: "insensitive" } },
        ],
      },
      take: 20,
    });
    return records;
  } catch (error) {
    console.error("[GIS Repo] Error searching land records:", error);
    return [];
  }
}

export async function getGisEncroachments() {
  try {
    const encroachments = await prisma.gisEncroachment.findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
    });
    return encroachments;
  } catch (error) {
    console.error("[GIS Repo] Error fetching encroachments:", error);
    return [];
  }
}

export async function getGisSurveys() {
  try {
    const surveys = await prisma.gisSurvey.findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
    });
    return surveys;
  } catch (error) {
    console.error("[GIS Repo] Error fetching field surveys:", error);
    return [];
  }
}
