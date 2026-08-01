import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyAdminToken } from "@/lib/admin/auth/token";
import { ADMIN_CONFIG } from "@/lib/admin/config";
import { AdminSidebar } from "@/components/admin/layout/AdminSidebar";
import { AdminTopbar } from "@/components/admin/layout/AdminTopbar";
import { AdminBreadcrumb } from "@/components/admin/layout/AdminBreadcrumb";

export const metadata: Metadata = {
  title: {
    default: "Admin — Planora AI",
    template: "%s — Admin",
  },
  robots: { index: false, follow: false }, // Never index admin pages
};

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default async function AdminLayout({ children }: AdminLayoutProps) {
  // Server-side auth guard
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_CONFIG.cookieName)?.value;
  const payload = token ? await verifyAdminToken(token) : null;

  if (!payload) {
    return <>{children}</>;
  }

  return (
    // Fixed overlay covers the public Navbar/Footer without touching existing layout
    <div className="fixed inset-0 z-[100] flex overflow-hidden bg-ink-950 text-white">
      {/* Sidebar */}
      <AdminSidebar
        adminName={payload.name}
        adminRole={payload.role}
        adminEmail={payload.email}
      />

      {/* Main area */}
      <div className="flex flex-1 flex-col overflow-hidden pl-60">
        <AdminTopbar
          adminName={payload.name}
          adminRole={payload.role}
          adminEmail={payload.email}
        />

        <main className="flex flex-1 flex-col overflow-y-auto">
          {/* Breadcrumb */}
          <div className="shrink-0 border-b border-white/5 bg-ink-950/60 px-6 py-2.5 backdrop-blur">
            <AdminBreadcrumb />
          </div>

          {/* Page content */}
          <div className="flex-1 p-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
