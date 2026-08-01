"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { UserPlus, Shield, Loader2, Save, Lock } from "lucide-react";
import { StatusBadge } from "@/components/admin/ui/StatusBadge";
import { formatDate } from "@/lib/admin/utils/format";

interface AdminUserRow {
  id: string;
  email: string;
  name: string;
  role: string;
  isActive: boolean;
  totpEnabled: boolean;
  lastLoginAt: Date | string | null;
  createdAt: Date | string;
}

export default function AdminUsersClient({ initialUsers }: { initialUsers: AdminUserRow[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  // New admin user form
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "EDITOR" as "SUPER_ADMIN" | "ADMIN" | "EDITOR" | "SUPPORT" | "ANALYST",
  });

  async function handleCreateAdmin() {
    if (!form.name || !form.email || !form.password) {
      setError("Name, email, and password are required");
      return;
    }
    setError(null);

    startTransition(async () => {
      const res = await fetch("/api/admin/admin-users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error?.message ?? "Creation failed");
        return;
      }

      setForm({ name: "", email: "", password: "", role: "EDITOR" });
      router.refresh();
    });
  }

  async function handleToggleStatus(user: AdminUserRow) {
    startTransition(async () => {
      await fetch("/api/admin/admin-users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: user.id,
          isActive: !user.isActive,
        }),
      });
      router.refresh();
    });
  }

  async function handleChangeRole(id: string, role: string) {
    startTransition(async () => {
      await fetch("/api/admin/admin-users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, role }),
      });
      router.refresh();
    });
  }

  const inputCls = "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-ink-600 outline-none transition focus:border-blueprint-500";
  const labelCls = "mb-1.5 block text-xs font-medium text-ink-400";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Admin Users & RBAC</h1>
          <p className="text-sm text-ink-500">Manage internal console administrator accounts and role permissions</p>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">
          {error}
        </div>
      )}

      {/* Create New Admin Form */}
      <div className="rounded-xl border border-white/5 bg-ink-900 p-6 space-y-4">
        <div className="flex items-center gap-2">
          <UserPlus size={16} className="text-blueprint-400" />
          <h2 className="text-sm font-semibold text-white">Invite New Console Administrator</h2>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Name *</label>
            <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="Admin Full Name" className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Email Address *</label>
            <input type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} placeholder="admin@planora.ai" className={inputCls} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Password (min 12 chars) *</label>
            <input type="password" value={form.password} onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))} placeholder="Secure password" className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Assign Role *</label>
            <select value={form.role} onChange={(e) => setForm((f) => ({ ...f, role: e.target.value as typeof form.role }))} className={inputCls}>
              <option value="SUPER_ADMIN">SUPER_ADMIN (Full system access)</option>
              <option value="ADMIN">ADMIN (Full access minus admin user management)</option>
              <option value="EDITOR">EDITOR (Products, Blog, Media, SEO)</option>
              <option value="SUPPORT">SUPPORT (Orders, Subscriptions, Users)</option>
              <option value="ANALYST">ANALYST (Read-only analytics & reporting)</option>
            </select>
          </div>
        </div>

        <div className="pt-2">
          <button
            onClick={handleCreateAdmin}
            disabled={isPending || !form.name || !form.email || !form.password}
            className="flex items-center gap-2 rounded-xl bg-blueprint-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blueprint-500 disabled:opacity-50"
          >
            {isPending ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
            Create Admin Account
          </button>
        </div>
      </div>

      {/* Admin Users Table */}
      <div className="overflow-hidden rounded-xl border border-white/5 bg-ink-900">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/5">
              {["Administrator", "Role", "Status", "Last Login", "Actions"].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-widest text-ink-500">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {initialUsers.map((u) => (
              <tr key={u.id} className="transition hover:bg-white/[0.02]">
                <td className="px-4 py-3">
                  <p className="font-medium text-white">{u.name}</p>
                  <p className="text-xs text-ink-500">{u.email}</p>
                </td>
                <td className="px-4 py-3">
                  <select
                    value={u.role}
                    onChange={(e) => handleChangeRole(u.id, e.target.value)}
                    className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-white outline-none focus:border-blueprint-500"
                  >
                    <option value="SUPER_ADMIN">SUPER_ADMIN</option>
                    <option value="ADMIN">ADMIN</option>
                    <option value="EDITOR">EDITOR</option>
                    <option value="SUPPORT">SUPPORT</option>
                    <option value="ANALYST">ANALYST</option>
                  </select>
                </td>
                <td className="px-4 py-3">
                  {u.isActive ? (
                    <span className="rounded bg-emerald-500/20 px-2.5 py-0.5 text-[10px] font-mono font-semibold text-emerald-400">Active</span>
                  ) : (
                    <span className="rounded bg-rose-500/20 px-2.5 py-0.5 text-[10px] font-mono font-semibold text-rose-400">Disabled</span>
                  )}
                </td>
                <td className="px-4 py-3 text-xs text-ink-500">
                  {formatDate(u.lastLoginAt)}
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => handleToggleStatus(u)}
                    disabled={isPending}
                    className={`rounded-lg border px-2.5 py-1 text-xs transition ${
                      u.isActive
                        ? "border-rose-500/30 bg-rose-500/10 text-rose-300 hover:bg-rose-500/20"
                        : "border-emerald-500/30 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20"
                    }`}
                  >
                    {u.isActive ? "Deactivate" : "Activate"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
