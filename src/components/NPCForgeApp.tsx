"use client";

import { useState } from "react";
import { GeneratorTab } from "./GeneratorTab";
import { SavedTab } from "./SavedTab";
import { SettingsTab } from "./SettingsTab";
import { useApp } from "@/lib/AppContext";
import { t } from "@/lib/i18n";
import type { SettingKey } from "@/data/settings";

type Tab = "generator" | "saved" | "settings";

const ACCENT: Record<SettingKey, string> = {
  fantasy: "#9b59b6",
  scifi: "#00bcd4",
  horror: "#e74c3c",
  modern: "#3498db",
  historical: "#d4a762",
  postapoc: "#8bc34a",
  japanese: "#e91e63",
  steampunk: "#ff9800",
  pirate: "#26c6da",
  western: "#a1887f",
};

export function NPCForgeApp() {
  const { theme, lang } = useApp();
  const [tab, setTab] = useState<Tab>("generator");
  const [setting, setSetting] = useState<SettingKey>("fantasy");
  const [savedRefresh, setSavedRefresh] = useState(0);

  const accent = ACCENT[setting];
  const isDark = theme === "dark";

  return (
    <div className="flex flex-col min-h-screen transition-colors duration-300" style={{ background: "var(--bg-base)" }}>
      {/* Scrollable content area */}
      <main className="flex-1 overflow-y-auto" style={{ paddingBottom: 85 }}>
        <div className="mx-auto w-full max-w-lg px-5 pt-6 pb-8">
          {tab === "generator" && (
            <GeneratorTab
              setting={setting}
              onSettingChange={setSetting}
              accent={accent}
              onSaved={() => setSavedRefresh((n) => n + 1)}
            />
          )}
          {tab === "saved" && (
            <SavedTab refreshKey={savedRefresh} accent={accent} />
          )}
          {tab === "settings" && (
            <SettingsTab accent={accent} />
          )}
        </div>
      </main>

      {/* ── Bottom Navigation ── */}
      <nav
        className="fixed bottom-0 inset-x-0 z-50 no-print"
        style={{
          background: isDark ? "rgba(15,15,26,0.95)" : "rgba(255,255,255,0.95)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderTop: `1px solid ${isDark ? accent + "20" : accent + "30"}`,
        }}
      >
        <div className="mx-auto max-w-lg flex items-stretch">
          {([
            { id: "generator" as Tab, icon: "⚡", labelKey: "navGenerate" as const },
            { id: "saved" as Tab, icon: "📚", labelKey: "navSaved" as const },
            { id: "settings" as Tab, icon: "⚙️", labelKey: "navSettings" as const },
          ]).map((item) => {
            const active = tab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setTab(item.id)}
                className="flex-1 flex flex-col items-center justify-center py-3.5 gap-1 transition-all duration-200"
                style={{ color: active ? accent : "var(--text-muted)" }}
              >
                <span className="text-[22px] leading-none">{item.icon}</span>
                <span
                  className="text-[11px] font-semibold tracking-wide"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  {t(lang, item.labelKey)}
                </span>
                {active && (
                  <span
                    className="block w-6 h-[3px] rounded-full mt-0.5"
                    style={{ background: accent }}
                  />
                )}
              </button>
            );
          })}
        </div>
        {/* Safe area for iPhones */}
        <div
          className="h-[env(safe-area-inset-bottom,0px)]"
          style={{ background: isDark ? "rgba(15,15,26,0.95)" : "rgba(255,255,255,0.95)" }}
        />
      </nav>
    </div>
  );
}
