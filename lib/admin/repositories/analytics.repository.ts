import { prisma } from "@/lib/prisma";

export async function getAnalyticsData() {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const [
    totalUsers,
    recentUsersCount,
    totalPurchasesCount,
    totalRevenueResult,
    monthlyRevenueResult,
    purchasesByKind,
    recentPurchases,
    userGrowth,
    orderStatusCounts,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
    prisma.purchase.count({ where: { status: "completed" } }),
    prisma.purchase.aggregate({
      _sum: { amountInPaise: true },
      where: { status: "completed" },
    }),
    prisma.purchase.aggregate({
      _sum: { amountInPaise: true },
      where: {
        status: "completed",
        createdAt: { gte: thirtyDaysAgo },
      },
    }),
    prisma.purchase.groupBy({
      by: ["kind"],
      _count: { _all: true },
      _sum: { amountInPaise: true },
      where: { status: "completed" },
    }),
    prisma.purchase.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
      where: { status: "completed" },
      select: {
        id: true,
        itemName: true,
        kind: true,
        amountInPaise: true,
        createdAt: true,
      },
    }),
    prisma.user.groupBy({
      by: ["plan"],
      _count: { _all: true },
    }),
    prisma.order.groupBy({
      by: ["status"],
      _count: { _all: true },
    }),
  ]);

  const totalRevenueInPaise = totalRevenueResult._sum.amountInPaise ?? 0;
  const monthlyRevenueInPaise = monthlyRevenueResult._sum.amountInPaise ?? 0;

  return {
    overview: {
      totalUsers,
      newUsers30d: recentUsersCount,
      totalOrders: totalPurchasesCount,
      totalRevenueInPaise,
      monthlyRevenueInPaise,
      avgOrderValueInPaise:
        totalPurchasesCount > 0 ? Math.round(totalRevenueInPaise / totalPurchasesCount) : 0,
    },
    revenueByKind: purchasesByKind.map((item) => ({
      kind: item.kind,
      count: item._count._all,
      totalAmountInPaise: item._sum.amountInPaise ?? 0,
    })),
    userPlans: userGrowth.map((item) => ({
      plan: item.plan,
      count: item._count._all,
    })),
    orderStatuses: orderStatusCounts.map((item) => ({
      status: item.status,
      count: item._count._all,
    })),
    recentPurchases,
  };
}
