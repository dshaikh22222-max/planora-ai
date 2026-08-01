"use client";

import { useState } from "react";
import { Shield, Key, Search, UserCheck, AlertOctagon } from "lucide-react";
import { formatDate } from "@/lib/admin/utils/format";
import { StatusBadge } from "@/components/admin/ui/StatusBadge";

interface AuditLog {
  id: string;
  action: string;
  entityType: string | null;
  entityId: string | null;
  createdAt: string;
  ipAddress: string | null;
  adminUser: {
    name: string;
    email: string;
    role: string;
  };
}

interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: string;
  isActive: boolean;
  totpEnabled: boolean;
  lastLoginAt: string | null;
  createdAt: string;
}

export default function SecurityClient({
  initialLogs,
  adminUsers,
}: {
  initialLogs: AuditLog[];
  adminUsers: AdminUser[];
}) {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("ALL");

  const filteredLogs = initialLogs.filter((log) => {
    const matchSearch =
      log.action.toLowerCase().includes(search.toLowerCase()) ||
      log.adminUser?.name.toLowerCase().includes(search.toLowerCase()) ||
      log.adminUser?.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === "ALL" || log.adminUser?.role === roleFilter;
    return matchSearch && matchRole;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Security & Audit Logs</h1>
          <p className="text-sm text-ink-500">Immutable audit records, session security, and access logs</p>
        </div>
      </div>

      {/* Security Overview Cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-xl border border-white/5 bg-ink-900 p-5 space-y-2">
          <div className="flex items-center gap-2 text-blueprint-400">
            <UserCheck size={16} />
            <span className="text-xs font-semibold uppercase tracking-widest text-ink-500">Admin Accounts</span>
          </div>
          <p className="text-2xl font-bold text-white">{adminUsers.length}</p>
          <p className="text-xs text-ink-500">Active console administrators</p>
        </div>

        <div className="rounded-xl border border-white/5 bg-ink-900 p-5 space-y-2">
          <div className="flex items-center gap-2 text-emerald-400">
            <Key size={16} />
            <span className="text-xs font-semibold uppercase tracking-widest text-ink-500">Authentication Policy</span>
          </div>
          <p className="text-2xl font-bold text-white">HMAC + DB</p>
          <p className="text-xs text-ink-500">8-hour token TTL with revocation check</p>
        </div>

        <div className="rounded-xl border border-white/5 bg-ink-900 p-5 space-y-2">
          <div className="flex items-center gap-2 text-amber-400">
            <AlertOctagon size={16} />
            <span className="text-xs font-semibold uppercase tracking-widest text-ink-500">Brute Force Protection</span>
          </div>
          <p className="text-2xl font-bold text-white">5 Attempts</p>
          <p className="text-xs text-ink-500">Auto 15-minute account lockout</p>
        </div>
      </div>

      {/* Filter toolbar */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-600" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search action or user email…"
            className="h-9 w-full rounded-lg border border-white/10 bg-white/5 pl-9 pr-3 text-sm text-white placeholder-ink-600 outline-none transition focus:border-blueprint-500"
          />
        </div>

        <div className="flex gap-1">
          {["ALL", "SUPER_ADMIN", "ADMIN", "EDITOR"].map((role) => (
            <button
              key={role}
              onClick={() => setRoleFilter(role)}
              className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition ${
                roleFilter === role
                  ? "border-blueprint-500 bg-blueprint-600/20 text-blueprint-300"
                  : "border-white/10 bg-white/5 text-ink-400 hover:text-white"
              }`}
            >
              {role === "ALL" ? "All Roles" : role}
            </button>
          ))}
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="overflow-hidden rounded-xl border border-white/5 bg-ink-900">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/5">
              {["Timestamp", "Admin User", "Role", "Action", "Entity", "IP Address"].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-widest text-ink-500">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filteredLogs.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-sm text-ink-600">
                  No matching audit logs found.
                </td>
              </tr>
            ) : (
              filteredLogs.map((log) => (
                <tr key={log.id} className="transition hover:bg-white/[0.02]">
                  <td className="px-4 py-3 text-xs text-ink-500 font-mono">
                    {formatDate(log.createdAt)}
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-white text-xs">{log.adminUser?.name ?? "System"}</p>
                    <p className="text-[11px] text-ink-500">{log.adminUser?.email}</p>
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={log.adminUser?.role ?? "ADMIN"} showDot={false} size="xs" />
                  </td>
                  <td className="px-4 py-3 font-mono text-xs font-semibold text-blueprint-300">
                    {log.action}
                  </td>
                  <td className="px-4 py-3 text-xs font-mono text-ink-400">
                    {log.entityType ?? "—"}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-ink-600">
                    {log.ipAddress ?? "local"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
