import type { Metadata } from "next";
import { getDatabaseTableStats, listAuditLogs } from "@/lib/admin/repositories/audit.repository";
import BackupClient from "./BackupClient";

export const metadata: Metadata = { title: "Backup & Restore" };

export default async function BackupPage() {
  const [tables, auditLogsResult] = await Promise.all([
    getDatabaseTableStats(),
    listAuditLogs({ pageSize: 15 }),
  ]);

  return <BackupClient initialTables={tables} recentLogs={auditLogsResult.items as never} />;
}
