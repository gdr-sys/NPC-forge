"use client";

import { useState, useCallback } from "react";
import { SETTING_LIST, SETTING_COLORS, generateNPC, regenerateField } from "@/data/settings";
import type { SettingKey, GeneratedNPC } from "@/data/settings";
import { NPCCardDisplay } from "./NPCCardDisplay";
import { ExportButtons } from "./ExportButtons";
import { useApp } from "@/lib/AppContext";
import { t } from "@/lib/i18n";
import { createNPC } from "@/lib/npcStorage";

interface Props {
  setting: SettingKey;
  onSettingChange: (s: SettingKey) => void;
  accent: string;
  onSaved: () => void;
}

export function GeneratorTab({ setting, onSettingChange, accent, onSaved }: Props) {
  const { theme, lang } = useApp();
  const isDark = theme === "dark";
  
  const [npc, setNpc] = useState<GeneratedNPC | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("idle");
  const [regenField, setRegenField] = useState<string | null>(null);

  const handleGenerate = useCallback(() => {
    setIsGenerating(true);
    setSaveStatus("idle");
    setTimeout(() => {
      setNpc(generateNPC(setting));
      setIsGenerating(false);
      try { navigator.vibrate?.(30); } catch { /* noop */ }
    }, 180);
  }, [setting]);

  const handleRegen = useCallback((field: keyof GeneratedNPC) => {
    if (!npc) return;
    setRegenField(field);
    setTimeout(() => {
      const val = regenerateField(npc.setting, field);
      setNpc((prev) => (prev ? { ...prev, [field]: val } : prev));
      setRegenField(null);
      try { navigator.vibrate?.(15); } catch { /* noop */ }
    }, 220);
  }, [npc]);

  const handleSave = useCallback(async () => {
    if (!npc || saveStatus !== "idle") return;
    setSaveStatus("saving");
    try {
      createNPC({ ...npc, isFavorite: false, tags: [] });
      setSaveStatus("saved");
      onSaved();
      try { navigator.vibrate?.([20, 50, 20]); } catch { /* noop */ }
    } catch {
      setSaveStatus("idle");
    }
  }, [npc, saveStatus, onSaved]);

  // Get setting label based on language
  const getSettingLabel = (key: SettingKey) => {
    return t(lang, key as Parameters<typeof t>[1]);
  };

  return (
    <>
      {/* ── Header ── */}
      <header className="text-center mb-8">
        <h1
          className="text-3xl font-bold tracking-wide"
          style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}
        >
          {t(lang, "appName")}
        </h1>
        <p
          className="text-xs mt-1 tracking-[3px] uppercase"
          style={{ fontFamily: "var(--font-mono)", color: accent }}
        >
          {t(lang, "appTagline")}
        </p>
      </header>

      {/* ── Setting Selector ── */}
      <section className="mb-8">
        <label
          className="block text-xs font-semibold uppercase tracking-[2px] mb-3"
          style={{ fontFamily: "var(--font-mono)", color: "var(--text-secondary)" }}
        >
          {t(lang, "settingLabel")}
        </label>
        <div className="grid grid-cols-5 gap-2.5">
          {SETTING_LIST.map((s) => {
            const active = setting === s.key;
            const c = SETTING_COLORS[s.key];
            return (
              <button
                key={s.key}
                onClick={() => onSettingChange(s.key)}
                className="relative flex flex-col items-center justify-center rounded-xl transition-all duration-200 py-3 min-h-[68px]"
                style={{
                  background: active
                    ? (isDark ? c + "20" : c + "18")
                    : "var(--bg-elevated)",
                  border: `2px solid ${active ? c : "var(--border-subtle)"}`,
                  boxShadow: active ? `0 0 20px ${c}30` : "none",
                }}
              >
                <span className="text-2xl leading-none">{s.icon}</span>
                <span
                  className="text-[10px] mt-1.5 font-semibold leading-none"
                  style={{ fontFamily: "var(--font-mono)", color: active ? c : "var(--text-muted)" }}
                >
                  {getSettingLabel(s.key)}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* ── Generate Button ── */}
      <button
        onClick={handleGenerate}
        disabled={isGenerating}
        className="w-full py-4 rounded-2xl font-bold text-white text-lg uppercase tracking-[3px] transition-all duration-200 active:scale-[0.97] mb-8 cursor-pointer disabled:cursor-wait"
        style={{
          fontFamily: "var(--font-body)",
          background: isGenerating
            ? `linear-gradient(90deg, ${accent}90, ${accent}, ${accent}90)`
            : `linear-gradient(135deg, ${accent}, ${accent}cc)`,
          backgroundSize: isGenerating ? "200% auto" : "100% auto",
          animation: isGenerating ? "shimmer 1.2s linear infinite" : "none",
          boxShadow: `0 6px 30px ${accent}40`,
        }}
      >
        {isGenerating ? t(lang, "generating") : `⚡  ${t(lang, "generateBtn")}`}
      </button>

      {/* ── NPC Card ── */}
      {npc && !isGenerating && (
        <div className="anim-card-reveal">
          <NPCCardDisplay
            npc={npc}
            accent={accent}
            onRegenerate={handleRegen}
            regenField={regenField}
          />

          {/* ── Actions ── */}
          <div className="flex gap-3 mt-5">
            <button
              onClick={handleSave}
              disabled={saveStatus !== "idle"}
              className={`flex-1 py-3.5 rounded-2xl font-semibold text-sm tracking-wide transition-all duration-200 cursor-pointer disabled:cursor-default ${saveStatus === "saved" ? "anim-bounce-once" : ""}`}
              style={{
                background: saveStatus === "saved"
                  ? (isDark ? "#22c55e18" : "#22c55e12")
                  : "var(--bg-card)",
                border: `1.5px solid ${saveStatus === "saved" ? "#22c55e60" : accent + "30"}`,
                color: saveStatus === "saved" ? "#22c55e" : "var(--text-primary)",
              }}
            >
              {saveStatus === "saving"
                ? t(lang, "saving")
                : saveStatus === "saved"
                ? `✓  ${t(lang, "saved")}`
                : `💾  ${t(lang, "saveBtn")}`}
            </button>
          </div>
          
          {/* Export buttons */}
          <ExportButtons npc={npc} accent={accent} />
        </div>
      )}
    </>
  );
}
