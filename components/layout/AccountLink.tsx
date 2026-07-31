"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { User } from "lucide-react";

export function AccountLink() {
  const { data: session, status } = useSession();

  return (
    <Link
      href="/account"
      className="flex h-9 w-9 items-center justify-center rounded border border-ink-200 text-ink-700 transition-colors hover:border-ink-900 hover:text-ink-900 dark:border-ink-600 dark:text-ink-200 dark:hover:border-white dark:hover:text-white"
      aria-label={status === "authenticated" ? "Your account" : "Sign in"}
      title={status === "authenticated" ? session?.user?.email ?? "Account" : "Sign in"}
    >
      <User className="h-4 w-4" />
    </Link>
  );
}
