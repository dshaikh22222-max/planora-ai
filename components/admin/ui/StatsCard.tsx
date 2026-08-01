// ─────────────────────────────────────────────────────────────
// StatsCard — Admin Dashboard KPI Card
// Displays a metric with optional trend indicator.
// ─────────────────────────────────────────────────────────────

import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: {
    value: number;     // e.g. +12.5 or -3.2
    label?: string;    // e.g. "vs last month"
  };
  icon?: React.ReactNode;
  accent?: "blueprint" | "emerald" | "amber" | "violet" | "rose";
}

const ACCENT_STYLES = {
  blueprint: {
    icon: "bg-blueprint-600/20 text-blueprint-400",
    badge: "text-blueprint-400",
  },
  emerald: {
    icon: "bg-emerald-600/15 text-emerald-400",
    badge: "text-emerald-400",
  },
  amber: {
    icon: "bg-amber-600/15 text-amber-400",
    badge: "text-amber-400",
  },
  violet: {
    icon: "bg-violet-600/15 text-violet-400",
    badge: "text-violet-400",
  },
  rose: {
    icon: "bg-rose-600/15 text-rose-400",
    badge: "text-rose-400",
  },
};

export function StatsCard({
  title,
  value,
  subtitle,
  trend,
  icon,
  accent = "blueprint",
}: StatsCardProps) {
  const styles = ACCENT_STYLES[accent];

  const TrendIcon =
    !trend ? null
    : trend.value > 0 ? TrendingUp
    : trend.value < 0 ? TrendingDown
    : Minus;

  const trendColor =
    !trend ? ""
    : trend.value > 0 ? "text-emerald-400"
    : trend.value < 0 ? "text-rose-400"
    : "text-ink-500";

  return (
    <div className="relative overflow-hidden rounded-xl border border-white/5 bg-ink-900 p-5 transition hover:border-white/10">
      {/* Top row */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-widest text-ink-500">
            {title}
          </p>
          <p className="mt-2 text-2xl font-bold tracking-tight text-white">
            {value}
          </p>
          {subtitle && (
            <p className="mt-0.5 text-xs text-ink-500">{subtitle}</p>
          )}
        </div>

        {icon && (
          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${styles.icon}`}
          >
            {icon}
          </div>
        )}
      </div>

      {/* Trend */}
      {trend && TrendIcon && (
        <div className={`mt-3 flex items-center gap-1.5 text-xs ${trendColor}`}>
          <TrendIcon size={12} />
          <span className="font-medium">
            {trend.value > 0 ? "+" : ""}
            {trend.value.toFixed(1)}%
          </span>
          {trend.label && (
            <span className="text-ink-600">{trend.label}</span>
          )}
        </div>
      )}

      {/* Subtle background glow */}
      <div className="pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full bg-blueprint-600/5 blur-2xl" />
    </div>
  );
}
