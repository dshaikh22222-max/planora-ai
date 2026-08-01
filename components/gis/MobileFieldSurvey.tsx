"use client";

import { useState } from "react";
import { Camera, MapPin, CheckCircle2, FileCheck, UserCheck, ShieldCheck } from "lucide-react";

export function MobileFieldSurvey() {
  const [inspector, setInspector] = useState("Er. Nilesh Shinde (Junior Town Planner)");
  const [locationName, setLocationName] = useState("Survey No. 44/2A, Kothrud, Pune");
  const [notes, setNotes] = useState("Site verified. 18.0m DP road exists on site. Setbacks verified with laser meter.");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="rounded-2xl border border-ink-100 bg-paper p-6 dark:border-ink-800 dark:bg-ink-900 space-y-6">
      <div>
        <h3 className="text-base font-semibold text-ink-900 dark:text-white flex items-center gap-2">
          <Camera className="text-blueprint-500" size={18} /> Mobile GIS Field Inspection & Geo-Tagged Survey
        </h3>
        <p className="text-xs text-ink-500 dark:text-ink-400 mt-0.5">
          Mobile field tool for capturing GPS coordinates, geo-tagged photos, and digital inspector sign-offs.
        </p>
      </div>

      {submitted ? (
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-6 text-center space-y-2">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
            <CheckCircle2 size={24} />
          </div>
          <h4 className="text-sm font-bold text-emerald-400">Inspection Log Sync Completed</h4>
          <p className="text-xs text-ink-300">Geo-tag Lat 18.5082° N, Lng 73.8123° E recorded with cryptographic signature.</p>
          <button
            onClick={() => setSubmitted(false)}
            className="mt-2 text-xs text-blueprint-400 hover:underline font-mono"
          >
            + Add Another Inspection Log
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-ink-600 dark:text-ink-300">Inspector Name & Designation</label>
              <input
                type="text"
                value={inspector}
                onChange={(e) => setInspector(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-ink-200 bg-paper px-3 py-2 text-xs font-semibold text-ink-900 outline-none dark:border-ink-700 dark:bg-ink-800 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-ink-600 dark:text-ink-300">Inspection Site Location</label>
              <input
                type="text"
                value={locationName}
                onChange={(e) => setLocationName(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-ink-200 bg-paper px-3 py-2 text-xs font-semibold text-ink-900 outline-none dark:border-ink-700 dark:bg-ink-800 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-ink-600 dark:text-ink-300">Field Notes & Violation Log</label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-ink-200 bg-paper p-3 text-xs font-mono text-ink-900 outline-none dark:border-ink-700 dark:bg-ink-800 dark:text-white"
            />
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-white/5">
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
              <MapPin size={15} /> GPS Position Fixed: 18.5082° N, 73.8123° E (Accuracy ±2m)
            </div>

            <button
              type="submit"
              className="flex items-center gap-2 rounded-xl bg-blueprint-600 px-5 py-2.5 text-xs font-semibold text-white shadow-md transition hover:bg-blueprint-500"
            >
              <FileCheck size={15} /> Submit Signed Inspection
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
