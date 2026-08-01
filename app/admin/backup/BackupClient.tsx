"use client";

import { useState, useTransition } from "react";
import { Database, Download, Shield, Loader2, FileJson } from "lucide-react";
import { StatsCard } from "@/components/admin/ui/StatsCard";
import { formatDate } from "@/lib/admin/utils/format";

interface TableStat {
  table: string;
  count: number;
}

interface AuditLogItem {
  id: string;
  action: string;
  adminUser: { name: string; email: string; role: string };
  createdAt: string;
  ipAddress: string | null;
}

export default function BackupClient({
  initialTables,
  recentLogs,
}: {
  initialTables: TableStat[];
  recentLogs: AuditLogItem[];
}) {
  const [isExporting, startExport] = useTransition();

  const totalRecords = initialTables.reduce((acc, t) => acc + t.count, 0);

  async function handleTriggerExport() {
    startExport(async () => {
      const res = await fetch("/api/admin/backup", { method: "POST" });
      if (!res.ok) {
        alert("Export failed");
        return;
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `planora-database-backup-${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
    });
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Backup & Database Health</h1>
          <p className="text-sm text-ink-500">Database table row stats, snapshot backups, and system audit trail</p>
        </div>
        <button
          onClick={handleTriggerExport}
          disabled={isExporting}
          className="flex items-center gap-2 rounded-xl bg-blueprint-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blueprint-900/40 transition hover:bg-blueprint-500 disabled:opacity-50"
        >
          {isExporting ? <Loader2 size={15} className="animate-spin" /> : <Download size={15} />}
          Export JSON Snapshot
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-3">
        <StatsCard title="Total DB Records" value={totalRecords.toLocaleString("en-IN")} icon={<Database size={16} />} accent="blueprint" />
        <StatsCard title="Active Tables" value={initialTables.length} icon={<FileJson size={16} />} accent="emerald" />
        <StatsCard title="Audit Logs" value={(initialTables.find((t) => t.table === "AdminAuditLog")?.count ?? 0).toLocaleString("en-IN")} icon={<Shield size={16} />} accent="violet" />
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Table counts grid — 1 col */}
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-white">Database Tables Summary</h2>
          <div className="overflow-hidden rounded-xl border border-white/5 bg-ink-900">
            <div className="divide-y divide-white/5 text-sm">
              {initialTables.map((t) => (
                <div key={t.table} className="flex items-center justify-between px-4 py-3">
                  <span className="font-mono text-xs text-white">{t.table}</span>
                  <span className="font-mono text-xs font-semibold text-blueprint-400">
                    {t.count.toLocaleString("en-IN")} rows
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Audit Log Activity — 2 cols */}
        <div className="col-span-2 space-y-3">
          <h2 className="text-sm font-semibold text-white">Recent System Audit Trail</h2>
          <div className="overflow-hidden rounded-xl border border-white/5 bg-ink-900">
            <div className="divide-y divide-white/5 text-xs">
              {recentLogs.length === 0 ? (
                <p className="px-4 py-8 text-center text-ink-600">No audit log records found.</p>
              ) : (
                recentLogs.map((log) => (
                  <div key={log.id} className="flex items-center justify-between px-4 py-3 hover:bg-white/[0.02]">
                    <div>
                      <span className="font-mono font-medium text-blueprint-300">{log.action}</span>
                      <p className="text-[11px] text-ink-500">
                        {log.adminUser?.name ?? "System"} ({log.adminUser?.role}) · IP: {log.ipAddress ?? "local"}
                      </p>
                    </div>
                    <span className="text-ink-600 font-mono text-[11px]">
                      {formatDate(log.createdAt)}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
