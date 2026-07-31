const stats = [
  { value: "9", label: "AI products in the planning stack" },
  { value: "28", label: "Indian states covered by Rule Search AI" },
  { value: "100%", label: "Answers backed by section citations" },
  { value: "24/7", label: "Availability, no office hours" },
];

export function Stats() {
  return (
    <section className="border-y border-ink-100 dark:border-ink-800">
      <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-y divide-ink-100 md:grid-cols-4 md:divide-y-0 dark:divide-ink-800">
        {stats.map((stat) => (
          <div key={stat.label} className="px-6 py-10 text-center md:text-left">
            <p className="font-display text-3xl font-medium md:text-4xl">{stat.value}</p>
            <p className="mt-2 text-sm text-ink-500 dark:text-ink-300">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
