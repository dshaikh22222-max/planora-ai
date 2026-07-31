import { cn } from "@/lib/utils";
import { Container } from "./Container";

export function Section({
  children,
  className,
  eyebrow,
  title,
  description,
}: {
  children?: React.ReactNode;
  className?: string;
  eyebrow?: string;
  title?: string;
  description?: string;
}) {
  return (
    <section className={cn("py-20 md:py-28", className)}>
      <Container>
        {(eyebrow || title) && (
          <div className="mb-12 max-w-2xl">
            {eyebrow && <p className="label-mono mb-3">{eyebrow}</p>}
            {title && <h2 className="text-display-md font-medium">{title}</h2>}
            {description && (
              <p className="mt-4 text-lg text-ink-500 dark:text-ink-200">{description}</p>
            )}
          </div>
        )}
        {children}
      </Container>
    </section>
  );
}
