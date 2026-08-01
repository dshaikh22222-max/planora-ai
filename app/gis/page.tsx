"use client";

import { useState } from "react";
import { Container } from "@/components/ui/Container";
import { GisMapViewer } from "@/components/gis/GisMapViewer";
import { PlanningLayersManager } from "@/components/gis/PlanningLayersManager";
import { LandRecordSearch } from "@/components/gis/LandRecordSearch";
import { BuildingPermissionGis } from "@/components/gis/BuildingPermissionGis";
import { DigitalTwin3D } from "@/components/gis/DigitalTwin3D";
import { AiSatelliteAnalyzer } from "@/components/gis/AiSatelliteAnalyzer";
import { MobileFieldSurvey } from "@/components/gis/MobileFieldSurvey";
import {
  Compass,
  Layers,
  FileText,
  Building2,
  Box,
  Sparkles,
  Camera,
  Users,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

type GisTab = "map" | "layers" | "records" | "building" | "twin" | "ai" | "survey";

export default function AdvancedGisPage() {
  const [activeTab, setActiveTab] = useState<GisTab>("map");

  return (
    <div className="min-h-screen bg-paper py-10 dark:bg-ink-950 text-ink-900 dark:text-white">
      <Container>
        {/* Main Title & Hero Banner */}
        <div className="mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-blueprint-500/30 bg-blueprint-500/10 px-4 py-1.5 text-xs font-semibold text-blueprint-600 dark:text-blueprint-300">
            <Sparkles size={14} /> Enterprise GIS & Smart City Digital Twin Platform
          </div>
          <h1 className="mt-4 font-display text-3xl font-bold tracking-tight md:text-5xl">
            Advanced GIS & Land Records Scrutiny System
          </h1>
          <p className="mt-3 text-sm text-ink-600 dark:text-ink-300 max-w-2xl mx-auto">
            High-performance vector map inspection, 7/12 land records search, UDCPR building permission overlays, 3D sunlight simulators, and AI satellite encroachment detection.
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/gis/citizen"
              className="flex items-center gap-1.5 rounded-xl border border-blueprint-500/30 bg-blueprint-500/10 px-4 py-2 text-xs font-semibold text-blueprint-600 hover:bg-blueprint-500/20 dark:text-blueprint-300 transition"
            >
              <Users size={14} /> Citizen Property Portal <ArrowRight size={13} />
            </Link>
          </div>
        </div>

        {/* Tab Selector Bar */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-2 border-b border-ink-100 pb-4 dark:border-ink-800">
          <button
            onClick={() => setActiveTab("map")}
            className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold transition ${
              activeTab === "map"
                ? "bg-blueprint-600 text-white shadow-md"
                : "bg-paper text-ink-600 hover:bg-ink-100 dark:bg-ink-900 dark:text-ink-300 dark:hover:bg-ink-800"
            }`}
          >
            <Compass size={15} /> Vector Map Viewer
          </button>

          <button
            onClick={() => setActiveTab("layers")}
            className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold transition ${
              activeTab === "layers"
                ? "bg-blueprint-600 text-white shadow-md"
                : "bg-paper text-ink-600 hover:bg-ink-100 dark:bg-ink-900 dark:text-ink-300 dark:hover:bg-ink-800"
            }`}
          >
            <Layers size={15} /> DP & Utility Layers
          </button>

          <button
            onClick={() => setActiveTab("records")}
            className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold transition ${
              activeTab === "records"
                ? "bg-blueprint-600 text-white shadow-md"
                : "bg-paper text-ink-600 hover:bg-ink-100 dark:bg-ink-900 dark:text-ink-300 dark:hover:bg-ink-800"
            }`}
          >
            <FileText size={15} /> Land Records (7/12)
          </button>

          <button
            onClick={() => setActiveTab("building")}
            className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold transition ${
              activeTab === "building"
                ? "bg-blueprint-600 text-white shadow-md"
                : "bg-paper text-ink-600 hover:bg-ink-100 dark:bg-ink-900 dark:text-ink-300 dark:hover:bg-ink-800"
            }`}
          >
            <Building2 size={15} /> Building Footprint GIS
          </button>

          <button
            onClick={() => setActiveTab("twin")}
            className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold transition ${
              activeTab === "twin"
                ? "bg-blueprint-600 text-white shadow-md"
                : "bg-paper text-ink-600 hover:bg-ink-100 dark:bg-ink-900 dark:text-ink-300 dark:hover:bg-ink-800"
            }`}
          >
            <Box size={15} /> 3D Digital Twin
          </button>

          <button
            onClick={() => setActiveTab("ai")}
            className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold transition ${
              activeTab === "ai"
                ? "bg-blueprint-600 text-white shadow-md"
                : "bg-paper text-ink-600 hover:bg-ink-100 dark:bg-ink-900 dark:text-ink-300 dark:hover:bg-ink-800"
            }`}
          >
            <Sparkles size={15} /> AI Satellite Detector
          </button>

          <button
            onClick={() => setActiveTab("survey")}
            className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold transition ${
              activeTab === "survey"
                ? "bg-blueprint-600 text-white shadow-md"
                : "bg-paper text-ink-600 hover:bg-ink-100 dark:bg-ink-900 dark:text-ink-300 dark:hover:bg-ink-800"
            }`}
          >
            <Camera size={15} /> Mobile Field Survey
          </button>
        </div>

        {/* Tab Content Display */}
        <div className="mt-8">
          {activeTab === "map" && <GisMapViewer />}
          {activeTab === "layers" && <PlanningLayersManager />}
          {activeTab === "records" && <LandRecordSearch />}
          {activeTab === "building" && <BuildingPermissionGis />}
          {activeTab === "twin" && <DigitalTwin3D />}
          {activeTab === "ai" && <AiSatelliteAnalyzer />}
          {activeTab === "survey" && <MobileFieldSurvey />}
        </div>
      </Container>
    </div>
  );
}
