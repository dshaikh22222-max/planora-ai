"use client";

import { useRouter } from "next/navigation";
import { Bell, LogOut, ChevronDown, ExternalLink } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

interface AdminTopbarProps {
  adminName: string;
  adminRole: string;
  adminEmail: string;
  title?: string;
}

export function AdminTopbar({ adminName, adminRole, adminEmail, title }: AdminTopbarProps) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  async function handleLogout() {
    setLoggingOut(true);
    try {
      await fetch("/api/admin/auth/logout", { method: "POST" });
      router.push("/admin/login");
      router.refresh();
    } catch {
      setLoggingOut(false);
    }
  }

  const roleColors: Record<string, string> = {
    SUPER_ADMIN: "bg-rose-500/15 text-rose-400 border-rose-500/20",
    ADMIN: "bg-blueprint-500/15 text-blueprint-400 border-blueprint-500/20",
    EDITOR: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
    SUPPORT: "bg-amber-500/15 text-amber-400 border-amber-500/20",
    ANALYST: "bg-violet-500/15 text-violet-400 border-violet-500/20",
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-white/5 bg-ink-900/80 px-6 backdrop-blur-xl">
      {/* Left — page title */}
      <div className="flex items-center gap-2">
        {title && (
          <h1 className="text-base font-semibold text-white">{title}</h1>
        )}
      </div>

      {/* Right — actions */}
      <div className="flex items-center gap-2">
        {/* View live site */}
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-ink-300 transition hover:border-white/20 hover:text-white"
        >
          <ExternalLink size={12} />
          Live Site
        </Link>

        {/* Notifications (placeholder) */}
        <button
          className="relative rounded-lg border border-white/10 bg-white/5 p-2 text-ink-400 transition hover:border-white/20 hover:text-white"
          aria-label="Notifications"
        >
          <Bell size={15} />
          <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-blueprint-400" />
        </button>

        {/* User menu */}
        <div className="relative">
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="flex items-center gap-2.5 rounded-lg border border-white/10 bg-white/5 py-1.5 pl-3 pr-2.5 text-sm text-white transition hover:border-white/20"
          >
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-blueprint-500 to-blueprint-700 text-[11px] font-semibold">
              {adminName.charAt(0).toUpperCase()}
            </div>
            <span className="hidden text-sm font-medium sm:block">{adminName}</span>
            <span
              className={`hidden rounded border px-1.5 py-0.5 text-[10px] font-mono font-semibold sm:inline-flex ${
                roleColors[adminRole] ?? roleColors.ADMIN
              }`}
            >
              {adminRole.replace("_", " ")}
            </span>
            <ChevronDown size={13} className="text-ink-500" />
          </button>

          {/* Dropdown */}
          {menuOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setMenuOpen(false)}
              />
              <div className="absolute right-0 top-full z-20 mt-2 w-56 rounded-xl border border-white/10 bg-ink-900 p-1 shadow-xl shadow-black/40">
                <div className="border-b border-white/5 px-3 py-2.5">
                  <p className="text-sm font-medium text-white">{adminName}</p>
                  <p className="truncate text-xs text-ink-500">{adminEmail}</p>
                </div>

                <div className="mt-1">
                  <Link
                    href="/admin/security"
                    onClick={() => setMenuOpen(false)}
                    className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-ink-300 transition hover:bg-white/5 hover:text-white"
                  >
                    Security Settings
                  </Link>
                </div>

                <div className="mt-1 border-t border-white/5 pt-1">
                  <button
                    onClick={() => { setMenuOpen(false); handleLogout(); }}
                    disabled={loggingOut}
                    className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-rose-400 transition hover:bg-rose-500/10 disabled:opacity-50"
                  >
                    <LogOut size={14} />
                    {loggingOut ? "Signing out…" : "Sign out"}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
