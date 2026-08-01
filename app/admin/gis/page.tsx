"use client";

import { useState, useEffect } from "react";
import { Layers, Plus, Trash2, Globe, Eye, EyeOff, ShieldCheck, CheckCircle2, RefreshCw } from "lucide-react";

interface GisLayerRow {
  id: string;
  name: string;
  code: string;
  category: string;
  type: string;
  url?: string;
  opacity: number;
  isPublic: boolean;
}

export default function AdminGisPage() {
  const [layers, setLayers] = useState<GisLayerRow[]>([
    { id: "layer-1", name: "Development Plan 2041 Reservations", code: "dp_reservations", category: "Development Plan", type: "VECTOR", opacity: 0.8, isPublic: true },
    { id: "layer-2", name: "UDCPR Zoning Matrix (R1, R2, C, I, G)", code: "zoning", category: "Zoning", type: "VECTOR", opacity: 0.7, isPublic: true },
    { id: "layer-3", name: "High-Res ESRI World Satellite Base", code: "esri_sat", category: "Base Maps", type: "RASTER", url: "https://server.arcgisonline.com", opacity: 1.0, isPublic: true },
  ]);

  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [category, setCategory] = useState("Development Plan");
  const [type, setType] = useState("VECTOR");
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAddLayer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !code) return;

    const newLayer: GisLayerRow = {
      id: `layer-${Date.now()}`,
      name,
      code,
      category,
      type,
      url: url || undefined,
      opacity: 1.0,
      isPublic: true,
    };

    setLayers([newLayer, ...layers]);
    setName("");
    setCode("");
    setUrl("");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Layers className="text-blueprint-400" size={22} /> GIS Layer Publisher & Asset Manager
          </h1>
          <p className="text-xs text-ink-400 mt-1">
            Publish WMS/WMTS services, GeoJSON vector layers, and spatial indexes for Planora AI.
          </p>
        </div>
      </div>

      {/* Layer Publisher Form */}
      <form onSubmit={handleAddLayer} className="rounded-xl border border-white/5 bg-ink-900 p-6 space-y-4">
        <h2 className="text-sm font-semibold text-white">Publish New Spatial Layer</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-ink-300">Layer Name *</label>
            <input
              type="text"
              placeholder="e.g. Flood Line 100-Yr Return"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="mt-1 w-full rounded-lg border border-white/10 bg-ink-950 px-3 py-2 text-xs text-white outline-none focus:border-blueprint-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-ink-300">Unique Code *</label>
            <input
              type="text"
              placeholder="e.g. flood_line_100yr"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
              className="mt-1 w-full rounded-lg border border-white/10 bg-ink-950 px-3 py-2 text-xs text-white outline-none focus:border-blueprint-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-ink-300">Category *</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="mt-1 w-full rounded-lg border border-white/10 bg-ink-950 px-3 py-2 text-xs text-white outline-none focus:border-blueprint-500"
            >
              <option value="Development Plan">Development Plan</option>
              <option value="Zoning">Zoning</option>
              <option value="Environment & Hazards">Environment & Hazards</option>
              <option value="Infrastructure Utilities">Infrastructure Utilities</option>
              <option value="Base Maps">Base Maps</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          className="flex items-center gap-1.5 rounded-lg bg-blueprint-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blueprint-500 transition shadow-md"
        >
          <Plus size={14} /> Publish Layer
        </button>
      </form>

      {/* Layer Catalog Table */}
      <div className="rounded-xl border border-white/5 bg-ink-900 overflow-hidden">
        <div className="p-4 border-b border-white/5 flex justify-between items-center">
          <h3 className="text-sm font-semibold text-white">Active Spatial Layer Catalog ({layers.length})</h3>
          <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
            <CheckCircle2 size={13} /> Spatial Index Engine Healthy
          </span>
        </div>

        <div className="divide-y divide-white/5">
          {layers.map((l) => (
            <div key={l.id} className="p-4 flex items-center justify-between text-xs hover:bg-white/5 transition">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-blueprint-500/10 border border-blueprint-500/20 flex items-center justify-center text-blueprint-400">
                  <Globe size={16} />
                </div>
                <div>
                  <p className="font-semibold text-white">{l.name}</p>
                  <p className="font-mono text-[11px] text-ink-400">Code: {l.code} · Category: {l.category}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <span className="rounded bg-white/10 px-2 py-0.5 font-mono text-[10px] text-ink-300">
                  {l.type}
                </span>
                <span className="text-emerald-400 text-[11px] font-semibold">Published</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
