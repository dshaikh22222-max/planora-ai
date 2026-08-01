"use client";

import { useState } from "react";
import { Container } from "@/components/ui/Container";
import {
  ALL_CALCULATORS,
  calculateFSI,
  calculateSetbacks,
  calculateParking,
  calculateDevCharges,
} from "@/lib/town-planning/calculators";
import {
  LEGAL_SECTIONS,
  ZONING_RULES,
  calculateGunthewariFee,
} from "@/lib/town-planning/legal-engine";
import {
  Maximize2,
  Car,
  Coins,
  Receipt,
  Navigation,
  Trees,
  Building,
  Ruler,
  ShieldAlert,
  BadgeIndianRupee,
  ArrowLeftRight,
  FileSpreadsheet,
  Download,
  Search,
  Sparkles,
  MapPin,
  Scale,
  Layers,
  FileText,
  Building2,
  CheckCircle2,
  Compass,
} from "lucide-react";

const ICON_MAP: Record<string, React.ReactNode> = {
  Maximize2: <Maximize2 size={18} />,
  Car: <Car size={18} />,
  Coins: <Coins size={18} />,
  Receipt: <Receipt size={18} />,
  Navigation: <Navigation size={18} />,
  Trees: <Trees size={18} />,
  Building: <Building size={18} />,
  Ruler: <Ruler size={18} />,
  ShieldAlert: <ShieldAlert size={18} />,
  BadgeIndianRupee: <BadgeIndianRupee size={18} />,
  ArrowLeftRight: <ArrowLeftRight size={18} />,
};

type ActiveTab = "calculators" | "legal" | "zoning" | "gunthewari" | "gis";

