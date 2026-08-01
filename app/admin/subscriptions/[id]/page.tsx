import type { Metadata } from "next";
import { getSubscriptionById } from "@/lib/admin/repositories/subscription.repository";
import { notFound } from "next/navigation";
import SubscriptionDetailClient from "./SubscriptionDetailClient";

export const metadata: Metadata = { title: "Subscription Details" };

export default async function SubscriptionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const sub = await getSubscriptionById(id);
  if (!sub) notFound();

  return <SubscriptionDetailClient sub={sub as never} />;
}
