import type { Metadata } from "next";
import { getEndUserDetail } from "@/lib/admin/repositories/user-mgmt.repository";
import { notFound } from "next/navigation";
import UserDetailClient from "./UserDetailClient";

export const metadata: Metadata = { title: "User Profile" };

export default async function UserDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getEndUserDetail(id);
  if (!user) notFound();

  return <UserDetailClient user={user as never} />;
}
