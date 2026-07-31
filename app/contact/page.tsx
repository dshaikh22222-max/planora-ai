import type { Metadata } from "next";
import { Mail, MapPin } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { ContactForm } from "@/components/contact/ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with the Planora AI team.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <Container className="py-16">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Contact", href: "/contact" }]} />
      <div className="mt-8 grid gap-14 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <h1 className="text-display-lg font-medium">Contact</h1>
          <p className="mt-4 max-w-md text-lg text-ink-500 dark:text-ink-200">
            Sales, support, government partnerships, or press — send a message and the right
            person will follow up.
          </p>
          <div className="mt-8 flex flex-col gap-4 text-sm text-ink-600 dark:text-ink-300">
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-blueprint-500 dark:text-blueprint-300" />
              hello@planora.ai
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="h-4 w-4 text-blueprint-500 dark:text-blueprint-300" />
              Maharashtra, India
            </div>
          </div>
        </div>
        <ContactForm />
      </div>
    </Container>
  );
}
