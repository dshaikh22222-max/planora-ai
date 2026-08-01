// ─────────────────────────────────────────────────────────────
// StatusBadge — Reusable status pill for tables
// ─────────────────────────────────────────────────────────────

const STATUS_STYLES: Record<string, string> = {
  // Content statuses
  DRAFT: "bg-ink-700/60 text-ink-300 border-ink-600/30",
  REVIEW: "bg-amber-500/15 text-amber-400 border-amber-500/20",
  PUBLISHED: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
  ARCHIVED: "bg-ink-600/40 text-ink-500 border-ink-500/20",

  // Product statuses
  OUT_OF_STOCK: "bg-rose-500/15 text-rose-400 border-rose-500/20",

  // Order statuses
  PENDING: "bg-amber-500/15 text-amber-400 border-amber-500/20",
  PROCESSING: "bg-blueprint-500/15 text-blueprint-400 border-blueprint-500/20",
  FULFILLED: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
  SHIPPED: "bg-violet-500/15 text-violet-400 border-violet-500/20",
  DELIVERED: "bg-emerald-600/20 text-emerald-300 border-emerald-600/30",
  REFUNDED: "bg-rose-500/10 text-rose-300 border-rose-500/15",
  CANCELLED: "bg-ink-600/40 text-ink-500 border-ink-500/20",
  FAILED: "bg-rose-500/20 text-rose-400 border-rose-500/25",

  // Subscription statuses
  ACTIVE: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
  PAST_DUE: "bg-rose-500/15 text-rose-400 border-rose-500/20",
  EXPIRED: "bg-ink-600/40 text-ink-500 border-ink-500/20",
  TRIALING: "bg-violet-500/15 text-violet-400 border-violet-500/20",
  PAUSED: "bg-amber-500/15 text-amber-400 border-amber-500/20",

  // User / admin statuses
  COMPLETED: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
  INACTIVE: "bg-ink-600/40 text-ink-500 border-ink-500/20",

  // Roles
  SUPER_ADMIN: "bg-rose-500/15 text-rose-400 border-rose-500/20",
  ADMIN: "bg-blueprint-500/15 text-blueprint-400 border-blueprint-500/20",
  EDITOR: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
  SUPPORT: "bg-amber-500/15 text-amber-400 border-amber-500/20",
  ANALYST: "bg-violet-500/15 text-violet-400 border-violet-500/20",
};

const DOTS: Record<string, string> = {
  PUBLISHED: "bg-emerald-400",
  ACTIVE: "bg-emerald-400",
  DELIVERED: "bg-emerald-400",
  FULFILLED: "bg-emerald-400",
  COMPLETED: "bg-emerald-400",
  PENDING: "bg-amber-400",
  PROCESSING: "bg-blueprint-400",
  SHIPPED: "bg-violet-400",
  REVIEW: "bg-amber-400",
  TRIALING: "bg-violet-400",
  PAUSED: "bg-amber-400",
};

interface StatusBadgeProps {
  status: string;
  showDot?: boolean;
  size?: "xs" | "sm";
}

export function StatusBadge({ status, showDot = true, size = "sm" }: StatusBadgeProps) {
  const style = STATUS_STYLES[status] ?? "bg-ink-700/60 text-ink-300 border-ink-600/30";
  const dot = DOTS[status];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 font-mono font-medium ${
        size === "xs" ? "py-0.5 text-[10px]" : "py-1 text-[11px]"
      } ${style}`}
    >
      {showDot && dot && (
        <span className={`h-1.5 w-1.5 rounded-full ${dot} animate-pulse`} />
      )}
      {status.replace(/_/g, " ")}
    </span>
  );
}
