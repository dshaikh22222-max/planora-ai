"use client";

import { useState } from "react";
import { Layers, Eye, EyeOff, Sliders, CheckCircle2, ShieldAlert } from "lucide-react";

export interface PlanningLayer {
  id: string;
  name: string;
  category: "Development Plan" | "Zoning" | "Environment & Hazards" | "Infrastructure Utilities";
  description: string;
  color: string;
  visible: boolean;
  opacity: number;
}

export const INITIAL_PLANNING_LAYERS: PlanningLayer[] = [
  { id: "dp_reservations", name: "DP Land Reservations (Roads, Amenity, Parks)", category: "Development Plan", description: "Reservations for public roads, schools, gardens, and hospitals under DP 2041.", color: "#ef4444", visible: true, opacity: 0.8 },
  { id: "zoning_r1_r2", name: "Zoning Classification (R1, R2, Commercial, Industrial)", category: "Zoning", description: "Land use zones regulating permissible FSI and building heights.", color: "#3b82f6", visible: true, opacity: 0.7 },
  { id: "nalas_rivers", name: "Natural Nalas & Mula-Mutha River Margins", category: "Environment & Hazards", description: "Mandatory 9m, 15m, and 30m non-construction buffer along natural streams.", color: "#06b6d4", visible: true, opacity: 0.9 },
  { id: "flood_blue_red", name: "Flood Blue Line & Red Line Hazards", category: "Environment & Hazards", description: "Prohibited development zones based on 25-year and 100-year flood levels.", color: "#dc2626", visible: true, opacity: 0.8 },
  { id: "ht_lines", name: "High Tension (HT / LT) Power Line Buffer", category: "Infrastructure Utilities", description: "12m / 24m statutory clearance from 132kV / 220kV transmission lines.", color: "#eab308", visible: true, opacity: 0.8 },
  { id: "airport_funnel", name: "Airport Obstacle Limitation Surface (OLS)", category: "Zoning", description: "Maximum height restrictions under IAF / AAI funnel clearance.", color: "#a855f7", visible: false, opacity: 0.5 },
  { id: "heritage_buffer", name: "Heritage Zone 100m Restriction Buffer", category: "Zoning", description: "ASI & Municipal Heritage Conservation Committee guidelines.", color: "#f97316", visible: false, opacity: 0.6 },
];

export function PlanningLayersManager() {
  const [layers, setLayers] = useState<PlanningLayer[]>(INITIAL_PLANNING_LAYERS);

  const toggleLayer = (id: string) => {
    setLayers((prev) =>
      prev.map((l) => (l.id === id ? { ...l, visible: !l.visible } : l))
    );
  };

  const updateOpacity = (id: string, opacity: number) => {
    setLayers((prev) =>
      prev.map((l) => (l.id === id ? { ...l, opacity } : l))
    );
  };

  return (
    <div className="rounded-2xl border border-ink-100 bg-paper p-6 dark:border-ink-800 dark:bg-ink-900 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-ink-900 dark:text-white flex items-center gap-2">
            <Layers className="text-blueprint-500" size={18} /> Statutory Planning & GIS Layers
          </h3>
          <p className="text-xs text-ink-500 dark:text-ink-400 mt-0.5">
            Toggle Development Plan (DP) layers, environmental buffers, and utility corridors.
          </p>
        </div>
        <span className="rounded-full bg-blueprint-500/10 px-3 py-1 text-xs font-mono font-semibold text-blueprint-600 dark:text-blueprint-300">
          {layers.filter((l) => l.visible).length} / {layers.length} Active
        </span>
      </div>

      <div className="space-y-3">
        {layers.map((layer) => (
          <div
            key={layer.id}
            className={`rounded-xl border p-4 transition ${
              layer.visible
                ? "border-blueprint-500/30 bg-blueprint-500/5 dark:bg-ink-950/60"
                : "border-ink-100 bg-paper/40 dark:border-ink-800/60 opacity-60"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span
                  className="h-3.5 w-3.5 rounded-full shrink-0 shadow-sm"
                  style={{ backgroundColor: layer.color }}
                />
                <div>
                  <h4 className="text-xs font-semibold text-ink-900 dark:text-white">
                    {layer.name}
                  </h4>
                  <p className="text-[11px] text-ink-500 dark:text-ink-400">
                    {layer.description}
                  </p>
                </div>
              </div>

              <button
                onClick={() => toggleLayer(layer.id)}
                className={`p-1.5 rounded-lg border transition ${
                  layer.visible
                    ? "border-blueprint-500/40 bg-blueprint-500/20 text-blueprint-500"
                    : "border-ink-200 bg-paper text-ink-400 dark:border-ink-700 dark:bg-ink-800"
                }`}
              >
                {layer.visible ? <Eye size={15} /> : <EyeOff size={15} />}
              </button>
            </div>

            {layer.visible && (
              <div className="mt-3 flex items-center gap-3 border-t border-white/5 pt-2.5 text-xs text-ink-400">
                <Sliders size={13} />
                <span>Opacity: {Math.round(layer.opacity * 100)}%</span>
                <input
                  type="range"
                  min="0.1"
                  max="1.0"
                  step="0.1"
                  value={layer.opacity}
                  onChange={(e) => updateOpacity(layer.id, parseFloat(e.target.value))}
                  className="h-1.5 w-28 accent-blueprint-500"
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
