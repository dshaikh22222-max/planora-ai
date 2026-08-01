"use client";

import { useState, useTransition, useRef, useCallback } from "react";
import { Upload, Image as ImageIcon, FileText, Film, Music, File, X, Copy, Check, Search, Loader2 } from "lucide-react";
import { formatFileSize, getMimeCategory } from "@/lib/admin/utils/format";

interface MediaFileItem {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  width?: number;
  height?: number;
  altText?: string;
  createdAt: string;
}

interface MediaLibraryProps {
  initialFiles?: MediaFileItem[];
  totalFiles?: number;
}

export function MediaLibraryClient({ initialFiles = [], totalFiles = 0 }: MediaLibraryProps) {
  const [files, setFiles] = useState<MediaFileItem[]>(initialFiles);
  const [total, setTotal] = useState(totalFiles);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "image" | "document" | "video">("all");
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selected, setSelected] = useState<MediaFileItem | null>(null);
  const [copied, setCopied] = useState(false);
  const [isLoadingMore, startLoadMore] = useTransition();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filtered = files.filter((f) => {
    const matchSearch = f.originalName.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || getMimeCategory(f.mimeType) === filter;
    return matchSearch && matchFilter;
  });

  async function uploadFiles(filesToUpload: File[]) {
    setUploading(true);
    try {
      const results = await Promise.all(
        filesToUpload.map(async (file) => {
          const fd = new FormData();
          fd.append("file", file);
          const res = await fetch("/api/admin/media", { method: "POST", body: fd });
          if (!res.ok) throw new Error(`Upload failed: ${file.name}`);
          return res.json() as Promise<MediaFileItem>;
        })
      );
      setFiles((prev) => [...results.reverse(), ...prev]);
      setTotal((t) => t + results.length);
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  }

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const dropped = Array.from(e.dataTransfer.files);
    if (dropped.length > 0) uploadFiles(dropped);
  }, []);

  function copyUrl(url: string) {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const FileIcon = ({ mimeType }: { mimeType: string }) => {
    const cat = getMimeCategory(mimeType);
    const props = { size: 24, className: "text-ink-600" };
    if (cat === "image") return <ImageIcon {...props} className="text-blueprint-600" />;
    if (cat === "video") return <Film {...props} className="text-violet-600" />;
    if (cat === "audio") return <Music {...props} className="text-emerald-600" />;
    if (cat === "document") return <FileText {...props} className="text-amber-600" />;
    return <File {...props} />;
  };

  return (
    <div className="flex gap-6">
      {/* Main area */}
      <div className="flex-1 space-y-5">
        {/* Upload zone */}
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={onDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`group cursor-pointer rounded-2xl border-2 border-dashed p-8 text-center transition ${
            isDragging
              ? "border-blueprint-500 bg-blueprint-600/10"
              : "border-white/10 hover:border-white/20 hover:bg-white/2"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*,application/pdf,.apk,.zip,.txt"
            className="hidden"
            onChange={(e) => {
              const picked = Array.from(e.target.files ?? []);
              if (picked.length > 0) uploadFiles(picked);
            }}
          />
          <div className="flex flex-col items-center gap-2">
            {uploading ? (
              <Loader2 size={28} className="animate-spin text-blueprint-400" />
            ) : (
              <Upload size={28} className="text-ink-600 group-hover:text-blueprint-400 transition" />
            )}
            <p className="text-sm font-medium text-white">
              {uploading ? "Uploading…" : "Drop files or click to upload"}
            </p>
            <p className="text-xs text-ink-600">Images, PDFs, APKs, ZIPs — max 500 MB</p>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-xs">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-600" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search files…"
              className="h-9 w-full rounded-lg border border-white/10 bg-white/5 pl-9 pr-3 text-sm text-white placeholder-ink-600 outline-none transition focus:border-blueprint-500"
            />
          </div>
          <div className="flex gap-1">
            {(["all", "image", "document", "video"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition ${
                  filter === f
                    ? "border-blueprint-500 bg-blueprint-600/20 text-blueprint-300"
                    : "border-white/10 bg-white/5 text-ink-400 hover:text-white"
                }`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
          <span className="ml-auto text-xs text-ink-600">{total} files</span>
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="flex h-48 items-center justify-center rounded-xl border border-white/5 bg-ink-900">
            <p className="text-sm text-ink-600">No files found</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5">
            {filtered.map((file) => {
              const isImage = getMimeCategory(file.mimeType) === "image";
              const isSelected = selected?.id === file.id;
              return (
                <button
                  key={file.id}
                  onClick={() => setSelected(isSelected ? null : file)}
                  className={`group relative overflow-hidden rounded-xl border text-left transition ${
                    isSelected
                      ? "border-blueprint-500 bg-blueprint-600/10"
                      : "border-white/5 bg-ink-900 hover:border-white/15"
                  }`}
                >
                  {isImage ? (
                    <img src={file.url} alt={file.altText ?? file.originalName} className="aspect-square w-full object-cover" />
                  ) : (
                    <div className="flex aspect-square items-center justify-center bg-white/3">
                      <FileIcon mimeType={file.mimeType} />
                    </div>
                  )}
                  <div className="p-2">
                    <p className="truncate text-[11px] font-medium text-ink-300">{file.originalName}</p>
                    <p className="text-[10px] text-ink-700">{formatFileSize(file.size)}</p>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Detail panel */}
      {selected && (
        <div className="w-64 shrink-0 space-y-4">
          <div className="rounded-xl border border-white/5 bg-ink-900 overflow-hidden">
            {getMimeCategory(selected.mimeType) === "image" ? (
              <img src={selected.url} alt="" className="w-full object-cover" />
            ) : (
              <div className="flex h-32 items-center justify-center bg-white/3">
                <FileText size={40} className="text-ink-600" />
              </div>
            )}
            <div className="p-4 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm font-medium text-white break-all">{selected.originalName}</p>
                <button onClick={() => setSelected(null)} className="shrink-0 text-ink-600 hover:text-white transition">
                  <X size={14} />
                </button>
              </div>
              <dl className="space-y-1 text-xs text-ink-500">
                <div className="flex justify-between">
                  <dt>Size</dt><dd className="text-ink-300">{formatFileSize(selected.size)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt>Type</dt><dd className="text-ink-300">{selected.mimeType}</dd>
                </div>
                {selected.width && (
                  <div className="flex justify-between">
                    <dt>Dimensions</dt><dd className="text-ink-300">{selected.width} × {selected.height}</dd>
                  </div>
                )}
              </dl>

              <button
                onClick={() => copyUrl(selected.url)}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-blueprint-600/20 px-3 py-2 text-xs font-medium text-blueprint-300 transition hover:bg-blueprint-600/30"
              >
                {copied ? <Check size={12} /> : <Copy size={12} />}
                {copied ? "Copied!" : "Copy URL"}
              </button>

              <div className="rounded-lg bg-white/5 px-2 py-1.5">
                <p className="break-all font-mono text-[10px] text-ink-600">{selected.url}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
