"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-ink-100 dark:border-ink-800">
      <div className="grid-surface absolute inset-0" aria-hidden />
      <div
        className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-paper dark:to-ink-900"
        aria-hidden
      />

      <Container className="relative py-24 md:py-32">
        <div className="grid gap-16 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <p className="label-mono mb-6">Planora AI — Survey No. TP/2026/01</p>
            <h1 className="text-display-xl font-medium">
              Building the future of
              <br />
              <span className="text-blueprint-500 dark:text-blueprint-300">town planning</span>
              <br />
              with AI.
            </h1>
            <p className="mt-8 max-w-lg text-lg text-ink-500 dark:text-ink-200">
              Planora AI reads India&apos;s planning law so you don&apos;t have to — layout
              scrutiny, building permissions, UDCPR and MRTP compliance, answered with
              section-level citations.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Button href="/products/town-planning-ai" size="lg">
                Try Town Planning AI
              </Button>
              <Button href="/products" variant="secondary" size="lg">
                View all products
              </Button>
            </div>
          </div>

          <BlueprintDrawing />
        </div>
      </Container>
    </section>
  );
}

/**
 * The signature element: an AI-drafted site plan drawing itself, stroke by
 * stroke, with dimension-line annotations — the drafting-table moment the
 * whole brand is built on, rendered as a real SVG animation rather than a
 * decorative gradient.
 */
function BlueprintDrawing() {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-md">
      <svg viewBox="0 0 400 400" className="h-full w-full" role="img" aria-label="Animated site plan diagram">
        <rect x="0" y="0" width="400" height="400" rx="8" className="fill-blueprint-800/[0.04] dark:fill-white/[0.03]" />

        {/* Plot boundary */}
        <motion.polygon
          points="60,320 60,90 240,60 340,140 320,320"
          fill="none"
          strokeWidth="2"
          className="stroke-blueprint-500 dark:stroke-blueprint-300"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1.6, ease: "easeInOut" }}
        />

        {/* Building footprint */}
        <motion.rect
          x="120"
          y="150"
          width="120"
          height="100"
          fill="none"
          strokeWidth="1.5"
          className="stroke-ink-700 dark:stroke-white"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1.2, delay: 1.1, ease: "easeInOut" }}
        />

        {/* Setback dimension line */}
        <motion.line
          x1="60"
          y1="335"
          x2="320"
          y2="335"
          strokeWidth="1"
          className="stroke-ink-300 dark:stroke-ink-500"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.8, delay: 2.1 }}
        />

        {[
          { x: 30, y: 200, label: "N" },
          { x: 340, y: 55, label: "§ UDCPR 6.2" },
          { x: 178, y: 335, label: "Setback 6.0m" },
        ].map((a, i) => (
          <motion.text
            key={a.label}
            x={a.x}
            y={a.y}
            className="fill-blueprint-500 font-mono text-[9px] uppercase tracking-wider dark:fill-blueprint-300"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 2.3 + i * 0.15 }}
          >
            {a.label}
          </motion.text>
        ))}
      </svg>
    </div>
  );
}
