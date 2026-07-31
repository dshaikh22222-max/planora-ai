import Link from "next/link";
import { footerNav, site } from "@/lib/site";
import { Container } from "@/components/ui/Container";

export function Footer() {
  return (
    <footer className="border-t border-ink-100 dark:border-ink-800">
      <Container className="grid grid-cols-2 gap-10 py-16 md:grid-cols-6">
        <div className="col-span-2">
          <Link href="/" className="flex items-center gap-2">
            <span className="font-mono text-xs text-blueprint-500 dark:text-blueprint-300">/PL</span>
            <span className="font-display text-lg font-medium">{site.name}</span>
          </Link>
          <p className="mt-3 max-w-xs text-sm text-ink-500 dark:text-ink-300">{site.tagline}</p>
          <p className="label-mono mt-6">Survey No. — India</p>
        </div>

        {Object.entries(footerNav).map(([heading, links]) => (
          <div key={heading}>
            <p className="label-mono mb-4">{heading}</p>
            <ul className="flex flex-col gap-2.5">
              {links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-ink-600 hover:text-ink-900 dark:text-ink-300 dark:hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </Container>

      <div className="border-t border-ink-100 py-6 dark:border-ink-800">
        <Container className="flex flex-col items-center justify-between gap-3 text-xs text-ink-400 md:flex-row dark:text-ink-500">
          <p>© {new Date().getFullYear()} {site.name}. All rights reserved.</p>
          <p className="font-mono">Built in India, for India.</p>
        </Container>
      </div>
    </footer>
  );
}
