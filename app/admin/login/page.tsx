import type { Metadata } from "next";
import { Suspense } from "react";
import { AdminLoginForm } from "@/components/admin/login/AdminLoginForm";

export const metadata: Metadata = {
  title: "Admin Sign In — Planora AI",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    // Fixed overlay — covers public Navbar/Footer without modifying existing layout
    <div className="fixed inset-0 z-[100]">
      <Suspense>
        <AdminLoginForm />
      </Suspense>
    </div>
  );
}
