import { prisma } from "@/lib/prisma";
import type { SubscriptionStatus } from "@prisma/client";

export async function listSubscriptions(filters?: {
  status?: SubscriptionStatus;
  provider?: string;
  search?: string;
  page?: number;
  pageSize?: number;
}) {
  const page = filters?.page ?? 1;
  const pageSize = filters?.pageSize ?? 20;
  const skip = (page - 1) * pageSize;

  const where = {
    ...(filters?.status ? { status: filters.status } : {}),
    ...(filters?.provider ? { provider: filters.provider } : {}),
    ...(filters?.search
      ? {
          OR: [
            { planName: { contains: filters.search, mode: "insensitive" as const } },
            { providerSubId: { contains: filters.search, mode: "insensitive" as const } },
          ],
        }
      : {}),
  };

  const [items, total] = await Promise.all([
    prisma.subscription.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: pageSize,
    }),
    prisma.subscription.count({ where }),
  ]);

  return { items, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
}

export async function getSubscriptionById(id: string) {
  return prisma.subscription.findUnique({ where: { id } });
}

export async function updateSubscriptionStatus(
  id: string,
  status: SubscriptionStatus,
  cancelAtPeriodEnd?: boolean
): Promise<void> {
  await prisma.subscription.update({
    where: { id },
    data: {
      status,
      ...(cancelAtPeriodEnd !== undefined ? { cancelAtPeriodEnd } : {}),
      ...(status === "CANCELLED" ? { canceledAt: new Date(), endedAt: new Date() } : {}),
    },
  });
}

export async function getSubscriptionStats() {
  const [total, active, trialing, pastDue, cancelled] = await Promise.all([
    prisma.subscription.count(),
    prisma.subscription.count({ where: { status: "ACTIVE" } }),
    prisma.subscription.count({ where: { status: "TRIALING" } }),
    prisma.subscription.count({ where: { status: "PAST_DUE" } }),
    prisma.subscription.count({ where: { status: "CANCELLED" } }),
  ]);

  const mrrResult = await prisma.subscription.aggregate({
    _sum: { amount: true },
    where: { status: "ACTIVE" },
  });

  const mrrInPaise = mrrResult._sum.amount ?? 0;

  return { total, active, trialing, pastDue, cancelled, mrrInPaise };
}
