"use client";
import { useEffect, useState } from "react";

interface Settings {
  siteName: string;
  siteDescription: string;
  logo: string;
  twitter: string;
  instagram: string;
  youtube: string;
  facebook: string;
  adsenseId: string;
}

const DEFAULT_SETTINGS: Settings = {
  siteName: "BuzzScoop",
  siteDescription: "Entertainment News, Netflix, Hollywood",
  logo: "",
  twitter: "buzzscoop",
  instagram: "buzzscoop",
  youtube: "buzzscoop",
  facebook: "buzzscoop",
  adsenseId: "ca-pub-3912620984550623",
};

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [original, setOriginal] = useState<Settings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [activeSection, setActiveSection] = useState<string>("general");

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => r.json())
      .then((data) => {
        const merged = { ...DEFAULT_SETTINGS, ...data };
        setSettings(merged);
        setOriginal(merged);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const hasChanges = JSON.stringify(settings) !== JSON.stringify(original);

  async function save() {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      if (res.ok) {
        setOriginal(settings);
        setToast({ type: "success", text: "✅ Settings saved successfully!" });
      } else {
        setToast({ type: "error", text: "❌ Failed to save settings" });
      }
    } catch {
      setToast({ type: "error", text: "❌ Network error" });
    }
    setSaving(false);
    setTimeout(() => setToast(null), 3000);
  }

  function reset() {
    if (!confirm("Reset all settings to default values?")) return;
    setSettings(DEFAULT_SETTINGS);
  }

  function discard() {
    if (!confirm("Discard unsaved changes?")) return;
    setSettings(original);
  }

  function update<K extends keyof Settings>(key: K, value: string) {
    setSettings((s) => ({ ...s, [key]: value }));
  }

  if (loading) {
    return (
      <div className="p-10 text-center text-gray-500">
        <div className="animate-pulse text-2xl mb-2">⚙️</div>
        Loading settings...
      </div>
    );
  }

  const sections = [
    { id: "general", label: "General", icon: "🌐" },
    { id: "social", label: "Social Media", icon: "📱" },
    { id: "monetization", label: "Monetization", icon: "💰" },
    { id: "danger", label: "Danger Zone", icon: "⚠️" },
  ];

  return (
    <div className="max-w-4xl">
      {/* HEADER — Sticky with Save */}
      <div className="sticky top-14 z-30 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-4 bg-gray-100/95 dark:bg-gray-950/95 backdrop-blur border-b border-gray-200 dark:border-gray-800 mb-6">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black dark:text-white flex items-center gap-2">
              ⚙️ Settings
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
              Manage your site configuration
            </p>
          </div>

          <div className="flex items-center gap-2">
            {hasChanges && (
              <button
                onClick={discard}
                className="px-3 py-2 text-xs font-bold text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white cursor-pointer"
              >
                ✕ Discard
              </button>
            )}
            <button
              onClick={save}
              disabled={saving || !hasChanges}
              className={`px-5 py-2.5 rounded-lg font-bold text-sm cursor-pointer transition ${
                hasChanges && !saving
                  ? "bg-yellow-400 hover:bg-yellow-500 text-black shadow-md"
                  : "bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed"
              }`}
            >
              {saving ? "Saving..." : hasChanges ? "💾 Save Changes" : "✓ Saved"}
            </button>
          </div>
        </div>

        {/* Unsaved warning */}
        {hasChanges && (
          <div className="mt-3 text-xs text-yellow-700 dark:text-yellow-400 flex items-center gap-2">
            <span className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></span>
            You have unsaved changes
          </div>
        )}
      </div>

      {/* TOAST */}
      {toast && (
        <div
          className={`fixed top-20 right-4 z-50 px-5 py-3 rounded-lg shadow-lg text-sm font-bold ${
            toast.type === "success"
              ? "bg-green-500 text-white"
              : "bg-red-500 text-white"
          }`}
        >
          {toast.text}
        </div>
      )}

      {/* SECTION TABS */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {sections.map((s) => (
          <button
            key={s.id}
            onClick={() => setActiveSection(s.id)}
            className={`px-4 py-2 rounded-lg text-sm font-bold cursor-pointer transition ${
              activeSection === s.id
                ? "bg-yellow-400 text-black"
                : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 dark:text-white hover:border-yellow-400"
            }`}
          >
            {s.icon} {s.label}
          </button>
        ))}
      </div>

      {/* GENERAL SECTION */}
      {activeSection === "general" && (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 sm:p-8 space-y-6">
          <div>
            <h2 className="text-lg font-black dark:text-white mb-1">🌐 General Information</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Basic site information used across the website
            </p>
          </div>

          <div>
            <label className="block text-sm font-bold mb-1.5 dark:text-white">
              Site Name
            </label>
            <input
              value={settings.siteName}
              onChange={(e) => update("siteName", e.target.value)}
              placeholder="e.g., BuzzScoop"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 dark:text-white focus:outline-none focus:border-yellow-400"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5">
              Displayed in header, footer, and SEO tags
            </p>
          </div>

          <div>
            <label className="block text-sm font-bold mb-1.5 dark:text-white">
              Site Description
            </label>
            <textarea
              value={settings.siteDescription}
              onChange={(e) => update("siteDescription", e.target.value)}
              placeholder="Brief description of your site"
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 dark:text-white focus:outline-none focus:border-yellow-400"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5">
              Used in meta description and SEO (max 160 chars)
            </p>
            <p className={`text-xs mt-1 ${settings.siteDescription.length > 160 ? "text-red-500" : "text-gray-400"}`}>
              {settings.siteDescription.length}/160 chars
            </p>
          </div>

          <div>
            <label className="block text-sm font-bold mb-1.5 dark:text-white">
              Logo URL
            </label>
            <input
              value={settings.logo}
              onChange={(e) => update("logo", e.target.value)}
              placeholder="https://example.com/logo.png"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 dark:text-white focus:outline-none focus:border-yellow-400"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5">
              Leave blank to use text logo
            </p>
            {settings.logo && (
              <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <p className="text-xs text-gray-500 mb-2">Preview:</p>
                <img
                  src={settings.logo}
                  alt="Logo preview"
                  className="max-h-16 rounded"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                />
              </div>
            )}
          </div>
        </div>
      )}

      {/* SOCIAL MEDIA SECTION */}
      {activeSection === "social" && (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 sm:p-8 space-y-6">
          <div>
            <h2 className="text-lg font-black dark:text-white mb-1">📱 Social Media</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Your social media handles (without @)
            </p>
          </div>

          {[
            { key: "twitter" as const, label: "Twitter / X", icon: "𝕏", placeholder: "yourhandle" },
            { key: "instagram" as const, label: "Instagram", icon: "📷", placeholder: "yourhandle" },
            { key: "youtube" as const, label: "YouTube", icon: "▶️", placeholder: "yourchannel" },
            { key: "facebook" as const, label: "Facebook", icon: "f", placeholder: "yourpage" },
          ].map((s) => (
            <div key={s.key}>
              <label className="block text-sm font-bold mb-1.5 dark:text-white flex items-center gap-2">
                <span>{s.icon}</span>
                {s.label}
              </label>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                  {s.key === "twitter" ? "x.com/" : s.key === "instagram" ? "instagram.com/" : s.key === "youtube" ? "youtube.com/@" : "facebook.com/"}
                </span>
                <input
                  value={settings[s.key]}
                  onChange={(e) => update(s.key, e.target.value)}
                  placeholder={s.placeholder}
                  className="flex-1 px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 dark:text-white focus:outline-none focus:border-yellow-400 font-mono text-sm"
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MONETIZATION SECTION */}
      {activeSection === "monetization" && (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 sm:p-8 space-y-6">
          <div>
            <h2 className="text-lg font-black dark:text-white mb-1">💰 Monetization</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Ad networks and affiliate settings
            </p>
          </div>

          <div>
            <label className="block text-sm font-bold mb-1.5 dark:text-white">
              Google AdSense Publisher ID
            </label>
            <input
              value={settings.adsenseId}
              onChange={(e) => update("adsenseId", e.target.value)}
              placeholder="ca-pub-XXXXXXXXXXXXXXXX"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 dark:text-white focus:outline-none focus:border-yellow-400 font-mono text-sm"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5">
              Found in AdSense → Account → Settings → Account information
            </p>
            {settings.adsenseId && !settings.adsenseId.startsWith("ca-pub-") && (
              <p className="text-xs text-red-500 mt-1.5">
                ⚠️ Should start with "ca-pub-"
              </p>
            )}
          </div>

          <div className="p-4 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 rounded-lg">
            <p className="text-xs text-blue-900 dark:text-blue-300">
              💡 <strong>Tip:</strong> Ads appear automatically on article pages.
              Make sure your AdSense account is approved and the domain is verified.
            </p>
          </div>
        </div>
      )}

      {/* DANGER ZONE */}
      {activeSection === "danger" && (
        <div className="bg-white dark:bg-gray-800 rounded-xl border-2 border-red-200 dark:border-red-900 p-6 sm:p-8 space-y-6">
          <div>
            <h2 className="text-lg font-black text-red-600 dark:text-red-400 mb-1">
              ⚠️ Danger Zone
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              These actions cannot be undone
            </p>
          </div>

          <div className="space-y-3">
            <div className="p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-lg">
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <div>
                  <p className="font-bold text-sm text-red-900 dark:text-red-300">
                    Reset all settings
                  </p>
                  <p className="text-xs text-red-700 dark:text-red-400 mt-0.5">
                    Restore default values for all fields
                  </p>
                </div>
                <button
                  onClick={reset}
                  className="bg-red-500 hover:bg-red-600 text-white font-bold px-4 py-2 rounded-lg text-xs cursor-pointer transition"
                >
                  Reset Settings
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}