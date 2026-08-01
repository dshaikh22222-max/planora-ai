import { prisma } from "@/lib/prisma";

export async function listEndUsers(filters?: {
  plan?: string;
  search?: string;
  page?: number;
  pageSize?: number;
}) {
  const page = filters?.page ?? 1;
  const pageSize = filters?.pageSize ?? 20;
  const skip = (page - 1) * pageSize;

  const where = {
    ...(filters?.plan ? { plan: filters.plan } : {}),
    ...(filters?.search
      ? {
          OR: [
            { name: { contains: filters.search, mode: "insensitive" as const } },
            { email: { contains: filters.search, mode: "insensitive" as const } },
          ],
        }
      : {}),
  };

  const [items, total] = await Promise.all([
    prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        plan: true,
        createdAt: true,
        _count: {
          select: { purchases: true },
        },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: pageSize,
    }),
    prisma.user.count({ where }),
  ]);

  return { items, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
}

export async function getEndUserDetail(id: string) {
  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      purchases: {
        orderBy: { createdAt: "desc" },
        include: { invoice: true },
      },
      accounts: {
        select: { provider: true },
      },
    },
  });

  if (!user) return null;

  const subscriptions = await prisma.subscription.findMany({
    where: { userId: id },
    orderBy: { createdAt: "desc" },
  });

  return { ...user, subscriptions };
}

export async function updateUserPlan(userId: string, plan: string): Promise<void> {
  await prisma.user.update({
    where: { id: userId },
    data: { plan },
  });
}

export async function getUserStats() {
  const [total, pro, free, enterprise] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { plan: "Pro" } }),
    prisma.user.count({ where: { plan: "Free" } }),
    prisma.user.count({ where: { plan: "Enterprise" } }),
  ]);
  return { total, pro, free, enterprise };
}