export default function TownPlanningAppPage() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("calculators");
  const [selectedCalc, setSelectedCalc] = useState<string>("fsi");
  const [searchQuery, setSearchQuery] = useState("");
  const [legalSearch, setLegalSearch] = useState("");

  // Input states for FSI & Calculators
  const [plotArea, setPlotArea] = useState<number>(1000);
  const [roadWidth, setRoadWidth] = useState<number>(18);
  const [asrRate, setAsrRate] = useState<number>(45000);
  const [buildingHeight, setBuildingHeight] = useState<number>(24);
  const [residentialUnits, setResidentialUnits] = useState<number>(24);
  const [commercialArea, setCommercialArea] = useState<number>(300);

  // Input states for Gunthewari
  const [gunthPlotSqFt, setGunthPlotSqFt] = useState<number>(2000);
  const [gunthBuaSqFt, setGunthBuaSqFt] = useState<number>(1200);

  // Compute live calculations
  const fsiRes = calculateFSI({ plotArea, roadWidth, asrRate });
  const setbackRes = calculateSetbacks({ buildingHeight, roadWidth });
  const parkingRes = calculateParking({ residentialUnits, commercialAreaSqM: commercialArea });
  const devChargeRes = calculateDevCharges({ plotArea, builtUpArea: fsiRes.totalPermissibleBua, asrRate });
  const gunthRes = calculateGunthewariFee({
    plotAreaSqFt: gunthPlotSqFt,
    asrLandRatePerSqM: asrRate,
    builtUpSqFt: gunthBuaSqFt,
  });

  const filteredCalcs = ALL_CALCULATORS.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredLegal = LEGAL_SECTIONS.filter(
    (s) =>
      s.act.toLowerCase().includes(legalSearch.toLowerCase()) ||
      s.section.toLowerCase().includes(legalSearch.toLowerCase()) ||
      s.title.toLowerCase().includes(legalSearch.toLowerCase()) ||
      s.description.toLowerCase().includes(legalSearch.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-paper py-10 dark:bg-ink-950 text-ink-900 dark:text-white">
      <Container>
        {/* Main Title Banner */}
        <div className="mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-blueprint-500/30 bg-blueprint-500/10 px-4 py-1.5 text-xs font-semibold text-blueprint-600 dark:text-blueprint-300">
            <Sparkles size={14} /> Town Planning AI Suite — UDCPR 2020, MRTP & MLRC Engine
          </div>
          <h1 className="mt-4 font-display text-3xl font-bold tracking-tight md:text-4xl">
            Town Planning, Legal & GIS Scrutiny Suite
          </h1>
          <p className="mt-3 text-sm text-ink-600 dark:text-ink-300">
            All-in-one suite for UDCPR FSI calculations, MRTP / MLRC legal section citations, Gunthewari regularization fees, Zoning rules, and GIS DP map inspections.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-2 border-b border-ink-100 pb-4 dark:border-ink-800">
          <button
            onClick={() => setActiveTab("calculators")}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition ${
              activeTab === "calculators"
                ? "bg-blueprint-600 text-white shadow-md"
                : "bg-paper text-ink-600 hover:bg-ink-100 dark:bg-ink-900 dark:text-ink-300 dark:hover:bg-ink-800"
            }`}
          >
            <Maximize2 size={15} /> 15 UDCPR Calculators
          </button>

          <button
            onClick={() => setActiveTab("legal")}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition ${
              activeTab === "legal"
                ? "bg-blueprint-600 text-white shadow-md"
                : "bg-paper text-ink-600 hover:bg-ink-100 dark:bg-ink-900 dark:text-ink-300 dark:hover:bg-ink-800"
            }`}
          >
            <Scale size={15} /> Legal Assistant (MRTP / MLRC)
          </button>

          <button
            onClick={() => setActiveTab("zoning")}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition ${
              activeTab === "zoning"
                ? "bg-blueprint-600 text-white shadow-md"
                : "bg-paper text-ink-600 hover:bg-ink-100 dark:bg-ink-900 dark:text-ink-300 dark:hover:bg-ink-800"
            }`}
          >
            <Layers size={15} /> Zoning & Land Use Rules
          </button>

          <button
            onClick={() => setActiveTab("gunthewari")}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition ${
              activeTab === "gunthewari"
                ? "bg-blueprint-600 text-white shadow-md"
                : "bg-paper text-ink-600 hover:bg-ink-100 dark:bg-ink-900 dark:text-ink-300 dark:hover:bg-ink-800"
            }`}
          >
            <FileText size={15} /> Gunthewari Calculator
          </button>

          <button
            onClick={() => setActiveTab("gis")}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition ${
              activeTab === "gis"
                ? "bg-blueprint-600 text-white shadow-md"
                : "bg-paper text-ink-600 hover:bg-ink-100 dark:bg-ink-900 dark:text-ink-300 dark:hover:bg-ink-800"
            }`}
          >
            <Compass size={15} /> GIS & DP Map Inspector
          </button>
        </div>

        {/* ── TAB 1: 15 CALCULATORS ────────────────────────────── */}
        {activeTab === "calculators" && (
          <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12">
            {/* Left Selector */}
            <div className="lg:col-span-4 space-y-4">
              <div className="relative">
                <Search className="absolute left-3.5 top-3 text-ink-400" size={16} />
                <input
                  type="text"
                  placeholder="Search 15 calculators (FSI, Parking, TDR)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl border border-ink-200 bg-paper pl-10 pr-4 py-2.5 text-xs text-ink-900 outline-none transition focus:border-blueprint-500 dark:border-ink-800 dark:bg-ink-900 dark:text-white"
                />
              </div>

              <div className="space-y-2 max-h-[550px] overflow-y-auto pr-1">
                {filteredCalcs.map((calc) => {
                  const active = selectedCalc === calc.id;
                  return (
                    <button
                      key={calc.id}
                      onClick={() => setSelectedCalc(calc.id)}
                      className={`w-full text-left p-3.5 rounded-xl border transition ${
                        active
                          ? "border-blueprint-500 bg-blueprint-500/10 text-blueprint-600 dark:text-blueprint-300 shadow-sm"
                          : "border-ink-100 bg-paper/60 hover:bg-ink-100/50 dark:border-ink-800 dark:bg-ink-900/60 dark:hover:bg-ink-900"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className={active ? "text-blueprint-500" : "text-ink-400"}>
                          {ICON_MAP[calc.iconName] ?? <Maximize2 size={18} />}
                        </span>
                        <div>
                          <p className="text-xs font-semibold">{calc.name}</p>
                          <p className="text-[10px] text-ink-500 line-clamp-1">{calc.category}</p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right Calculator Panel */}
            <div className="lg:col-span-8 space-y-6">
              <div className="rounded-2xl border border-ink-100 bg-paper/80 p-6 shadow-md dark:border-ink-800 dark:bg-ink-900">
                <h2 className="text-base font-semibold text-ink-900 dark:text-white">
                  Plot & Building Specifications
                </h2>

                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-ink-600 dark:text-ink-300">
                      Plot Area (sq.m)
                    </label>
                    <input
                      type="number"
                      value={plotArea}
                      onChange={(e) => setPlotArea(Number(e.target.value))}
                      className="mt-1.5 w-full rounded-xl border border-ink-200 bg-paper px-3.5 py-2 text-sm font-mono text-ink-900 outline-none focus:border-blueprint-500 dark:border-ink-700 dark:bg-ink-800 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-ink-600 dark:text-ink-300">
                      Abutting Road Width (m)
                    </label>
                    <select
                      value={roadWidth}
                      onChange={(e) => setRoadWidth(Number(e.target.value))}
                      className="mt-1.5 w-full rounded-xl border border-ink-200 bg-paper px-3.5 py-2 text-sm font-semibold text-ink-900 outline-none focus:border-blueprint-500 dark:border-ink-700 dark:bg-ink-800 dark:text-white"
                    >
                      <option value={9}>9.0m (Internal Road)</option>
                      <option value={12}>12.0m (Minor DP Road)</option>
                      <option value={18}>18.0m (Major DP Road)</option>
                      <option value={24}>24.0m+ (State Highway)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-ink-600 dark:text-ink-300">
                      ASR Rate (₹/sq.m)
                    </label>
                    <input
                      type="number"
                      value={asrRate}
                      onChange={(e) => setAsrRate(Number(e.target.value))}
                      className="mt-1.5 w-full rounded-xl border border-ink-200 bg-paper px-3.5 py-2 text-sm font-mono text-ink-900 outline-none focus:border-blueprint-500 dark:border-ink-700 dark:bg-ink-800 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-ink-600 dark:text-ink-300">
                      Building Height (m)
                    </label>
                    <input
                      type="number"
                      value={buildingHeight}
                      onChange={(e) => setBuildingHeight(Number(e.target.value))}
                      className="mt-1.5 w-full rounded-xl border border-ink-200 bg-paper px-3.5 py-2 text-sm font-mono text-ink-900 outline-none focus:border-blueprint-500 dark:border-ink-700 dark:bg-ink-800 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-ink-600 dark:text-ink-300">
                      Residential Units
                    </label>
                    <input
                      type="number"
                      value={residentialUnits}
                      onChange={(e) => setResidentialUnits(Number(e.target.value))}
                      className="mt-1.5 w-full rounded-xl border border-ink-200 bg-paper px-3.5 py-2 text-sm font-mono text-ink-900 outline-none focus:border-blueprint-500 dark:border-ink-700 dark:bg-ink-800 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-ink-600 dark:text-ink-300">
                      Commercial BUA (sq.m)
                    </label>
                    <input
                      type="number"
                      value={commercialArea}
                      onChange={(e) => setCommercialArea(Number(e.target.value))}
                      className="mt-1.5 w-full rounded-xl border border-ink-200 bg-paper px-3.5 py-2 text-sm font-mono text-ink-900 outline-none focus:border-blueprint-500 dark:border-ink-700 dark:bg-ink-800 dark:text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Results Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-2xl border border-blueprint-500/20 bg-paper p-5 dark:border-blueprint-500/30 dark:bg-ink-900 space-y-2.5">
                  <div className="flex justify-between border-b border-white/10 pb-2">
                    <span className="text-xs font-semibold text-blueprint-600 dark:text-blueprint-300 flex items-center gap-1.5">
                      <Maximize2 size={14} /> FSI Potential
                    </span>
                    <span className="text-[10px] font-mono text-ink-400">UDCPR 6.1</span>
                  </div>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between"><span>Base FSI:</span><span className="font-mono">{fsiRes.baseFsi}</span></div>
                    <div className="flex justify-between"><span>Premium FSI:</span><span className="font-mono">{fsiRes.premiumFsiRatio}</span></div>
                    <div className="flex justify-between"><span>TDR Loading:</span><span className="font-mono">{fsiRes.tdrRatio}</span></div>
                    <div className="flex justify-between font-bold text-emerald-600 dark:text-emerald-400 text-sm pt-1.5 border-t border-white/5">
                      <span>Max BUA:</span>
                      <span className="font-mono">{fsiRes.totalPermissibleBua.toLocaleString("en-IN")} sq.m</span>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-amber-500/20 bg-paper p-5 dark:border-amber-500/30 dark:bg-ink-900 space-y-2.5">
                  <div className="flex justify-between border-b border-white/10 pb-2">
                    <span className="text-xs font-semibold text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                      <Ruler size={14} /> Setbacks & Margins
                    </span>
                    <span className="text-[10px] font-mono text-ink-400">H/4 Formula</span>
                  </div>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between"><span>Front Setback:</span><span className="font-mono">{setbackRes.frontSetback}m</span></div>
                    <div className="flex justify-between"><span>Side Margin:</span><span className="font-mono">{setbackRes.sideMargin}m</span></div>
                    <div className="flex justify-between"><span>Rear Margin:</span><span className="font-mono">{setbackRes.rearSetback}m</span></div>
                    <div className="flex justify-between text-amber-500 font-semibold pt-1.5 border-t border-white/5">
                      <span>Fire Access Buffer:</span>
                      <span className="font-mono">{setbackRes.fireBufferWidth}m</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 2: LEGAL ASSISTANT (MRTP / MLRC / UDCPR) ────────── */}
        {activeTab === "legal" && (
          <div className="mt-8 space-y-6 max-w-4xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-3.5 text-ink-400" size={18} />
              <input
                type="text"
                placeholder="Search MRTP Section 44, MLRC NA conversion, Gunthewari rules..."
                value={legalSearch}
                onChange={(e) => setLegalSearch(e.target.value)}
                className="w-full rounded-2xl border border-ink-200 bg-paper pl-12 pr-4 py-3 text-sm text-ink-900 outline-none transition focus:border-blueprint-500 dark:border-ink-800 dark:bg-ink-900 dark:text-white"
              />
            </div>

            <div className="grid grid-cols-1 gap-4">
              {filteredLegal.map((item, idx) => (
                <div key={idx} className="rounded-2xl border border-ink-100 bg-paper p-6 dark:border-ink-800 dark:bg-ink-900 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="rounded-full bg-blueprint-500/10 px-3 py-1 text-xs font-semibold text-blueprint-600 dark:text-blueprint-300">
                      {item.act} — {item.section}
                    </span>
                    <Scale size={18} className="text-ink-400" />
                  </div>
                  <h3 className="text-base font-semibold text-ink-900 dark:text-white">{item.title}</h3>
                  <p className="text-xs text-ink-600 dark:text-ink-300 leading-relaxed">{item.description}</p>
                  <div className="pt-2 border-t border-ink-100 dark:border-ink-800 space-y-1">
                    {item.keyPoints.map((point, pIdx) => (
                      <p key={pIdx} className="text-xs text-ink-500 flex items-center gap-2">
                        <CheckCircle2 size={13} className="text-emerald-500 shrink-0" />
                        {point}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── TAB 3: ZONING & LAND USE ──────────────────────────── */}
        {activeTab === "zoning" && (
          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 max-w-5xl mx-auto">
            {ZONING_RULES.map((z, idx) => (
              <div key={idx} className="rounded-2xl border border-ink-100 bg-paper p-6 dark:border-ink-800 dark:bg-ink-900 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-sm font-bold text-blueprint-600 dark:text-blueprint-300">
                    [{z.code}] {z.zone}
                  </span>
                  <span className="text-xs font-mono bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2.5 py-1 rounded-md">
                    Base FSI: {z.maxBaseFsi}
                  </span>
                </div>
                <div>
                  <p className="text-xs font-semibold text-ink-700 dark:text-ink-300 mb-2">Permitted Activities & Land Uses:</p>
                  <ul className="space-y-1.5">
                    {z.permittedUses.map((use, uIdx) => (
                      <li key={uIdx} className="text-xs text-ink-500 flex items-center gap-2">
                        <CheckCircle2 size={13} className="text-blue-500 shrink-0" />
                        {use}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="pt-3 border-t border-ink-100 dark:border-ink-800 text-xs text-ink-400">
                  <span>Max Height Cap: </span>
                  <span className="font-mono text-ink-700 dark:text-ink-200">{z.maxBuildingHeight}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── TAB 4: GUNTHEWARI CALCULATOR ──────────────────────── */}
        {activeTab === "gunthewari" && (
          <div className="mt-8 max-w-3xl mx-auto space-y-6">
            <div className="rounded-2xl border border-ink-100 bg-paper p-6 shadow-md dark:border-ink-800 dark:bg-ink-900">
              <h2 className="text-base font-semibold text-ink-900 dark:text-white flex items-center gap-2">
                <FileText className="text-blueprint-500" size={18} /> Gunthewari Regularization Fee Assessment
              </h2>
              <p className="text-xs text-ink-500 dark:text-ink-400 mt-1">
                Calculates compounding fees, regularization charges, and infrastructure development levies under Gunthewari Regularization Act (2001 & 2021 amendments).
              </p>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-ink-600 dark:text-ink-300">
                    Gunthewari Plot Area (sq.ft)
                  </label>
                  <input
                    type="number"
                    value={gunthPlotSqFt}
                    onChange={(e) => setGunthPlotSqFt(Number(e.target.value))}
                    className="mt-1.5 w-full rounded-xl border border-ink-200 bg-paper px-3.5 py-2 text-sm font-mono text-ink-900 outline-none focus:border-blueprint-500 dark:border-ink-700 dark:bg-ink-800 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-ink-600 dark:text-ink-300">
                    Existing Built-up Area (sq.ft)
                  </label>
                  <input
                    type="number"
                    value={gunthBuaSqFt}
                    onChange={(e) => setGunthBuaSqFt(Number(e.target.value))}
                    className="mt-1.5 w-full rounded-xl border border-ink-200 bg-paper px-3.5 py-2 text-sm font-mono text-ink-900 outline-none focus:border-blueprint-500 dark:border-ink-700 dark:bg-ink-800 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-ink-600 dark:text-ink-300">
                    ASR Land Rate (₹/sq.m)
                  </label>
                  <input
                    type="number"
                    value={asrRate}
                    onChange={(e) => setAsrRate(Number(e.target.value))}
                    className="mt-1.5 w-full rounded-xl border border-ink-200 bg-paper px-3.5 py-2 text-sm font-mono text-ink-900 outline-none focus:border-blueprint-500 dark:border-ink-700 dark:bg-ink-800 dark:text-white"
                  />
                </div>
              </div>
            </div>

            {/* Gunthewari Assessment Result */}
            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-6 space-y-3">
              <h3 className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                Gunthewari Regularization Assessment Breakdown
              </h3>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span>Plot Regularization Fee (10% ASR):</span>
                  <span className="font-mono font-medium">₹{gunthRes.plotRegularizationFee.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between">
                  <span>Construction Compounding Fee (15% ASR):</span>
                  <span className="font-mono font-medium">₹{gunthRes.constructionCompoundingFee.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between">
                  <span>Infrastructure Development Fee (₹15/sq.ft):</span>
                  <span className="font-mono font-medium">₹{gunthRes.infrastructureFee.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-emerald-500/20 font-bold text-sm text-emerald-700 dark:text-emerald-300">
                  <span>Total Regularization Cost:</span>
                  <span className="font-mono">₹{gunthRes.totalRegularizationCost.toLocaleString("en-IN")}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 5: GIS & DP MAP INSPECTOR ─────────────────────── */}
        {activeTab === "gis" && (
          <div className="mt-8 max-w-4xl mx-auto rounded-2xl border border-ink-100 bg-paper p-8 text-center space-y-4 shadow-md dark:border-ink-800 dark:bg-ink-900">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blueprint-500/10 text-blueprint-500">
              <Compass size={28} />
            </div>
            <h2 className="text-xl font-bold text-ink-900 dark:text-white">
              GIS Development Plan (DP) & Survey No. Map Inspector
            </h2>
            <p className="text-xs text-ink-500 dark:text-ink-400 max-w-xl mx-auto">
              Interactive GIS map viewer overlaying Survey Numbers, City Survey Sheets, DP Reservations (Roads, Green Zones, Amenity Plots), and Flood Blue Lines across PMC, PCMC, MCGM, and NMMC jurisdictions.
            </p>

            <div className="my-6 aspect-video rounded-xl border border-blueprint-500/30 bg-ink-950/90 flex flex-col items-center justify-center p-6 text-center space-y-3 relative overflow-hidden">
              {/* Simulated GIS Grid */}
              <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:24px_24px]"></div>
              <div className="z-10 flex items-center gap-2 rounded-full border border-blueprint-500/40 bg-blueprint-500/20 px-3.5 py-1 text-xs text-blueprint-300 font-mono">
                <MapPin size={14} /> Survey No. 44/2A — Pune Development Plan
              </div>
              <p className="z-10 text-xs text-ink-400">
                Layer Status: DP Road Reservation (18.0m ROW) · R2 Zone · Non-Flood Area
              </p>
            </div>
          </div>
        )}
      </Container>
    </div>
  );
}
