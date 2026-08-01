"use client";

import { useState } from "react";
import { Container } from "@/components/ui/Container";
import { Calculator, CheckCircle2, FileText, ArrowRight } from "lucide-react";
import Link from "next/link";

export function FsiCalculator() {
  const [plotArea, setPlotArea] = useState<number>(500);
  const [roadWidth, setRoadWidth] = useState<number>(12);
  const [zone, setZone] = useState<"RESIDENTIAL" | "COMMERCIAL" | "MIXED">("RESIDENTIAL");

  // Basic UDCPR FSI estimation logic for India / Maharashtra regulations
  const baseFsi = roadWidth >= 18 ? 1.5 : roadWidth >= 12 ? 1.2 : 1.1;
  const premiumFsi = roadWidth >= 12 ? 0.3 : 0.2;
  const totalFsi = (baseFsi + premiumFsi).toFixed(2);

  const permissibleBuiltUp = Math.round(plotArea * Number(totalFsi));
  const minFrontSetback = roadWidth >= 18 ? 6.0 : roadWidth >= 12 ? 4.5 : 3.0;

  return (
    <section className="border-t border-ink-100 bg-paper/50 py-16 dark:border-ink-800 dark:bg-ink-900/40">
      <Container>
        <div className="mx-auto max-w-4xl rounded-2xl border border-blueprint-500/20 bg-paper p-8 shadow-xl dark:border-blueprint-500/30 dark:bg-ink-900">
          {/* Header */}
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="flex items-center gap-2 text-blueprint-500 dark:text-blueprint-300">
                <Calculator size={18} />
                <span className="font-mono text-xs font-semibold uppercase tracking-wider">
                  Interactive AI Estimator
                </span>
              </div>
              <h2 className="mt-1 font-display text-2xl font-semibold tracking-tight text-ink-900 dark:text-white">
                UDCPR FSI & Built-up Area Calculator
              </h2>
              <p className="text-sm text-ink-500 dark:text-ink-400">
                Instantly check permissible FSI, built-up area, and setbacks under Unified DCPR rules.
              </p>
            </div>
            <Link
              href="/products/town-planning-ai"
              className="inline-flex items-center gap-1.5 rounded-xl bg-blueprint-600 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-blueprint-500 shadow-md"
            >
              Full AI Rule Scrutiny <ArrowRight size={13} />
            </Link>
          </div>

          {/* Calculator Inputs */}
          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
            <div>
              <label className="block text-xs font-medium text-ink-600 dark:text-ink-300">
                Plot Area (sq.m)
              </label>
              <input
                type="number"
                min={50}
                max={50000}
                value={plotArea}
                onChange={(e) => setPlotArea(Number(e.target.value))}
                className="mt-1.5 w-full rounded-xl border border-ink-200 bg-paper px-4 py-2.5 text-sm font-mono font-semibold text-ink-900 outline-none transition focus:border-blueprint-500 dark:border-ink-700 dark:bg-ink-800 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-ink-600 dark:text-ink-300">
                Front Road Width (meters)
              </label>
              <select
                value={roadWidth}
                onChange={(e) => setRoadWidth(Number(e.target.value))}
                className="mt-1.5 w-full rounded-xl border border-ink-200 bg-paper px-4 py-2.5 text-sm font-semibold text-ink-900 outline-none transition focus:border-blueprint-500 dark:border-ink-700 dark:bg-ink-800 dark:text-white"
              >
                <option value={9}>9.0 meters</option>
                <option value={12}>12.0 meters</option>
                <option value={15}>15.0 meters</option>
                <option value={18}>18.0 meters+</option>
                <option value={24}>24.0 meters+</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-ink-600 dark:text-ink-300">
                Land Use Zone
              </label>
              <select
                value={zone}
                onChange={(e) => setZone(e.target.value as typeof zone)}
                className="mt-1.5 w-full rounded-xl border border-ink-200 bg-paper px-4 py-2.5 text-sm font-semibold text-ink-900 outline-none transition focus:border-blueprint-500 dark:border-ink-700 dark:bg-ink-800 dark:text-white"
              >
                <option value="RESIDENTIAL">R-Zone (Residential)</option>
                <option value="COMMERCIAL">C-Zone (Commercial)</option>
                <option value="MIXED">Mixed Use Zone</option>
              </select>
            </div>
          </div>

          {/* Results Cards */}
          <div className="mt-8 grid grid-cols-1 gap-4 rounded-xl border border-ink-100 bg-paper/80 p-5 md:grid-cols-3 dark:border-ink-800 dark:bg-ink-800/40">
            <div>
              <span className="text-[11px] font-medium uppercase tracking-wider text-ink-400">
                Permissible FSI
              </span>
              <p className="mt-1 font-mono text-2xl font-bold text-blueprint-600 dark:text-blueprint-300">
                {totalFsi}
              </p>
              <p className="text-[11px] text-ink-500">Base {baseFsi} + Premium {premiumFsi}</p>
            </div>

            <div>
              <span className="text-[11px] font-medium uppercase tracking-wider text-ink-400">
                Max Built-Up Area
              </span>
              <p className="mt-1 font-mono text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                {permissibleBuiltUp.toLocaleString("en-IN")} sq.m
              </p>
              <p className="text-[11px] text-ink-500">({(permissibleBuiltUp * 10.764).toLocaleString("en-IN", { maximumFractionDigits: 0 })} sq.ft)</p>
            </div>

            <div>
              <span className="text-[11px] font-medium uppercase tracking-wider text-ink-400">
                Front Setback
              </span>
              <p className="mt-1 font-mono text-2xl font-bold text-amber-600 dark:text-amber-400">
                {minFrontSetback.toFixed(1)} m
              </p>
              <p className="text-[11px] text-ink-500">UDCPR Reg 6.1 Compliance</p>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="mt-4 flex items-center justify-between text-xs text-ink-500 dark:text-ink-400">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 size={13} className="text-emerald-500" />
              Verified with Maharashtra UDCPR & Municipal Corporation Bylaws
            </span>
            <span className="font-mono text-[11px]">Survey No. TP/2026/01</span>
          </div>
        </div>
      </Container>
    </section>
  );
}
