import type { Metadata } from "next";
import { listMediaFiles, getMediaStats } from "@/lib/admin/repositories/media.repository";
import { MediaLibraryClient } from "@/components/admin/media/MediaLibraryClient";
import { StatsCard } from "@/components/admin/ui/StatsCard";
import { formatFileSize } from "@/lib/admin/utils/format";
import { Image as ImageIcon, HardDrive } from "lucide-react";

export const metadata: Metadata = { title: "Media Library" };

export default async function MediaPage() {
  const [{ items, total }, stats] = await Promise.all([
    listMediaFiles({ pageSize: 100 }),
    getMediaStats(),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Media Library</h1>
          <p className="text-sm text-ink-500">All uploaded files stored on Vercel Blob</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <StatsCard title="Total Files" value={stats.count.toLocaleString("en-IN")} icon={<ImageIcon size={16} />} accent="blueprint" />
        <StatsCard title="Total Storage" value={formatFileSize(stats.totalSize)} icon={<HardDrive size={16} />} accent="emerald" />
      </div>

      <MediaLibraryClient initialFiles={items as never} totalFiles={total} />
    </div>
  );
}
