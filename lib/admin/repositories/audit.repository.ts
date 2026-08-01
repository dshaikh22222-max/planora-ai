import { prisma } from "@/lib/prisma";

export async function listAuditLogs(filters?: {
  adminUserId?: string;
  action?: string;
  page?: number;
  pageSize?: number;
}) {
  const page = filters?.page ?? 1;
  const pageSize = filters?.pageSize ?? 30;
  const skip = (page - 1) * pageSize;

  const where = {
    ...(filters?.adminUserId ? { adminUserId: filters.adminUserId } : {}),
    ...(filters?.action
      ? { action: { contains: filters.action, mode: "insensitive" as const } }
      : {}),
  };

  const [items, total] = await Promise.all([
    prisma.adminAuditLog.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: pageSize,
      include: {
        adminUser: {
          select: { name: true, email: true, role: true },
        },
      },
    }),
    prisma.adminAuditLog.count({ where }),
  ]);

  return { items, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
}

export async function getDatabaseTableStats() {
  const [
    users,
    purchases,
    invoices,
    products,
    blogPosts,
    mediaFiles,
    orders,
    subscriptions,
    auditLogs,
    adminUsers,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.purchase.count(),
    prisma.invoice.count(),
    prisma.product.count(),
    prisma.blogPost.count(),
    prisma.mediaFile.count(),
    prisma.order.count(),
    prisma.subscription.count(),
    prisma.adminAuditLog.count(),
    prisma.adminUser.count(),
  ]);

  return [
    { table: "User", count: users },
    { table: "Purchase", count: purchases },
    { table: "Invoice", count: invoices },
    { table: "Product", count: products },
    { table: "BlogPost", count: blogPosts },
    { table: "MediaFile", count: mediaFiles },
    { table: "Order", count: orders },
    { table: "Subscription", count: subscriptions },
    { table: "AdminAuditLog", count: auditLogs },
    { table: "AdminUser", count: adminUsers },
  ];
}
