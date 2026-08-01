import type { Metadata } from "next";
import { listAdminUsers } from "@/lib/admin/repositories/admin-user.repository";
import AdminUsersClient from "./AdminUsersClient";

export const metadata: Metadata = { title: "Admin User Management" };

export default async function AdminUsersPage() {
  const users = await listAdminUsers();
  return <AdminUsersClient initialUsers={users as never} />;
}
