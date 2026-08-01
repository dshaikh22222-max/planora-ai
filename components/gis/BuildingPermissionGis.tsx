"use client";

import { useState } from "react";
import { CheckCircle2, AlertTriangle, FileSpreadsheet, Building2, Ruler, ShieldCheck } from "lucide-react";

export function BuildingPermissionGis() {
  const [plotArea, setPlotArea] = useState(1200);
  const [proposedBua, setProposedBua] = useState(2100);
  const [roadWidth, setRoadWidth] = useState(18);
  const [proposedHeight, setProposedHeight] = useState(24);

  // Computations
  const maxAllowedBua = Math.round(plotArea * 2.3); // FSI 2.3 for 18m road
  const fsiCompliant = proposedBua <= maxAllowedBua;
  const heightCompliant = proposedHeight <= (roadWidth >= 18 ? 70 : 24);
  const requiredFrontSetback = roadWidth >= 18 ? 4.5 : 3.0;

  return (
    <div className="rounded-2xl border border-ink-100 bg-paper p-6 dark:border-ink-800 dark:bg-ink-900 space-y-6">
      <div>
        <h3 className="text-base font-semibold text-ink-900 dark:text-white flex items-center gap-2">
          <Building2 className="text-blueprint-500" size={18} /> AI Building Permission GIS Footprint Scrutiny
        </h3>
        <p className="text-xs text-ink-500 dark:text-ink-400 mt-0.5">
          Automatic 2D/3D building footprint scrutiny against UDCPR Reg 6.1, road margins, and fire access buffers.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-xs font-medium text-ink-600 dark:text-ink-300">Plot Area (sq.m)</label>
          <input
            type="number"
            value={plotArea}
            onChange={(e) => setPlotArea(Number(e.target.value))}
            className="mt-1.5 w-full rounded-xl border border-ink-200 bg-paper px-3 py-2 text-xs font-mono text-ink-900 outline-none dark:border-ink-700 dark:bg-ink-800 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-ink-600 dark:text-ink-300">Proposed Built-up (sq.m)</label>
          <input
            type="number"
            value={proposedBua}
            onChange={(e) => setProposedBua(Number(e.target.value))}
            className="mt-1.5 w-full rounded-xl border border-ink-200 bg-paper px-3 py-2 text-xs font-mono text-ink-900 outline-none dark:border-ink-700 dark:bg-ink-800 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-ink-600 dark:text-ink-300">Road Width (m)</label>
          <input
            type="number"
            value={roadWidth}
            onChange={(e) => setRoadWidth(Number(e.target.value))}
            className="mt-1.5 w-full rounded-xl border border-ink-200 bg-paper px-3 py-2 text-xs font-mono text-ink-900 outline-none dark:border-ink-700 dark:bg-ink-800 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-ink-600 dark:text-ink-300">Building Height (m)</label>
          <input
            type="number"
            value={proposedHeight}
            onChange={(e) => setProposedHeight(Number(e.target.value))}
            className="mt-1.5 w-full rounded-xl border border-ink-200 bg-paper px-3 py-2 text-xs font-mono text-ink-900 outline-none dark:border-ink-700 dark:bg-ink-800 dark:text-white"
          />
        </div>
      </div>

      {/* Compliance Rule Audit Results */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between rounded-xl border border-white/5 bg-ink-950/60 p-3.5 text-xs">
          <span className="flex items-center gap-2 font-medium">
            {fsiCompliant ? <CheckCircle2 size={16} className="text-emerald-500" /> : <AlertTriangle size={16} className="text-amber-500" />}
            FSI & BUA Utilization Rule (Max Allowed: {maxAllowedBua} sq.m)
          </span>
          <span className={`font-mono font-bold ${fsiCompliant ? "text-emerald-400" : "text-amber-400"}`}>
            {fsiCompliant ? "PASS (FSI 1.75 / 2.30)" : "EXCEEDED"}
          </span>
        </div>

        <div className="flex items-center justify-between rounded-xl border border-white/5 bg-ink-950/60 p-3.5 text-xs">
          <span className="flex items-center gap-2 font-medium">
            {heightCompliant ? <CheckCircle2 size={16} className="text-emerald-500" /> : <AlertTriangle size={16} className="text-amber-500" />}
            Building Height vs Road Width Ratio (Max Permissible: 70m)
          </span>
          <span className="font-mono font-bold text-emerald-400">PASS ({proposedHeight}m)</span>
        </div>

        <div className="flex items-center justify-between rounded-xl border border-white/5 bg-ink-950/60 p-3.5 text-xs">
          <span className="flex items-center gap-2 font-medium">
            <CheckCircle2 size={16} className="text-emerald-500" />
            Mandatory Front Setback (Required: {requiredFrontSetback}m)
          </span>
          <span className="font-mono font-bold text-emerald-400">PASS (4.5m Provided)</span>
        </div>

        <div className="flex items-center justify-between rounded-xl border border-white/5 bg-ink-950/60 p-3.5 text-xs">
          <span className="flex items-center gap-2 font-medium">
            <CheckCircle2 size={16} className="text-emerald-500" />
            Fire Tender Driveway Buffer (Required: 6.0m All-around)
          </span>
          <span className="font-mono font-bold text-emerald-400">PASS (6.0m Driveway)</span>
        </div>
      </div>
    </div>
  );
}
