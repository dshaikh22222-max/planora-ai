"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";

export function BookingForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "submitted" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg(null);

    const form = new FormData(e.currentTarget);
    const payload = {
      name: form.get("name"),
      email: form.get("email"),
      organization: form.get("organization"),
      topic: form.get("topic"),
      preferredDate: form.get("preferredDate"),
    };

    try {
      const res = await fetch("/api/consulting", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong.");
      setStatus("submitted");
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  if (status === "submitted") {
    return (
      <div className="rounded-lg border border-blueprint-200 bg-blueprint-50 p-6 text-sm text-blueprint-700 dark:border-blueprint-800 dark:bg-blueprint-900/20 dark:text-blueprint-200">
        Request received. We&apos;ll follow up by email to confirm a time.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Name" name="name" type="text" required />
        <Field label="Email" name="email" type="email" required />
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Organization (optional)" name="organization" type="text" />
        <Field label="Preferred date" name="preferredDate" type="date" />
      </div>
      <div>
        <label htmlFor="topic" className="mb-1.5 block text-sm text-ink-700 dark:text-ink-200">
          What would you like to discuss?
        </label>
        <textarea
          id="topic"
          name="topic"
          required
          rows={4}
          className="w-full rounded border border-ink-200 bg-paper px-3.5 py-2.5 text-sm outline-none focus-visible:ring-2 focus-visible:ring-blueprint-400 dark:border-ink-700 dark:bg-ink-800"
        />
      </div>
      {status === "error" && errorMsg && <p className="text-sm text-stamp-500">{errorMsg}</p>}
      <Button type="submit" size="lg" className="w-fit" disabled={status === "loading"}>
        {status === "loading" ? "Sending…" : "Request a call"}
      </Button>
    </form>
  );
}

function Field({ label, name, type, required }: { label: string; name: string; type: string; required?: boolean }) {
  return (
    <div>
      <label htmlFor={name} className="mb-1.5 block text-sm text-ink-700 dark:text-ink-200">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        className="w-full rounded border border-ink-200 bg-paper px-3.5 py-2.5 text-sm outline-none focus-visible:ring-2 focus-visible:ring-blueprint-400 dark:border-ink-700 dark:bg-ink-800"
      />
    </div>
  );
}
