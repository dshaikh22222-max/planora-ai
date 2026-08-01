"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";

const PATH_LABELS: Record<string, string> = {
  admin: "Dashboard",
  products: "Products",
  digital: "Digital Assets",
  physical: "Physical",
  blog: "Blog",
  pages: "CMS Pages",
  settings: "Site Settings",
  media: "Media Library",
  users: "End Users",
  "admin-users": "Admin Users",
  orders: "Orders",
  subscriptions: "Subscriptions",
  analytics: "Analytics",
  seo: "SEO",
  backup: "Backup",
  security: "Security",
  new: "New",
  edit: "Edit",
  login: "Login",
};

export function AdminBreadcrumb() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  // Build crumb list — skip "admin" prefix but include it as root
  const crumbs = segments.map((seg, i) => {
    const href = "/" + segments.slice(0, i + 1).join("/");
    const isId = /^[a-z0-9]{25,}$/i.test(seg); // cuid-like IDs
    const label = isId ? "Detail" : (PATH_LABELS[seg] ?? seg.replace(/-/g, " "));
    return { href, label, isLast: i === segments.length - 1 };
  });

  return (
    <nav
      aria-label="Breadcrumb"
      className="flex items-center gap-1.5 text-xs text-ink-500"
    >
      <Link href="/admin" className="flex items-center gap-1 hover:text-ink-300 transition">
        <Home size={11} />
      </Link>

      {crumbs.slice(1).map((crumb) => (
        <span key={crumb.href} className="flex items-center gap-1.5">
          <ChevronRight size={11} className="text-ink-700" />
          {crumb.isLast ? (
            <span className="font-medium text-ink-200 capitalize">{crumb.label}</span>
          ) : (
            <Link
              href={crumb.href}
              className="capitalize hover:text-ink-300 transition"
            >
              {crumb.label}
            </Link>
          )}
        </span>
      ))}
    </nav>
  );
}
