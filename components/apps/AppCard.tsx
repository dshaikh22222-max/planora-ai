import { PhoneMockup } from "./PhoneMockup";
import type { AppEntry } from "@/lib/apps";

const statusStyles: Record<string, string> = {
  Published: "text-blueprint-600 dark:text-blueprint-300",
  "In Development": "text-ink-400",
};

export function AppCard({ app, screenshotUrl }: { app: AppEntry; screenshotUrl: string | null }) {
  return (
    <div className="flex flex-col rounded-lg border border-ink-100 bg-paper p-6 dark:border-ink-800 dark:bg-ink-900">
      <PhoneMockup screenshotUrl={screenshotUrl} appName={app.name} accent={app.accent} />
      <div className="mt-6 flex-1">
        <h2 className="font-display text-lg font-medium">{app.name}</h2>
        <p className="mt-2 text-sm text-ink-500 dark:text-ink-300">{app.tagline}</p>
      </div>
      <div className="mt-6 flex items-center justify-between">
        <span className="font-mono text-xs text-ink-400 dark:text-ink-500">{app.stack}</span>
        <span className={`label-mono ${statusStyles[app.status]}`}>{app.status}</span>
      </div>
    </div>
  );
}
