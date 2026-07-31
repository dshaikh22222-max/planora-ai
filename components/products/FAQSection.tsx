"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Section } from "@/components/ui/Section";

export type FAQ = { question: string; answer: string };

export function FAQSection({ faqs }: { faqs: FAQ[] }) {
  const [open, setOpen] = useState<number | null>(0);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };

  return (
    <Section eyebrow="FAQ" title="Common questions">
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="divide-y divide-ink-100 border-y border-ink-100 dark:divide-ink-800 dark:border-ink-800">
        {faqs.map((faq, i) => {
          const isOpen = open === i;
          return (
            <div key={faq.question}>
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : i)}
                aria-expanded={isOpen}
                className="flex w-full items-center justify-between gap-4 py-5 text-left"
              >
                <span className="font-display text-base font-medium">{faq.question}</span>
                <Plus
                  className={`h-4 w-4 shrink-0 text-ink-400 transition-transform ${isOpen ? "rotate-45" : ""}`}
                />
              </button>
              {isOpen && (
                <p className="pb-5 text-sm text-ink-500 dark:text-ink-300">{faq.answer}</p>
              )}
            </div>
          );
        })}
      </div>
    </Section>
  );
}
