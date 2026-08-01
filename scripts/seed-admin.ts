/**
 * Admin Seed Script — Create First SUPER_ADMIN User
 *
 * Run ONCE after deploying to create your first admin account.
 * Usage:
 *   npx tsx scripts/seed-admin.ts
 *
 * Or add to package.json:
 *   "admin:seed": "tsx scripts/seed-admin.ts"
 *
 * Environment:
 *   ADMIN_EMAIL    - Email for the admin account
 *   ADMIN_PASSWORD - Password (min 16 chars)
 *   ADMIN_NAME     - Display name
 */

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL ?? "admin@planora.ai";
  const password = process.env.ADMIN_PASSWORD;
  const name = process.env.ADMIN_NAME ?? "Super Admin";

  if (!password || password.length < 16) {
    console.error(
      "❌ ADMIN_PASSWORD must be set and at least 16 characters long.\n" +
        "   Run: ADMIN_PASSWORD=your_secure_password npx tsx scripts/seed-admin.ts"
    );
    process.exit(1);
  }

  const existing = await prisma.adminUser.findUnique({ where: { email } });
  if (existing) {
    console.log(`⚠️  Admin user with email ${email} already exists. Skipping.`);
    return;
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const admin = await prisma.adminUser.create({
    data: {
      email,
      name,
      passwordHash,
      role: "SUPER_ADMIN",
      isActive: true,
    },
  });

  console.log("✅ SUPER_ADMIN created successfully:");
  console.log(`   ID:    ${admin.id}`);
  console.log(`   Email: ${admin.email}`);
  console.log(`   Name:  ${admin.name}`);
  console.log(`   Role:  ${admin.role}`);
  console.log("\n🔐 Login at: /admin/login");
  console.log("⚠️  Delete this script output from your logs after noting the credentials.");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
