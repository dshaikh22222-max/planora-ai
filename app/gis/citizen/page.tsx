"use client";

import { useState } from "react";
import { Container } from "@/components/ui/Container";
import { Search, MapPin, AlertTriangle, FileText, CheckCircle2, ShieldCheck, Send } from "lucide-react";

export default function CitizenGisPage() {
  const [surveyNo, setSurveyNo] = useState("44/2A");
  const [village, setVillage] = useState("Kothrud");
  const [encroachmentTitle, setEncroachmentTitle] = useState("");
  const [encroachmentLocation, setEncroachmentLocation] = useState("");
  const [encroachmentNotes, setEncroachmentNotes] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-paper py-12 dark:bg-ink-950 text-ink-900 dark:text-white">
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-blueprint-500/30 bg-blueprint-500/10 px-4 py-1.5 text-xs font-semibold text-blueprint-600 dark:text-blueprint-300">
            <UsersIcon /> Citizen GIS & Property Information Portal
          </div>
          <h1 className="mt-4 font-display text-3xl font-bold tracking-tight md:text-4xl">
            Public Property & Reservation Verification
          </h1>
          <p className="mt-3 text-sm text-ink-600 dark:text-ink-300">
            Search DP road reservations, verify land zone status, check municipal building permissions, and submit encroachment alerts directly to town planning authorities.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Quick Property Reservation Lookup */}
          <div className="rounded-2xl border border-ink-100 bg-paper p-6 dark:border-ink-800 dark:bg-ink-900 space-y-4 shadow-md">
            <h2 className="text-base font-semibold text-ink-900 dark:text-white flex items-center gap-2">
              <Search className="text-blueprint-500" size={18} /> Public Land Parcel Lookup
            </h2>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-ink-600 dark:text-ink-300">Survey No. / Gat No.</label>
                <input
                  type="text"
                  value={surveyNo}
                  onChange={(e) => setSurveyNo(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-ink-200 bg-paper px-3.5 py-2 text-xs font-mono text-ink-900 outline-none dark:border-ink-700 dark:bg-ink-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-ink-600 dark:text-ink-300">Village / Revenue Circle</label>
                <input
                  type="text"
                  value={village}
                  onChange={(e) => setVillage(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-ink-200 bg-paper px-3.5 py-2 text-xs font-semibold text-ink-900 outline-none dark:border-ink-700 dark:bg-ink-800 dark:text-white"
                />
              </div>
            </div>

            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-xs space-y-2">
              <div className="flex justify-between font-bold text-emerald-400">
                <span>Survey No. {surveyNo} ({village})</span>
                <span>R2 Zone</span>
              </div>
              <p className="text-ink-300">
                DP Status: No public road / amenity reservation on plot. Permissible Base FSI: 1.20.
              </p>
            </div>
          </div>

          {/* Encroachment & Illegal Construction Reporting */}
          <div className="rounded-2xl border border-ink-100 bg-paper p-6 dark:border-ink-800 dark:bg-ink-900 space-y-4 shadow-md">
            <h2 className="text-base font-semibold text-ink-900 dark:text-white flex items-center gap-2">
              <AlertTriangle className="text-amber-500" size={18} /> Report Encroachment / Illegal Building
            </h2>

            {submitted ? (
              <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-6 text-center space-y-2">
                <CheckCircle2 size={24} className="mx-auto text-emerald-400" />
                <h3 className="text-sm font-bold text-emerald-400">Encroachment Ticket Filed</h3>
                <p className="text-xs text-ink-300">Reference #ENC-2026-892 sent to Municipal Scrutiny Officer.</p>
              </div>
            ) : (
              <form onSubmit={handleReportSubmit} className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-ink-600 dark:text-ink-300">Incident Title</label>
                  <input
                    type="text"
                    placeholder="e.g. Unauthorized construction inside Nala margin"
                    value={encroachmentTitle}
                    onChange={(e) => setEncroachmentTitle(e.target.value)}
                    required
                    className="mt-1 w-full rounded-xl border border-ink-200 bg-paper px-3.5 py-2 text-xs text-ink-900 outline-none dark:border-ink-700 dark:bg-ink-800 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-ink-600 dark:text-ink-300">Location Address / Survey No.</label>
                  <input
                    type="text"
                    placeholder="Location address or landmark"
                    value={encroachmentLocation}
                    onChange={(e) => setEncroachmentLocation(e.target.value)}
                    required
                    className="mt-1 w-full rounded-xl border border-ink-200 bg-paper px-3.5 py-2 text-xs text-ink-900 outline-none dark:border-ink-700 dark:bg-ink-800 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-ink-600 dark:text-ink-300">Detailed Violation Notes</label>
                  <textarea
                    rows={2}
                    value={encroachmentNotes}
                    onChange={(e) => setEncroachmentNotes(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-ink-200 bg-paper p-3 text-xs text-ink-900 outline-none dark:border-ink-700 dark:bg-ink-800 dark:text-white"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-amber-600 px-4 py-2.5 text-xs font-semibold text-white shadow-md transition hover:bg-amber-500"
                >
                  <Send size={14} /> Submit Confidential Citizen Alert
                </button>
              </form>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
}

function UsersIcon() {
  return <MapPin size={14} />;
}
