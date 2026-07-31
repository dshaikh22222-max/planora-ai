"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/Button";

export function SignInForm({ googleEnabled }: { googleEnabled: boolean }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "sent">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    await signIn("email", { email, redirect: false });
    setStatus("sent");
  }

  if (status === "sent") {
    return (
      <div className="rounded-lg border border-blueprint-200 bg-blueprint-50 p-6 text-sm text-blueprint-700 dark:border-blueprint-800 dark:bg-blueprint-900/20 dark:text-blueprint-200">
        Check {email} for a sign-in link.
      </div>
    );
  }

  return (
    <div className="flex max-w-sm flex-col gap-4">
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="w-full rounded border border-ink-200 bg-paper px-3.5 py-2.5 text-sm outline-none focus-visible:ring-2 focus-visible:ring-blueprint-400 dark:border-ink-700 dark:bg-ink-800"
        />
        <Button type="submit" disabled={status === "loading"}>
          {status === "loading" ? "Sending…" : "Send magic link"}
        </Button>
      </form>

      {googleEnabled && (
        <>
          <div className="flex items-center gap-3 text-xs text-ink-400">
            <span className="h-px flex-1 bg-ink-100 dark:bg-ink-800" />
            or
            <span className="h-px flex-1 bg-ink-100 dark:bg-ink-800" />
          </div>
          <Button variant="secondary" onClick={() => signIn("google")}>
            Continue with Google
          </Button>
        </>
      )}
    </div>
  );
}
