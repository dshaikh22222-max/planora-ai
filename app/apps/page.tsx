import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { AppCard } from "@/components/apps/AppCard";
import { apps } from "@/lib/apps";
import { getScreenshotUrl } from "@/lib/screenshots";

export const metadata: Metadata = {
  title: "Apps",
  description: "Mobile apps and games shipped to the Play Store, spanning AI tools, utilities, and games.",
  alternates: { canonical: "/apps" },
};

export default function AppsPage() {
  return (
    <Container className="py-16">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Apps", href: "/apps" }]} />
      <h1 className="mt-6 text-display-lg font-medium">Apps</h1>
      <p className="mt-4 max-w-xl text-lg text-ink-500 dark:text-ink-200">
        Mobile apps and games built and published for the Indian market.
      </p>

      <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {apps.map((app) => (
          <AppCard key={app.slug} app={app} screenshotUrl={getScreenshotUrl(app.slug)} />
        ))}
      </div>
    </Container>
  );
}
