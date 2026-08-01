"use client";

import { useState } from "react";
import { Box, Sun, Compass, Eye, ShieldAlert, Sparkles, Play, RotateCcw } from "lucide-react";

export function DigitalTwin3D() {
  const [sunHour, setSunHour] = useState<number>(14); // 2:00 PM
  const [shadowLength, setShadowLength] = useState<number>(12); // meters
  const [viewAngle, setViewAngle] = useState<"ISOMETRIC" | "TOP_DOWN" | "STREET_LEVEL">("ISOMETRIC");

  const handleHourChange = (hr: number) => {
    setSunHour(hr);
    // Shadow length varies based on sun hour (shortest at noon 12:00)
    const diff = Math.abs(12 - hr);
    setShadowLength(Math.round(4 + diff * 4.5));
  };

  return (
    <div className="rounded-2xl border border-ink-100 bg-paper p-6 dark:border-ink-800 dark:bg-ink-900 space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
        <div>
          <h3 className="text-base font-semibold text-ink-900 dark:text-white flex items-center gap-2">
            <Box className="text-blueprint-500" size={18} /> 3D Digital Twin & Sunlight / Shadow Simulator
          </h3>
          <p className="text-xs text-ink-500 dark:text-ink-400 mt-0.5">
            Real-time 3D building height extrusion, shadow impact analysis, and skyline view simulation.
          </p>
        </div>

        <div className="flex items-center gap-1.5 bg-ink-950 p-1 rounded-xl border border-white/10 text-xs">
          {(["ISOMETRIC", "TOP_DOWN", "STREET_LEVEL"] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setViewAngle(mode)}
              className={`px-3 py-1 rounded-lg transition font-medium ${
                viewAngle === mode ? "bg-blueprint-600 text-white shadow-sm" : "text-ink-400 hover:text-white"
              }`}
            >
              {mode.replace("_", " ")}
            </button>
          ))}
        </div>
      </div>

      {/* 3D Canvas Canvas Visual Simulation */}
      <div className="relative aspect-video w-full rounded-xl border border-blueprint-500/30 bg-ink-950/95 overflow-hidden flex items-center justify-center p-6 text-center shadow-2xl">
        <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:20px_20px] opacity-30"></div>

        {/* 3D Extruded Building Cubes Graphic */}
        <div className="relative z-10 flex items-center justify-center gap-8">
          {/* Building A (24m Tower) */}
          <div className="relative group">
            <div className="w-24 h-36 rounded-lg bg-gradient-to-tr from-blueprint-700 via-blueprint-500 to-blueprint-400 shadow-2xl border border-white/20 flex flex-col justify-between p-2">
              <span className="text-[10px] font-mono text-white/80 font-bold">Block A (24m)</span>
              <div className="grid grid-cols-3 gap-1">
                {Array.from({ length: 9 }).map((_, i) => (
                  <div key={i} className="h-2 bg-yellow-300/60 rounded-xs"></div>
                ))}
              </div>
            </div>
            {/* Simulated Dynamic Shadow Projection */}
            <div
              className="absolute bottom-0 left-full bg-black/50 backdrop-blur-xs transition-all duration-300 pointer-events-none rounded-r-lg origin-left"
              style={{
                width: `${shadowLength * 4}px`,
                height: "144px",
                transform: `skewX(${sunHour < 12 ? -25 : 25}deg)`,
              }}
            ></div>
          </div>

          {/* Building B (45m High-rise) */}
          <div className="relative">
            <div className="w-28 h-48 rounded-lg bg-gradient-to-tr from-emerald-700 via-emerald-500 to-emerald-400 shadow-2xl border border-white/20 flex flex-col justify-between p-2">
              <span className="text-[10px] font-mono text-white/80 font-bold">Tower B (45m)</span>
              <div className="grid grid-cols-4 gap-1">
                {Array.from({ length: 16 }).map((_, i) => (
                  <div key={i} className="h-2 bg-blue-200/50 rounded-xs"></div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Sunlight Position Indicator */}
        <div className="absolute top-4 left-4 z-20 flex items-center gap-2 rounded-lg border border-yellow-500/30 bg-yellow-500/10 px-3 py-1.5 text-xs text-yellow-300 font-mono">
          <Sun size={15} className="animate-spin-slow" /> Sun Position: {sunHour}:00 IST · Shadow Cast: {shadowLength}m
        </div>
      </div>

      {/* Sun Position Time Slider */}
      <div className="flex items-center gap-4 bg-ink-950/80 p-4 rounded-xl border border-white/10 text-xs">
        <span className="text-ink-400 font-mono">08:00 AM</span>
        <input
          type="range"
          min="8"
          max="18"
          step="1"
          value={sunHour}
          onChange={(e) => handleHourChange(Number(e.target.value))}
          className="flex-1 h-2 accent-yellow-400 cursor-pointer"
        />
        <span className="text-ink-400 font-mono">06:00 PM</span>
      </div>
    </div>
  );
}
