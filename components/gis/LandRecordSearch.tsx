"use client";

import { useState } from "react";
import { SAMPLE_LAND_PARCELS, PolygonBoundary } from "@/lib/gis/spatial-engine";
import { Search, FileText, CheckCircle2, User, MapPin, ExternalLink, ShieldCheck } from "lucide-react";

export function LandRecordSearch() {
  const [query, setQuery] = useState("44/2A");
  const defaultRecord = SAMPLE_LAND_PARCELS[0]!;
  const [selectedRecord, setSelectedRecord] = useState<PolygonBoundary>(defaultRecord);

  const searchResults = SAMPLE_LAND_PARCELS.filter(
    (p) =>
      p.surveyNo.toLowerCase().includes(query.toLowerCase()) ||
      p.gatNo?.toLowerCase().includes(query.toLowerCase()) ||
      p.ctsNo?.toLowerCase().includes(query.toLowerCase()) ||
      p.ownerName.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="rounded-2xl border border-ink-100 bg-paper p-6 dark:border-ink-800 dark:bg-ink-900 space-y-6">
      <div>
        <h3 className="text-base font-semibold text-ink-900 dark:text-white flex items-center gap-2">
          <FileText className="text-blueprint-500" size={18} /> Land Record & 7/12 Extract Search
        </h3>
        <p className="text-xs text-ink-500 dark:text-ink-400 mt-0.5">
          Search revenue records by Survey No., Gat No., CTS No., or Owner Name.
        </p>
      </div>

      <div className="relative">
        <Search className="absolute left-3.5 top-3 text-ink-400" size={16} />
        <input
          type="text"
          placeholder="Enter Survey No (e.g. 44/2A), Gat No (128), or Owner Name..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full rounded-xl border border-ink-200 bg-paper pl-10 pr-4 py-2.5 text-xs text-ink-900 outline-none transition focus:border-blueprint-500 dark:border-ink-700 dark:bg-ink-800 dark:text-white"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Results List */}
        <div className="md:col-span-5 space-y-2">
          <span className="text-[11px] font-mono text-ink-400">Search Results ({searchResults.length})</span>
          {searchResults.map((r) => (
            <button
              key={r.id}
              onClick={() => setSelectedRecord(r)}
              className={`w-full text-left p-3.5 rounded-xl border transition ${
                selectedRecord.id === r.id
                  ? "border-blueprint-500 bg-blueprint-500/10 text-blueprint-600 dark:text-blueprint-300 shadow-sm"
                  : "border-ink-100 bg-paper/60 hover:bg-ink-100/50 dark:border-ink-800 dark:bg-ink-900"
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs font-bold">Survey No. {r.surveyNo}</p>
                  <p className="text-[11px] text-ink-500 font-mono">Gat {r.gatNo} · CTS {r.ctsNo}</p>
                  <p className="text-[11px] text-ink-400 mt-1 flex items-center gap-1">
                    <User size={11} /> {r.ownerName}
                  </p>
                </div>
                <span className="rounded bg-blueprint-500/10 px-2 py-0.5 text-[10px] font-mono text-blueprint-500 font-semibold">
                  {r.zone}
                </span>
              </div>
            </button>
          ))}
        </div>

        {/* Selected Record Property Card Detail */}
        <div className="md:col-span-7 rounded-xl border border-ink-100 bg-paper/80 p-5 dark:border-ink-800 dark:bg-ink-950 space-y-4">
          <div className="flex justify-between items-center border-b border-white/10 pb-3">
            <div>
              <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                <ShieldCheck size={13} /> Official Mahabhulekh 7/12 Extract
              </span>
              <h4 className="text-sm font-bold text-ink-900 dark:text-white mt-0.5">
                Survey No. {selectedRecord.surveyNo} — Village {selectedRecord.village}
              </h4>
            </div>
            <span className="text-xs font-mono font-bold text-blueprint-400">
              {selectedRecord.areaSqM.toLocaleString("en-IN")} sq.m
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-ink-400 text-[10px]">Primary Landowner:</span>
              <p className="font-semibold text-ink-900 dark:text-white">{selectedRecord.ownerName}</p>
            </div>
            <div>
              <span className="text-ink-400 text-[10px]">Land Tenure & Type:</span>
              <p className="font-semibold text-ink-900 dark:text-white">Class-1 Occupant (Bhogwatdar 1)</p>
            </div>
            <div>
              <span className="text-ink-400 text-[10px]">City Survey (CTS) Ref:</span>
              <p className="font-mono text-ink-900 dark:text-white">CTS #{selectedRecord.ctsNo}</p>
            </div>
            <div>
              <span className="text-ink-400 text-[10px]">Encumbrance Status:</span>
              <p className="text-emerald-400 font-semibold flex items-center gap-1">
                <CheckCircle2 size={11} /> Clear Title (No Bank Lien)
              </p>
            </div>
          </div>

          {/* Mutation History Log */}
          <div className="pt-3 border-t border-white/5 space-y-2">
            <span className="text-[11px] font-semibold text-ink-400">Mutation Entry History (Ferfar Log):</span>
            <div className="space-y-1.5 text-[11px] font-mono">
              <div className="flex justify-between text-ink-300 bg-white/5 p-2 rounded-lg">
                <span>Entry #14892 (Inheritance Transfer)</span>
                <span className="text-ink-400">14-Mar-2023</span>
              </div>
              <div className="flex justify-between text-ink-300 bg-white/5 p-2 rounded-lg">
                <span>Entry #12401 (NA Conversion Order)</span>
                <span className="text-ink-400">08-Nov-2019</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
