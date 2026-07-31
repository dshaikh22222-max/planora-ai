import type { Metadata } from "next";
import { MessageSquare, Users, BookOpen } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Community",
  description: "Join the Planora AI community of planners, architects, and developers.",
  alternates: { canonical: "/community" },
};

const channels = [
  {
    icon: MessageSquare,
    title: "Discussion forum",
    description: "Ask questions, share templates, and compare notes with other planners and consultants.",
    cta: "Join the forum",
  },
  {
    icon: Users,
    title: "Monthly office hours",
    description: "A live session with the Planora AI team covering product updates and open Q&A.",
    cta: "See the schedule",
  },
  {
    icon: BookOpen,
    title: "Contributor program",
    description: "Help expand regulation coverage for your state and get free Pro access in return.",
    cta: "Apply to contribute",
  },
];

export default function CommunityPage() {
  return (
    <Container className="py-16">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Community", href: "/community" }]} />
      <h1 className="mt-6 text-display-lg font-medium">Community</h1>
      <p className="mt-4 max-w-xl text-lg text-ink-500 dark:text-ink-200">
        Planners, architects, and developers building with Planora AI.
      </p>

      <div className="mt-14 grid gap-6 sm:grid-cols-3">
        {channels.map((c) => (
          <div key={c.title} className="flex flex-col rounded-lg border border-ink-100 bg-paper p-6 dark:border-ink-800 dark:bg-ink-800/30">
            <c.icon className="h-5 w-5 text-blueprint-500 dark:text-blueprint-300" />
            <h2 className="mt-4 font-display text-base font-medium">{c.title}</h2>
            <p className="mt-2 flex-1 text-sm text-ink-500 dark:text-ink-300">{c.description}</p>
            <Button href="/contact" variant="secondary" size="sm" className="mt-5 w-fit">
              {c.cta}
            </Button>
          </div>
        ))}
      </div>
    </Container>
  );
}
