import { prisma } from "@/lib/prisma";
import type { OrderStatus } from "@prisma/client";

export async function listOrders(filters?: {
  status?: OrderStatus;
  search?: string;
  page?: number;
  pageSize?: number;
}) {
  const page = filters?.page ?? 1;
  const pageSize = filters?.pageSize ?? 20;
  const skip = (page - 1) * pageSize;

  const where = {
    ...(filters?.status ? { status: filters.status } : {}),
    ...(filters?.search
      ? {
          OR: [
            { orderNumber: { contains: filters.search, mode: "insensitive" as const } },
            { trackingNumber: { contains: filters.search, mode: "insensitive" as const } },
          ],
        }
      : {}),
  };

  const [items, total] = await Promise.all([
    prisma.order.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: pageSize,
      include: {
        fulfillments: true,
      },
    }),
    prisma.order.count({ where }),
  ]);

  return { items, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
}

export async function getOrderById(id: string) {
  return prisma.order.findUnique({
    where: { id },
    include: { fulfillments: true },
  });
}

export async function updateOrderStatus(
  id: string,
  status: OrderStatus,
  notes?: string
): Promise<void> {
  await prisma.order.update({
    where: { id },
    data: {
      status,
      ...(notes ? { notes } : {}),
    },
  });
}

export async function addFulfillment(data: {
  orderId: string;
  carrier: string;
  trackingNumber: string;
  notes?: string;
}): Promise<void> {
  await prisma.$transaction([
    prisma.orderFulfillment.create({ data }),
    prisma.order.update({
      where: { id: data.orderId },
      data: {
        status: "SHIPPED",
        carrier: data.carrier,
        trackingNumber: data.trackingNumber,
      },
    }),
  ]);
}

export async function processRefund(
  id: string,
  refundedAmount: number,
  refundReason: string
): Promise<void> {
  await prisma.order.update({
    where: { id },
    data: {
      status: "REFUNDED",
      refundedAmount,
      refundReason,
    },
  });
}

export async function getOrderStats() {
  const [total, pending, processing, shipped, fulfilled, refunded] = await Promise.all([
    prisma.order.count(),
    prisma.order.count({ where: { status: "PENDING" } }),
    prisma.order.count({ where: { status: "PROCESSING" } }),
    prisma.order.count({ where: { status: "SHIPPED" } }),
    prisma.order.count({ where: { status: "FULFILLED" } }),
    prisma.order.count({ where: { status: "REFUNDED" } }),
  ]);
  return { total, pending, processing, shipped, fulfilled, refunded };
}
