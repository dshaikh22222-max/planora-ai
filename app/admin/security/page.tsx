import type { Metadata } from "next";
import { listAuditLogs } from "@/lib/admin/repositories/audit.repository";
import { listAdminUsers } from "@/lib/admin/repositories/admin-user.repository";
import SecurityClient from "./SecurityClient";

export const metadata: Metadata = { title: "Security & Audit" };

export default async function SecurityPage() {
  const [auditLogsResult, adminUsers] = await Promise.all([
    listAuditLogs({ pageSize: 40 }),
    listAdminUsers(),
  ]);

  return (
    <SecurityClient
      initialLogs={auditLogsResult.items as never}
      adminUsers={adminUsers as never}
    />
  );
}
