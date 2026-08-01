import type { Metadata } from "next";
import { getOrderById } from "@/lib/admin/repositories/order.repository";
import { notFound } from "next/navigation";
import OrderDetailClient from "./OrderDetailClient";

export const metadata: Metadata = { title: "Order Details" };

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = await getOrderById(id);
  if (!order) notFound();

  return <OrderDetailClient order={order as never} />;
}
