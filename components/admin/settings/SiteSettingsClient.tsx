"use client";

import { useState, useTransition } from "react";
import { Save, Loader2, Plus, Trash2 } from "lucide-react";

interface Setting {
  id: string;
  key: string;
  value: string;
  type: string;
  group: string;
  label: string | null;
}

interface SiteSettingsClientProps {
  initialSettings: Setting[];
}

const GROUPS = [
  { key: "general", label: "General", color: "text-blueprint-400" },
  { key: "hero", label: "Hero Section", color: "text-emerald-400" },
  { key: "seo", label: "SEO Defaults", color: "text-amber-400" },
  { key: "social", label: "Social Links", color: "text-violet-400" },
  { key: "contact", label: "Contact", color: "text-rose-400" },
  { key: "announcement", label: "Announcement", color: "text-ink-400" },
];

export function SiteSettingsClient({ initialSettings }: SiteSettingsClientProps) {
  const [settings, setSettings] = useState(
    initialSettings.map((s) => ({ ...s, dirty: false }))
  );
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);
  const [activeGroup, setActiveGroup] = useState(GROUPS[0]?.key ?? "general");

  function updateValue(key: string, value: string) {
    setSettings((prev) =>
      prev.map((s) => (s.key === key ? { ...s, value, dirty: true } : s))
    );
    setSaved(false);
  }

  function addSetting() {
    const key = prompt("Setting key (e.g. my_setting):")?.trim();
    if (!key) return;
    const label = prompt("Label:")?.trim() ?? key;
    const newSetting: Setting & { dirty: boolean } = {
      id: `temp-${Date.now()}`,
      key,
      value: "",
      type: "text",
      group: activeGroup,
      label,
      dirty: true,
    };
    setSettings((prev) => [...prev, newSetting]);
  }

  async function handleSave() {
    const dirty = settings.filter((s) => s.dirty);
    if (dirty.length === 0) return;

    startTransition(async () => {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ settings: dirty.map((s) => ({ key: s.key, value: s.value })) }),
      });

      if (res.ok) {
        setSettings((prev) => prev.map((s) => ({ ...s, dirty: false })));
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
      }
    });
  }

  const groupSettings = settings.filter((s) => s.group === activeGroup);
  const dirtyCount = settings.filter((s) => s.dirty).length;

  const inputCls = "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-ink-600 outline-none transition focus:border-blueprint-500 focus:ring-1 focus:ring-blueprint-500/20";

  return (
    <div className="flex gap-6">
      {/* Left nav */}
      <div className="w-48 shrink-0 space-y-1">
        {GROUPS.map((g) => {
          const count = settings.filter((s) => s.group === g.key && s.dirty).length;
          return (
            <button
              key={g.key}
              onClick={() => setActiveGroup(g.key)}
              className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition ${
                activeGroup === g.key
                  ? "bg-white/8 font-medium text-white"
                  : "text-ink-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <span className={activeGroup === g.key ? g.color : ""}>{g.label}</span>
              {count > 0 && (
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-blueprint-600 text-[10px] font-bold text-white">
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Settings panel */}
      <div className="flex-1 space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-white">
            {GROUPS.find((g) => g.key === activeGroup)?.label ?? activeGroup}
          </h2>
          <div className="flex items-center gap-2">
            {saved && <span className="text-xs text-emerald-400">Saved ✓</span>}
            {dirtyCount > 0 && !saved && (
              <span className="text-xs text-amber-400">{dirtyCount} unsaved changes</span>
            )}
            <button onClick={addSetting} className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-ink-300 transition hover:text-white">
              <Plus size={12} /> Add Key
            </button>
            <button
              onClick={handleSave}
              disabled={isPending || dirtyCount === 0}
              className="flex items-center gap-2 rounded-xl bg-blueprint-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blueprint-500 disabled:opacity-50"
            >
              {isPending ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
              Save Changes
            </button>
          </div>
        </div>

        {groupSettings.length === 0 ? (
          <div className="rounded-xl border border-white/5 bg-ink-900 p-8 text-center">
            <p className="text-sm text-ink-600">No settings in this group.</p>
            <button onClick={addSetting} className="mt-3 text-sm text-blueprint-400 hover:text-blueprint-300 transition">
              + Add the first setting
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {groupSettings.map((setting) => (
              <div key={setting.key} className={`rounded-xl border bg-ink-900 p-4 transition ${setting.dirty ? "border-blueprint-500/30" : "border-white/5"}`}>
                <div className="mb-2 flex items-center justify-between">
                  <div>
                    <label className="block text-sm font-medium text-white">
                      {setting.label ?? setting.key}
                      {setting.dirty && <span className="ml-2 text-xs text-blueprint-400">•</span>}
                    </label>
                    <p className="font-mono text-[11px] text-ink-600">{setting.key}</p>
                  </div>
                  <span className="rounded-md border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] text-ink-600">
                    {setting.type}
                  </span>
                </div>
                {setting.type === "boolean" ? (
                  <label className="flex cursor-pointer items-center gap-2">
                    <input
                      type="checkbox"
                      checked={setting.value === "true"}
                      onChange={(e) => updateValue(setting.key, String(e.target.checked))}
                      className="h-4 w-4 rounded accent-blueprint-500"
                    />
                    <span className="text-sm text-ink-300">
                      {setting.value === "true" ? "Enabled" : "Disabled"}
                    </span>
                  </label>
                ) : setting.value.length > 80 || setting.type === "json" ? (
                  <textarea
                    value={setting.value}
                    onChange={(e) => updateValue(setting.key, e.target.value)}
                    rows={4}
                    className={inputCls + " resize-y font-mono text-xs"}
                  />
                ) : (
                  <input
                    value={setting.value}
                    onChange={(e) => updateValue(setting.key, e.target.value)}
                    className={inputCls}
                  />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
