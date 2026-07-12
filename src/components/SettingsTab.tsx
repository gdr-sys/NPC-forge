"use client";

import { useState } from "react";
import { useApp } from "@/lib/AppContext";
import { t } from "@/lib/i18n";
import { exportAllNPCs, importNPCs } from "@/lib/npcStorage";

interface Props {
  accent: string;
}

export function SettingsTab({ accent }: Props) {
  const { theme, setTheme, lang, setLang } = useApp();
  const isDark = theme === "dark";
  
  const [exportStatus, setExportStatus] = useState<"idle" | "busy" | "done">("idle");
  const [importStatus, setImportStatus] = useState<"idle" | "busy" | "done" | "error">("idle");

  const handleExport = () => {
    setExportStatus("busy");
    try {
      const data = exportAllNPCs();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.download = `npc-forge-export-${new Date().toISOString().slice(0, 10)}.json`;
      a.href = url;
      a.click();
      URL.revokeObjectURL(url);
      setExportStatus("done");
      setTimeout(() => setExportStatus("idle"), 2500);
    } catch {
      setExportStatus("idle");
    }
  };

  const handleImport = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      setImportStatus("busy");
      try {
        const text = await file.text();
        const data = JSON.parse(text);
        const items = Array.isArray(data) ? data : [data];
        importNPCs(
          items.map((npc) => ({
            name: npc.name, setting: npc.setting, role: npc.role,
            appearance: npc.appearance, personality: npc.personality,
            secret: npc.secret, motivation: npc.motivation,
            hook: npc.hook, quote: npc.quote,
            isFavorite: npc.isFavorite || false, tags: npc.tags || [],
          }))
        );
        setImportStatus("done");
        setTimeout(() => setImportStatus("idle"), 2500);
      } catch {
        setImportStatus("error");
        setTimeout(() => setImportStatus("idle"), 2500);
      }
    };
    input.click();
  };

  return (
    <>
      {/* ── Header ── */}
      <header className="mb-8">
        <h2
          className="text-2xl font-bold"
          style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}
        >
          {t(lang, "settingsTitle")}
        </h2>
      </header>

      {/* ── Appearance ── */}
      <SectionGroup title={t(lang, "settingsAppearance")} accent={accent}>
        {/* Theme Toggle */}
        <div
          className="rounded-2xl p-4 mb-3"
          style={{ background: "var(--bg-card)", border: "1px solid var(--border-subtle)" }}
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
              {t(lang, "theme")}
            </span>
            <div
              className="flex rounded-xl overflow-hidden"
              style={{ background: "var(--bg-input)", border: "1px solid var(--border-subtle)" }}
            >
              <button
                onClick={() => setTheme("dark")}
                className="px-4 py-2 text-xs font-semibold transition-all"
                style={{
                  background: theme === "dark" ? accent : "transparent",
                  color: theme === "dark" ? "#fff" : "var(--text-muted)",
                }}
              >
                🌙 {t(lang, "themeDark")}
              </button>
              <button
                onClick={() => setTheme("light")}
                className="px-4 py-2 text-xs font-semibold transition-all"
                style={{
                  background: theme === "light" ? accent : "transparent",
                  color: theme === "light" ? "#fff" : "var(--text-muted)",
                }}
              >
                ☀️ {t(lang, "themeLight")}
              </button>
            </div>
          </div>
        </div>

        {/* Language Toggle */}
        <div
          className="rounded-2xl p-4"
          style={{ background: "var(--bg-card)", border: "1px solid var(--border-subtle)" }}
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
              {t(lang, "language")}
            </span>
            <div
              className="flex rounded-xl overflow-hidden"
              style={{ background: "var(--bg-input)", border: "1px solid var(--border-subtle)" }}
            >
              <button
                onClick={() => setLang("en")}
                className="px-4 py-2 text-xs font-semibold transition-all"
                style={{
                  background: lang === "en" ? accent : "transparent",
                  color: lang === "en" ? "#fff" : "var(--text-muted)",
                }}
              >
                🇬🇧 EN
              </button>
              <button
                onClick={() => setLang("it")}
                className="px-4 py-2 text-xs font-semibold transition-all"
                style={{
                  background: lang === "it" ? accent : "transparent",
                  color: lang === "it" ? "#fff" : "var(--text-muted)",
                }}
              >
                🇮🇹 IT
              </button>
            </div>
          </div>
        </div>
      </SectionGroup>

      {/* ── Data ── */}
      <SectionGroup title={t(lang, "dataManagement")} accent={accent}>
        <ActionButton onClick={handleExport} accent={accent} isDark={isDark}>
          {exportStatus === "busy" ? `⏳  ${t(lang, "exporting")}` : exportStatus === "done" ? `✅  ${t(lang, "exported")}` : `📤  ${t(lang, "exportAllJson")}`}
        </ActionButton>
        <ActionButton onClick={handleImport} accent={accent} isDark={isDark}>
          {importStatus === "busy" ? `⏳  ${t(lang, "importing")}` : importStatus === "done" ? `✅  ${t(lang, "imported")}` : importStatus === "error" ? `❌  ${t(lang, "importError")}` : `📥  ${t(lang, "importJson")}`}
        </ActionButton>
      </SectionGroup>

      {/* ── About ── */}
      <SectionGroup title={t(lang, "about")} accent={accent}>
        <div
          className="rounded-2xl p-6 text-center"
          style={{ background: "var(--bg-card)", border: "1px solid var(--border-subtle)" }}
        >
          <div className="text-4xl mb-3">⚒️</div>
          <h3 className="text-xl font-bold mb-1" style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}>
            {t(lang, "appName")}
          </h3>
          <p className="text-xs mb-4" style={{ fontFamily: "var(--font-mono)", color: "var(--text-secondary)" }}>
            {t(lang, "appTagline")} — {t(lang, "version")}
          </p>
          <p className="text-sm leading-relaxed mb-4" style={{ color: "var(--text-secondary)" }}>
            {t(lang, "aboutDesc")}
          </p>
          <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
            {t(lang, "createdBy")}{" "}
            <span className="font-bold" style={{ color: accent }}>Noemi Marcolini</span>
          </p>
        </div>
      </SectionGroup>

      {/* ── Links ── */}
      <SectionGroup title={t(lang, "support")} accent={accent}>
        <a
          href="https://ko-fi.com/noemimarcolini"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-4 px-5 py-4 rounded-2xl transition-all hover:brightness-110 active:scale-[0.98]"
          style={{
            background: isDark ? "linear-gradient(135deg, #FF5E5B18, #FF5E5B08)" : "linear-gradient(135deg, #FF5E5B12, #FF5E5B06)",
            border: "1.5px solid #FF5E5B40",
          }}
        >
          <span className="text-3xl">☕</span>
          <div>
            <p className="text-sm font-bold" style={{ color: "#FF5E5B" }}>
              {t(lang, "buyMeCoffee")}
            </p>
            <p className="text-xs mt-0.5" style={{ color: "var(--text-secondary)", fontFamily: "var(--font-mono)" }}>
              ko-fi.com/noemimarcolini
            </p>
          </div>
        </a>

        <a
          href="https://gdr-sys-portfolio2026.vercel.app/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-4 px-5 py-4 rounded-2xl mt-3 transition-all hover:brightness-110 active:scale-[0.98]"
          style={{
            background: isDark ? `linear-gradient(135deg, ${accent}18, ${accent}08)` : `linear-gradient(135deg, ${accent}12, ${accent}06)`,
            border: `1.5px solid ${accent}40`,
          }}
        >
          <span className="text-3xl">🎲</span>
          <div>
            <p className="text-sm font-bold" style={{ color: accent }}>
              {t(lang, "moreTools")}
            </p>
            <p className="text-xs mt-0.5" style={{ color: "var(--text-secondary)", fontFamily: "var(--font-mono)" }}>
              Portfolio GDR Tools
            </p>
          </div>
        </a>
      </SectionGroup>

      {/* ── Footer ── */}
      <footer className="text-center py-8 mt-6 border-t" style={{ borderColor: "var(--border-subtle)" }}>
        <p className="text-xs" style={{ color: "var(--text-dim)", fontFamily: "var(--font-mono)" }}>
          NPC FORGE {t(lang, "version")} — © 2025 Noemi Marcolini
        </p>
        <p className="text-xs mt-1" style={{ color: "var(--text-dim)" }}>
          Made with ❤️ for tabletop RPG players
        </p>
      </footer>
    </>
  );
}

function SectionGroup({ title, accent, children }: { title: string; accent: string; children: React.ReactNode }) {
  return (
    <section className="mb-8">
      <h3
        className="text-xs font-bold uppercase tracking-[2px] mb-4"
        style={{ fontFamily: "var(--font-mono)", color: accent }}
      >
        {title}
      </h3>
      {children}
    </section>
  );
}

function ActionButton({ onClick, accent, isDark, children }: { onClick: () => void; accent: string; isDark: boolean; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left px-5 py-4 rounded-2xl mb-3 text-sm font-medium transition-all duration-200 cursor-pointer hover:brightness-105 active:scale-[0.98]"
      style={{
        background: "var(--bg-card)",
        border: `1px solid ${isDark ? accent + "20" : accent + "25"}`,
        color: "var(--text-primary)",
      }}
    >
      {children}
    </button>
  );
}
