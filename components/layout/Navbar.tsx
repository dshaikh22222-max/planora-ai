"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { primaryNav, site } from "@/lib/site";
import { Button } from "@/components/ui/Button";
import { ThemeToggle } from "./ThemeToggle";
import { AccountLink } from "./AccountLink";

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-ink-100 bg-paper/85 backdrop-blur dark:border-ink-800 dark:bg-ink-900/85">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 md:px-10">
        <Link href="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
          <span className="font-mono text-xs text-blueprint-500 dark:text-blueprint-300">/PL</span>
          <span className="font-display text-lg font-medium tracking-tight">{site.name}</span>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex" aria-label="Primary">
          {primaryNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm text-ink-600 transition-colors hover:text-ink-900 dark:text-ink-200 dark:hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <ThemeToggle />
          <AccountLink />
          <Link
            href="/admin"
            className="flex items-center gap-1 rounded-lg border border-blueprint-500/20 bg-blueprint-500/10 px-3 py-1.5 text-xs font-medium text-blueprint-600 transition hover:bg-blueprint-500/20 dark:text-blueprint-300"
          >
            Admin
          </Link>
          <Button href="/contact" variant="secondary" size="sm">
            Contact
          </Button>
          <Button href="/pricing" variant="primary" size="sm">
            Get started
          </Button>
        </div>

        <button
          type="button"
          className="flex h-9 w-9 items-center justify-center lg:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label={open ? "Close menu" : "Open menu"}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <nav className="border-t border-ink-100 px-6 py-4 lg:hidden dark:border-ink-800" aria-label="Mobile">
          <ul className="flex flex-col gap-1">
            {primaryNav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="block py-2.5 text-sm text-ink-700 dark:text-ink-200"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex items-center gap-3">
            <ThemeToggle />
            <AccountLink />
            <Button href="/pricing" variant="primary" size="sm" className="flex-1">
              Get started
            </Button>
          </div>
        </nav>
      )}
    </header>
  );
}
