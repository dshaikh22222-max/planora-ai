"use client";

import { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, Zap, AlertCircle, ArrowRight, Lock } from "lucide-react";
import { z } from "zod";

const LoginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

export function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get("next") ?? "/admin";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const parsed = LoginSchema.safeParse({ email, password });
    if (!parsed.success) {
      const issues = parsed.error.issues;
      setError(issues[0]?.message ?? "Invalid input");
      return;
    }

    startTransition(async () => {
      try {
        const res = await fetch("/api/admin/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        const data = await res.json();

        if (!res.ok) {
          setError(data.error?.message ?? "Login failed");
          return;
        }

        router.push(nextPath);
        router.refresh();
      } catch {
        setError("Network error. Please try again.");
      }
    });
  }

  return (
    <div className="relative flex min-h-screen overflow-hidden bg-ink-950">
      {/* Blueprint grid background */}
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(31,95,168,0.12) 1px, transparent 1px), linear-gradient(to bottom, rgba(31,95,168,0.12) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
      <div className="pointer-events-none absolute -left-32 -top-32 h-[600px] w-[600px] rounded-full bg-blueprint-700/10 blur-[100px]" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 h-[500px] w-[500px] rounded-full bg-blueprint-900/20 blur-[80px]" />

      {/* ── Left panel — brand ── */}
      <div className="relative hidden w-1/2 flex-col justify-between p-14 lg:flex">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blueprint-600 shadow-xl shadow-blueprint-900/60">
            <Zap size={20} className="text-white" />
          </div>
          <div>
            <p className="text-lg font-bold text-white">Planora AI</p>
            <p className="text-[11px] font-mono uppercase tracking-widest text-blueprint-400">
              Admin Console
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-blueprint-700/40 bg-blueprint-900/30 px-4 py-1.5">
            <Lock size={12} className="text-blueprint-400" />
            <span className="text-xs text-blueprint-300">Secure admin access</span>
          </div>

          <h1 className="text-4xl font-bold leading-tight tracking-tight text-white">
            Welcome back,
            <br />
            <span className="bg-gradient-to-r from-blueprint-300 to-blueprint-500 bg-clip-text text-transparent">
              Admin
            </span>
          </h1>

          <p className="max-w-xs text-sm leading-relaxed text-ink-400">
            Manage products, blog posts, users, subscriptions, and analytics
            for Planora AI — all in one secure dashboard.
          </p>

          <div className="flex flex-wrap gap-2">
            {[
              "Product CMS", "Blog Editor", "Order Management",
              "Analytics", "Razorpay Integration", "SEO Tools",
            ].map((f) => (
              <span
                key={f}
                className="rounded-md border border-white/8 bg-white/5 px-2.5 py-1 text-xs text-ink-400"
              >
                {f}
              </span>
            ))}
          </div>
        </div>

        <p className="text-xs text-ink-700">
          This area is restricted. Unauthorized access is prohibited and logged.
        </p>
      </div>

      {/* ── Right panel — form ── */}
      <div className="flex flex-1 items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="mb-10 flex items-center gap-3 lg:hidden">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blueprint-600">
              <Zap size={18} className="text-white" />
            </div>
            <span className="text-base font-bold text-white">Planora AI Admin</span>
          </div>

          <div className="rounded-2xl border border-white/8 bg-white/4 p-8 shadow-2xl shadow-black/40 backdrop-blur-xl">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white">Sign in</h2>
              <p className="mt-1 text-sm text-ink-500">
                Enter your admin credentials to continue.
              </p>
            </div>

            {error && (
              <div className="mb-6 flex items-start gap-3 rounded-xl border border-rose-500/20 bg-rose-500/10 px-4 py-3">
                <AlertCircle size={16} className="mt-0.5 shrink-0 text-rose-400" />
                <p className="text-sm text-rose-300">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="admin-email"
                  className="mb-2 block text-xs font-medium uppercase tracking-widest text-ink-500"
                >
                  Email
                </label>
                <input
                  id="admin-email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@planora.ai"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-ink-600 outline-none transition focus:border-blueprint-500 focus:ring-2 focus:ring-blueprint-500/20"
                />
              </div>

              <div>
                <label
                  htmlFor="admin-password"
                  className="mb-2 block text-xs font-medium uppercase tracking-widest text-ink-500"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    id="admin-password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Your admin password"
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 pr-12 text-sm text-white placeholder-ink-600 outline-none transition focus:border-blueprint-500 focus:ring-2 focus:ring-blueprint-500/20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-500 hover:text-ink-300 transition"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isPending}
                id="admin-login-submit"
                className="group flex w-full items-center justify-center gap-2 rounded-xl bg-blueprint-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-blueprint-900/50 transition hover:bg-blueprint-500 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isPending ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Signing in…
                  </>
                ) : (
                  <>
                    Sign in to Admin
                    <ArrowRight
                      size={15}
                      className="transition group-hover:translate-x-0.5"
                    />
                  </>
                )}
              </button>
            </form>
          </div>

          <p className="mt-6 text-center text-[11px] text-ink-700">
            This session is protected by HMAC-SHA256 signatures and auto-expires in 8 hours.
          </p>
        </div>
      </div>
    </div>
  );
}
