"use client";

import { useState } from "react";
import {
  SAMPLE_LAND_PARCELS,
  calculateDistanceMeters,
  calculatePolygonAreaSqM,
  generateBufferPolygon,
  PolygonBoundary,
} from "@/lib/gis/spatial-engine";
import {
  Layers,
  MapPin,
  Compass,
  Maximize,
  Ruler,
  Eye,
  EyeOff,
  Search,
  Download,
  Bookmark,
  Share2,
  ZoomIn,
  ZoomOut,
  Map as MapIcon,
  Sun,
  ShieldAlert,
  Sliders,
  CheckCircle2,
  Info,
} from "lucide-react";

export type BaseMapType = "SATELLITE" | "OPENSTREETMAP" | "ESRI_IMAGERY" | "BHUVAN" | "TERRAIN" | "HYBRID";

interface GisMapViewerProps {
  onSelectParcel?: (parcel: PolygonBoundary) => void;
}

export function GisMapViewer({ onSelectParcel }: GisMapViewerProps) {
  const [baseMap, setBaseMap] = useState<BaseMapType>("SATELLITE");
  const [zoomLevel, setZoomLevel] = useState<number>(16);
  const [center, setCenter] = useState({ lat: 18.5082, lng: 73.8123 }); // Pune Kothrud
  const [activeLayers, setActiveLayers] = useState<Record<string, boolean>>({
    dp_reservations: true,
    zoning: true,
    nalas_rivers: true,
    road_network: true,
    ht_lines: true,
    flood_zones: true,
  });

  const defaultParcel = SAMPLE_LAND_PARCELS[0] ?? null;
  const [selectedParcel, setSelectedParcel] = useState<PolygonBoundary | null>(defaultParcel);
  const [measureMode, setMeasureMode] = useState<"NONE" | "DISTANCE" | "AREA">("NONE");
  const [bufferRadius, setBufferRadius] = useState<number>(50); // 50m buffer
  const [showBuffer, setShowBuffer] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredParcels = SAMPLE_LAND_PARCELS.filter(
    (p) =>
      p.surveyNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.village.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.ownerName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectParcel = (p: PolygonBoundary) => {
    setSelectedParcel(p);
    if (p.coordinates[0]) {
      setCenter({ lat: p.coordinates[0][1], lng: p.coordinates[0][0] });
    }
    if (onSelectParcel) onSelectParcel(p);
  };

  return (
    <div className="relative h-[680px] w-full overflow-hidden rounded-2xl border border-ink-200 bg-ink-950 shadow-2xl dark:border-ink-800 text-white">
      {/* ── Top Bar Control Panel ───────────────────────────── */}
      <div className="absolute top-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/10 bg-ink-900/85 p-3 backdrop-blur shadow-lg">
        {/* Search Bar */}
        <div className="relative min-w-[260px] flex-1">
          <Search className="absolute left-3 top-2.5 text-ink-400" size={15} />
          <input
            type="text"
            placeholder="Search Survey No / Gat No / Owner (e.g. 44/2A)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-white/10 bg-ink-950/80 pl-9 pr-3 py-1.5 text-xs text-white placeholder-ink-400 outline-none transition focus:border-blueprint-500"
          />
          {searchQuery && filteredParcels.length > 0 && (
            <div className="absolute top-10 left-0 right-0 z-30 rounded-lg border border-white/10 bg-ink-900 py-1.5 shadow-xl max-h-48 overflow-y-auto">
              {filteredParcels.map((p) => (
                <button
                  key={p.id}
                  onClick={() => {
                    handleSelectParcel(p);
                    setSearchQuery("");
                  }}
                  className="w-full text-left px-3 py-1.5 text-xs hover:bg-white/10 flex justify-between"
                >
                  <span>Survey {p.surveyNo} ({p.village})</span>
                  <span className="text-[10px] font-mono text-blueprint-400">{p.zone}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Basemap Switcher */}
        <div className="flex items-center gap-1 bg-ink-950/80 p-1 rounded-lg border border-white/10">
          {(["SATELLITE", "OPENSTREETMAP", "ESRI_IMAGERY", "BHUVAN", "TERRAIN"] as BaseMapType[]).map((bm) => (
            <button
              key={bm}
              onClick={() => setBaseMap(bm)}
              className={`px-2.5 py-1 text-[11px] font-medium rounded-md transition ${
                baseMap === bm
                  ? "bg-blueprint-600 text-white shadow-sm"
                  : "text-ink-300 hover:bg-white/10"
              }`}
            >
              {bm === "SATELLITE" ? "Google Satellite" : bm === "OPENSTREETMAP" ? "OSM" : bm === "ESRI_IMAGERY" ? "ESRI World" : bm === "BHUVAN" ? "Bhuvan ISRO" : "Terrain"}
            </button>
          ))}
        </div>

        {/* Measure Tools & Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMeasureMode(measureMode === "DISTANCE" ? "NONE" : "DISTANCE")}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg border text-xs transition ${
              measureMode === "DISTANCE" ? "border-amber-500 bg-amber-500/20 text-amber-300" : "border-white/10 bg-ink-950/80 text-ink-200 hover:bg-white/10"
            }`}
          >
            <Ruler size={13} /> Measure Dist
          </button>

          <button
            onClick={() => setShowBuffer(!showBuffer)}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg border text-xs transition ${
              showBuffer ? "border-emerald-500 bg-emerald-500/20 text-emerald-300" : "border-white/10 bg-ink-950/80 text-ink-200 hover:bg-white/10"
            }`}
          >
            <Sliders size={13} /> {showBuffer ? "50m Buffer Active" : "50m Buffer"}
          </button>
        </div>
      </div>

      {/* ── Interactive Vector Canvas Display ───────────────────── */}
      <div className="relative h-full w-full bg-[#0a0f1d] overflow-hidden flex items-center justify-center">
        {/* Simulated Map Tile Grid & Satellite Texture */}
        <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-40"></div>

        {/* Dynamic Basemap Overlay Graphic */}
        <div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none">
          <div className="w-[800px] h-[800px] rounded-full border border-blueprint-500/20 animate-pulse"></div>
          <div className="w-[500px] h-[500px] rounded-full border border-blueprint-500/30"></div>
        </div>

        {/* Active GIS Layer Elements */}
        <div className="relative z-10 w-[550px] h-[380px] rounded-2xl border border-blueprint-500/30 bg-ink-900/60 p-6 backdrop-blur shadow-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <MapPin size={18} className="text-blueprint-400" />
              <div>
                <h3 className="text-sm font-bold text-white">
                  Survey No. {selectedParcel?.surveyNo} — {selectedParcel?.village}
                </h3>
                <p className="text-[11px] text-ink-400 font-mono">
                  Gat No: {selectedParcel?.gatNo ?? "128"} · CTS No: {selectedParcel?.ctsNo ?? "892"}
                </p>
              </div>
            </div>
            <span className="rounded-full bg-blueprint-500/20 px-3 py-1 text-xs font-mono text-blueprint-300 font-semibold border border-blueprint-500/30">
              Zone: {selectedParcel?.zone}
            </span>
          </div>

          {/* Parcel Stats & Geometry */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="rounded-xl border border-white/5 bg-ink-950/60 p-3">
              <span className="text-[10px] uppercase text-ink-400">Total Plot Area</span>
              <p className="text-base font-mono font-bold text-emerald-400">
                {selectedParcel?.areaSqM.toLocaleString("en-IN")} sq.m
              </p>
              <p className="text-[10px] text-ink-400">({(selectedParcel ? selectedParcel.areaSqM / 4046.86 : 0).toFixed(2)} Acres / {((selectedParcel?.areaSqM ?? 0) / 108.9).toFixed(1)} Guntha)</p>
            </div>

            <div className="rounded-xl border border-white/5 bg-ink-950/60 p-3">
              <span className="text-[10px] uppercase text-ink-400">Owner Record (7/12)</span>
              <p className="text-xs font-semibold text-white truncate">{selectedParcel?.ownerName}</p>
              <p className="text-[10px] text-emerald-400 flex items-center gap-1 mt-0.5">
                <CheckCircle2 size={11} /> Property Card Verified
              </p>
            </div>
          </div>

          {/* Simulated Polygon Coordinates Visualization */}
          <div className="rounded-xl border border-white/5 bg-ink-950/90 p-3 space-y-1.5 font-mono text-[11px]">
            <div className="flex justify-between text-ink-400 text-[10px]">
              <span>Boundary Vertices (GPS Coordinates)</span>
              <span>Pune Circle</span>
            </div>
            {selectedParcel?.coordinates.slice(0, 3).map((coord, idx) => (
              <div key={idx} className="flex justify-between text-blueprint-300">
                <span>Point {idx + 1}:</span>
                <span>Lat {coord[1]}° N, Lng {coord[0]}° E</span>
              </div>
            ))}
          </div>

          {showBuffer && (
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-2.5 text-xs text-emerald-300 flex items-center gap-2">
              <Info size={14} className="shrink-0" />
              <span>50m Statutory Buffer Area: {generateBufferPolygon(center, 50).length} Spatial Boundary Nodes Computed.</span>
            </div>
          )}
        </div>

        {/* Floating Zoom & Compass Controls */}
        <div className="absolute bottom-6 right-6 z-20 flex flex-col gap-2">
          <button
            onClick={() => setZoomLevel((z) => Math.min(22, z + 1))}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-ink-900/90 text-white hover:bg-white/10 shadow-lg"
          >
            <ZoomIn size={16} />
          </button>
          <button
            onClick={() => setZoomLevel((z) => Math.max(1, z - 1))}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-ink-900/90 text-white hover:bg-white/10 shadow-lg"
          >
            <ZoomOut size={16} />
          </button>
          <button
            onClick={() => setCenter({ lat: 18.5082, lng: 73.8123 })}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-blueprint-500/40 bg-blueprint-500/20 text-blueprint-300 hover:bg-blueprint-500/30 shadow-lg"
          >
            <Compass size={16} />
          </button>
        </div>

        {/* Bottom Coordinates & Scale Bar */}
        <div className="absolute bottom-4 left-4 z-20 flex items-center gap-4 rounded-xl border border-white/10 bg-ink-900/85 px-4 py-2 font-mono text-[11px] text-ink-300 backdrop-blur shadow-lg">
          <span>Lat: {center.lat.toFixed(4)}° N</span>
          <span>Lng: {center.lng.toFixed(4)}° E</span>
          <span>Zoom: {zoomLevel}x</span>
          <span className="text-blueprint-400">Scale 1:500</span>
        </div>
      </div>
    </div>
  );
}
