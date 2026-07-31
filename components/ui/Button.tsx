import Link from "next/link";
import { cn } from "@/lib/utils";

type BaseProps = {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "stamp";
  size?: "sm" | "md" | "lg";
  className?: string;
};

const variants: Record<NonNullable<BaseProps["variant"]>, string> = {
  primary:
    "bg-ink-900 text-white hover:bg-ink-700 dark:bg-white dark:text-ink-900 dark:hover:bg-ink-50",
  secondary:
    "bg-transparent text-ink-900 border border-ink-200 hover:border-ink-900 dark:text-white dark:border-ink-600 dark:hover:border-white",
  ghost: "bg-transparent text-ink-900 hover:bg-ink-50 dark:text-white dark:hover:bg-ink-800",
  stamp: "bg-stamp-500 text-white hover:bg-stamp-600",
};

const sizes: Record<NonNullable<BaseProps["size"]>, string> = {
  sm: "text-sm px-4 py-2",
  md: "text-sm px-5 py-2.5",
  lg: "text-base px-7 py-3.5",
};

const base =
  "inline-flex items-center justify-center gap-2 rounded font-medium transition-colors duration-150 focus-visible:outline-none";

export function Button({
  children,
  variant = "primary",
  size = "md",
  className,
  href,
  ...props
}: BaseProps & { href?: string } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const classes = cn(base, variants[variant], sizes[size], className);

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}
