import { NextRequest } from "next/server";
import { put } from "@vercel/blob";
import { requireAdminPermission, adminJson, adminError, withAdminErrorBoundary } from "@/lib/admin/auth/verify-admin";
import { createMediaFile, listMediaFiles, getMediaStats } from "@/lib/admin/repositories/media.repository";
import { writeAuditLog, getIpFromRequest } from "@/lib/admin/auth/audit";

// ── GET /api/admin/media — List media files ────────────────────
export const GET = withAdminErrorBoundary(async (req: NextRequest) => {
  await requireAdminPermission("media:read");

  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search") ?? undefined;
  const mimeType = searchParams.get("type") ?? undefined;
  const folder = searchParams.get("folder") ?? undefined;
  const page = parseInt(searchParams.get("page") ?? "1", 10);

  const [result, stats] = await Promise.all([
    listMediaFiles({ search, mimeType, folder, page }),
    getMediaStats(),
  ]);

  return adminJson({ ...result, stats });
});

// ── POST /api/admin/media/upload — Upload file to Vercel Blob ──
// (This route handles both the form and JSON responses)
export const POST = withAdminErrorBoundary(async (req: NextRequest) => {
  const session = await requireAdminPermission("media:write");

  const formData = await req.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return adminError("BAD_REQUEST", "No file provided", 400);
  }

  // Validate file size (50 MB max for images, 500 MB for others)
  const maxSize = file.type.startsWith("image/") ? 50 * 1024 * 1024 : 500 * 1024 * 1024;
  if (file.size > maxSize) {
    return adminError("FILE_TOO_LARGE", `File exceeds maximum size`, 413);
  }

  // Generate unique filename
  const ext = file.name.split(".").pop() ?? "bin";
  const filename = `admin/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  // Upload to Vercel Blob
  const blob = await put(filename, file, {
    access: "public",
    contentType: file.type,
  });

  // Save to DB
  const mediaFile = await createMediaFile({
    filename,
    originalName: file.name,
    mimeType: file.type,
    size: file.size,
    url: blob.url,
    uploadedBy: session.adminId,
  });

  await writeAuditLog({
    adminUserId: session.adminId,
    action: "media.upload",
    entityType: "MediaFile",
    entityId: mediaFile.id,
    after: { filename: file.name, mimeType: file.type, size: file.size },
    ipAddress: getIpFromRequest(req),
  });

  return adminJson(mediaFile, 201);
});
