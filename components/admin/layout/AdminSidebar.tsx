"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard, Package, Download, Truck, Image, FileText,
  Layout, Settings, ShoppingCart, RefreshCw, Users, BarChart2,
  Search, Shield, Database, Lock, ChevronRight, Zap,
} from "lucide-react";
import { ADMIN_CONFIG } from "@/lib/admin/config";

const ICON_MAP: Record<string, LucideIcon> = {
  LayoutDashboard, Package, Download, Truck, Image, FileText,
  Layout, Settings, ShoppingCart, RefreshCw, Users, BarChart2,
  Search, Shield, Database, Lock,
};

const SECTION_COLORS: Record<string, string> = {
  Catalogue: "text-blueprint-400",
  Content: "text-emerald-400",
  Commerce: "text-amber-400",
  Insights: "text-violet-400",
  System: "text-rose-400",
};

interface AdminSidebarProps {
  adminName: string;
  adminRole: string;
  adminEmail: string;
}

export function AdminSidebar({ adminName, adminRole, adminEmail }: AdminSidebarProps) {
  const pathname = usePathname();

  // Filter enabled features
  const enabledItems = ADMIN_CONFIG.navItems.filter((item) => {
    if (!("feature" in item) || !item.feature) return true;
    return ADMIN_CONFIG.features[item.feature as keyof typeof ADMIN_CONFIG.features];
  });

  // Group by section
  const sections = enabledItems.reduce<Record<string, typeof enabledItems>>((acc, item) => {
    const sec = item.section ?? "__root__";
    if (!acc[sec]) acc[sec] = [];
    acc[sec].push(item);
    return acc;
  }, {});

  const isActive = (href: string) =>
    href === "/admin"
      ? pathname === "/admin"
      : pathname === href || pathname.startsWith(href + "/");

  return (
    <aside className="fixed inset-y-0 left-0 z-40 flex w-60 flex-col border-r border-white/5 bg-ink-950">
      {/* Logo */}
      <div className="flex h-16 shrink-0 items-center gap-2.5 border-b border-white/5 px-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blueprint-600 shadow-lg shadow-blueprint-900/50">
          <Zap size={16} className="text-white" />
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-white">Planora AI</p>
          <p className="text-[10px] font-mono uppercase tracking-widest text-blueprint-400">
            Admin
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 scrollbar-thin">
        {/* Root items (Dashboard) */}
        {sections["__root__"]?.map((item) => {
          const Icon = ICON_MAP[item.icon] ?? LayoutDashboard;
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group mb-1 flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-150 ${
                active
                  ? "bg-blueprint-600/20 text-white"
                  : "text-ink-300 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Icon
                size={16}
                className={active ? "text-blueprint-400" : "text-ink-500 group-hover:text-ink-300"}
              />
              {item.label}
              {active && (
                <ChevronRight size={14} className="ml-auto text-blueprint-400" />
              )}
            </Link>
          );
        })}

        {/* Sectioned items */}
        {Object.entries(sections)
          .filter(([sec]) => sec !== "__root__")
          .map(([section, items]) => (
            <div key={section} className="mb-4">
              <p
                className={`mb-1.5 mt-3 px-3 text-[10px] font-mono font-semibold uppercase tracking-[0.12em] ${
                  SECTION_COLORS[section] ?? "text-ink-500"
                }`}
              >
                {section}
              </p>
              {items.map((item) => {
                const Icon = ICON_MAP[item.icon] ?? Package;
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`group mb-0.5 flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all duration-150 ${
                      active
                        ? "bg-white/8 font-medium text-white"
                        : "text-ink-400 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <Icon
                      size={15}
                      className={
                        active ? "text-white" : "text-ink-600 group-hover:text-ink-400"
                      }
                    />
                    <span className="truncate">{item.label}</span>
                    {active && (
                      <div className="ml-auto h-1.5 w-1.5 rounded-full bg-blueprint-400" />
                    )}
                  </Link>
                );
              })}
            </div>
          ))}
      </nav>

      {/* Admin user info */}
      <div className="border-t border-white/5 p-3">
        <div className="flex items-center gap-3 rounded-lg bg-white/5 px-3 py-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blueprint-500 to-blueprint-700 text-xs font-semibold text-white">
            {adminName.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-white">{adminName}</p>
            <p className="truncate text-[11px] text-ink-500">{adminRole}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
