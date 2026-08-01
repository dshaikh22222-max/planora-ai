import type { Metadata } from "next";
import { getAllSettings } from "@/lib/admin/repositories/settings.repository";
import { SiteSettingsClient } from "@/components/admin/settings/SiteSettingsClient";

export const metadata: Metadata = { title: "Site Settings" };

export default async function SettingsPage() {
  const settings = await getAllSettings();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-white">Site Settings</h1>
        <p className="text-sm text-ink-500">
          Manage key-value config options across your website
        </p>
      </div>

      <SiteSettingsClient initialSettings={settings as never} />
    </div>
  );
}
