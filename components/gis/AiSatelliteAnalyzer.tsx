"use client";

import { useState } from "react";
import { Sparkles, AlertTriangle, ShieldCheck, Camera, Layers, CheckCircle2 } from "lucide-react";

export function AiSatelliteAnalyzer() {
  const [analyzing, setAnalyzing] = useState(false);
  const [detectionResult, setDetectionResult] = useState<"IDLE" | "SUCCESS">("SUCCESS");

  return (
    <div className="rounded-2xl border border-ink-100 bg-paper p-6 dark:border-ink-800 dark:bg-ink-900 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-ink-900 dark:text-white flex items-center gap-2">
            <Sparkles className="text-blueprint-500" size={18} /> AI Satellite Building Extraction & Encroachment Detection
          </h3>
          <p className="text-xs text-ink-500 dark:text-ink-400 mt-0.5">
            Automated change detection comparing Sentinel-2 & ISRO Cartosat high-res satellite imagery.
          </p>
        </div>
        <button
          onClick={() => {
            setAnalyzing(true);
            setTimeout(() => setAnalyzing(false), 1200);
          }}
          disabled={analyzing}
          className="flex items-center gap-1.5 rounded-xl bg-blueprint-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-blueprint-500 shadow-md"
        >
          {analyzing ? "Running Deep Learning Detection..." : "Run AI Scan"}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 space-y-2">
          <div className="flex justify-between items-center text-xs font-semibold text-red-600 dark:text-red-400">
            <span className="flex items-center gap-1.5"><AlertTriangle size={14} /> Nala Buffer Encroachment</span>
            <span className="font-mono text-[10px]">9m Buffer</span>
          </div>
          <p className="text-xs text-ink-300">
            Detected 1 unauthorized structure inside the 9m non-construction natural stream margin on Survey #44/2A.
          </p>
        </div>

        <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 space-y-2">
          <div className="flex justify-between items-center text-xs font-semibold text-amber-600 dark:text-amber-400">
            <span className="flex items-center gap-1.5"><Layers size={14} /> Satellite Change Flag</span>
            <span className="font-mono text-[10px]">30-Day Diff</span>
          </div>
          <p className="text-xs text-ink-300">
            +320 sq.m new roof slab detected between June 2026 & July 2026 satellite passes without building permission.
          </p>
        </div>

        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 space-y-2">
          <div className="flex justify-between items-center text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            <span className="flex items-center gap-1.5"><CheckCircle2 size={14} /> DP Reservation Clearance</span>
            <span className="font-mono text-[10px]">DP 2041</span>
          </div>
          <p className="text-xs text-ink-300">
            Parcel is 100% clear from DP Road Widening & Public Amenity reservations.
          </p>
        </div>
      </div>
    </div>
  );
}
