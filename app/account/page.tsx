import type { Metadata } from "next";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { SignInForm } from "@/components/account/SignInForm";
import { SignOutButton } from "@/components/account/SignOutButton";

export const metadata: Metadata = {
  title: "Account",
  robots: { index: false },
  alternates: { canonical: "/account" },
};

export default async function AccountPage() {
  const session = await getServerSession(authOptions);
  const googleEnabled = Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);

  if (!session?.user?.email) {
    return (
      <Container className="py-16">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Account", href: "/account" }]} />
        <h1 className="mt-6 text-display-lg font-medium">Sign in</h1>
        <p className="mt-4 max-w-md text-lg text-ink-500 dark:text-ink-200">
          Sign in to see your plan and purchase history.
        </p>
        <div className="mt-10">
          <SignInForm googleEnabled={googleEnabled} />
        </div>
      </Container>
    );
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { purchases: { include: { invoice: true }, orderBy: { createdAt: "desc" } } },
  });

  return (
    <Container className="py-16">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Account", href: "/account" }]} />
      <div className="mt-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-display-lg font-medium">Account</h1>
          <p className="mt-2 text-ink-500 dark:text-ink-300">{session.user.email}</p>
        </div>
        <SignOutButton />
      </div>

      <div className="mt-10 rounded-lg border border-blueprint-200 bg-blueprint-50/50 p-6 dark:border-blueprint-800 dark:bg-blueprint-900/20">
        <p className="label-mono">Current plan</p>
        <p className="mt-1 font-display text-2xl font-medium">{user?.plan ?? "Free"}</p>
      </div>

      <div className="mt-12">
        <p className="label-mono mb-4">Purchase history</p>
        {!user?.purchases.length ? (
          <p className="text-sm text-ink-500 dark:text-ink-300">No purchases yet.</p>
        ) : (
          <div className="flex flex-col divide-y divide-ink-100 border-y border-ink-100 dark:divide-ink-800 dark:border-ink-800">
            {user.purchases.map((p: (typeof user.purchases)[number]) => (
              <div key={p.id} className="flex flex-wrap items-center justify-between gap-4 py-4">
                <div>
                  <p className="text-sm font-medium">{p.itemName}</p>
                  <p className="text-xs text-ink-400">
                    {new Date(p.createdAt).toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" })} ·{" "}
                    {p.provider}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-mono text-sm">
                    {(p.amountInPaise / 100).toLocaleString("en-IN", { style: "currency", currency: "INR" })}
                  </span>
                  {p.invoice && (
                    <Link href={`/invoice/${p.invoice.id}`} className="text-xs text-blueprint-600 hover:underline dark:text-blueprint-300">
                      View invoice
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Container>
  );
}
