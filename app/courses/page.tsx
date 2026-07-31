import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { CheckoutButton } from "@/components/checkout/CheckoutButton";
import { courses } from "@/lib/courses";

export const metadata: Metadata = {
  title: "Courses",
  description: "Practical courses on UDCPR, building permissions, and development-plan literacy.",
  alternates: { canonical: "/courses" },
};

export default function CoursesPage() {
  return (
    <Container className="py-16">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Courses", href: "/courses" }]} />
      <h1 className="mt-6 text-display-lg font-medium">Courses</h1>
      <p className="mt-4 max-w-xl text-lg text-ink-500 dark:text-ink-200">
        Practical, example-driven courses taught by the team building Planora AI.
      </p>

      <div className="mt-14 flex flex-col divide-y divide-ink-100 border-y border-ink-100 dark:divide-ink-800 dark:border-ink-800">
        {courses.map((course) => {
          const price = (course.priceInPaise / 100).toLocaleString("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0,
          });
          return (
            <div key={course.slug} className="flex flex-wrap items-start justify-between gap-6 py-8">
              <div className="max-w-xl">
                <div className="flex items-center gap-3 text-xs text-ink-400 dark:text-ink-500">
                  <span className="label-mono">{course.level}</span>
                  <span>{course.duration}</span>
                </div>
                <h2 className="mt-2 font-display text-lg font-medium">{course.title}</h2>
                <p className="mt-2 text-sm text-ink-500 dark:text-ink-300">{course.description}</p>
              </div>
              <div className="flex flex-col items-end gap-3">
                <span className="font-display text-xl font-medium">{price}</span>
                <CheckoutButton kind="course" id={course.slug} label={course.title} />
              </div>
            </div>
          );
        })}
      </div>
    </Container>
  );
}
