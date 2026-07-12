"use client";

import { useEffect } from "react";
import { SETTING_COLORS, SETTING_LIST } from "@/data/settings";
import type { SettingKey, GeneratedNPC } from "@/data/settings";
import { ExportButtons } from "./ExportButtons";
import { useApp } from "@/lib/AppContext";
import { t } from "@/lib/i18n";

interface SavedNPC {
  id: string;
  name: string;
  setting: string;
  role: string;
  appearance: string[];
  personality: string[];
  secret: string;
  motivation: string;
  hook: string;
  quote: string;
  isFavorite: boolean;
  tags: string[];
  createdAt: string;
}

interface Props {
  npc: SavedNPC;
  onClose: () => void;
  onDelete: (id: string) => void;
  onToggleFavorite: () => void;
}

export function NPCDetailModal({ npc, onClose, onDelete, onToggleFavorite }: Props) {
  const { theme, lang } = useApp();
  const isDark = theme === "dark";
  
  const color = SETTING_COLORS[npc.setting as SettingKey] || "#9b59b6";
  const si = SETTING_LIST.find((s) => s.key === npc.setting);

  const exportNpc: GeneratedNPC = {
    name: npc.name,
    setting: npc.setting as SettingKey,
    role: npc.role,
    appearance: npc.appearance,
    personality: npc.personality,
    secret: npc.secret,
    motivation: npc.motivation,
    hook: npc.hook,
    quote: npc.quote,
  };

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const getSettingLabel = (key: SettingKey) => t(lang, key as Parameters<typeof t>[1]);

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center" onClick={onClose}>
      {/* Backdrop */}
      <div
        className="absolute inset-0 anim-fade-in"
        style={{ background: isDark ? "rgba(0,0,0,0.7)" : "rgba(0,0,0,0.5)" }}
      />

      {/* Sheet */}
      <div
        className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-t-3xl anim-slide-up"
        style={{ background: isDark ? "#13132a" : "#ffffff" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Handle */}
        <div
          className="sticky top-0 z-10 flex justify-center pt-3 pb-2"
          style={{ background: isDark ? "#13132a" : "#ffffff" }}
        >
          <div
            className="w-10 h-1.5 rounded-full"
            style={{ background: isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.15)" }}
          />
        </div>

        <div className="px-6 pb-8">
          {/* ── Header ── */}
          <div className="flex items-start justify-between mb-5">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg">{si?.icon}</span>
                <span
                  className="text-xs font-semibold uppercase tracking-[2px]"
                  style={{ fontFamily: "var(--font-mono)", color }}
                >
                  {getSettingLabel(si?.key as SettingKey)}
                </span>
              </div>
              <h2
                className="text-2xl font-bold"
                style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}
              >
                {npc.name}
              </h2>
              <p
                className="text-sm font-medium uppercase tracking-wider mt-1"
                style={{ fontFamily: "var(--font-mono)", color }}
              >
                {npc.role}
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full flex items-center justify-center text-xl transition-all hover:scale-110"
              style={{ color: "var(--text-secondary)", background: "var(--bg-elevated)" }}
            >
              ✕
            </button>
          </div>

          {/* ── Content Card ── */}
          <div
            className="rounded-2xl p-5 mb-5"
            style={{
              background: "var(--bg-card)",
              border: `1px solid ${color}30`,
              borderTop: `4px solid ${color}`,
            }}
          >
            <Section title={t(lang, "sectionAppearance")}>
              <div className="flex flex-wrap gap-2">
                {npc.appearance.map((item, i) => (
                  <Pill key={i} color={color} isDark={isDark}>{item}</Pill>
                ))}
              </div>
            </Section>

            <Section title={t(lang, "sectionPersonality")}>
              <div className="flex flex-wrap gap-2">
                {npc.personality.map((item, i) => (
                  <Pill key={i} color={color} isDark={isDark}>{item}</Pill>
                ))}
              </div>
            </Section>

            <Section title={t(lang, "sectionSecret")}>
              <p className="text-sm italic leading-relaxed" style={{ color: "var(--text-primary)" }}>
                &ldquo;{npc.secret}&rdquo;
              </p>
            </Section>

            <Section title={t(lang, "sectionMotivation")}>
              <p className="text-sm leading-relaxed" style={{ color: "var(--text-primary)" }}>
                {npc.motivation}
              </p>
            </Section>

            <Section title={t(lang, "sectionHook")}>
              <p className="text-sm leading-relaxed" style={{ color: "var(--text-primary)" }}>
                {npc.hook}
              </p>
            </Section>

            <div className="h-px my-4" style={{ background: `${color}25` }} />

            <p
              className="text-base italic leading-relaxed"
              style={{ fontFamily: "var(--font-display)", color }}
            >
              &ldquo;{npc.quote}&rdquo;
            </p>
          </div>

          {/* ── Actions ── */}
          <button
            onClick={onToggleFavorite}
            className="w-full py-3.5 rounded-2xl font-semibold text-sm tracking-wide transition-all cursor-pointer mb-3"
            style={{
              background: npc.isFavorite
                ? (isDark ? "#f1c40f18" : "#f1c40f12")
                : "var(--bg-card)",
              border: `1.5px solid ${npc.isFavorite ? "#f1c40f60" : color + "30"}`,
              color: npc.isFavorite ? "#f1c40f" : "var(--text-primary)",
            }}
          >
            {npc.isFavorite ? `★  ${t(lang, "favorite")}` : `☆  ${t(lang, "addFavorite")}`}
          </button>

          {/* Export buttons */}
          <ExportButtons npc={exportNpc} accent={color} />

          <button
            onClick={() => onDelete(npc.id)}
            className="w-full py-3.5 rounded-2xl font-semibold text-sm tracking-wide transition-all cursor-pointer mt-3"
            style={{
              background: isDark ? "#e74c3c12" : "#e74c3c08",
              border: "1.5px solid #e74c3c35",
              color: "#e74c3c",
            }}
          >
            🗑️  {t(lang, "deleteNpc")}
          </button>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-4">
      <p
        className="text-[11px] font-bold uppercase tracking-[2px] mb-2"
        style={{ fontFamily: "var(--font-mono)", color: "var(--text-secondary)" }}
      >
        {title}
      </p>
      {children}
    </div>
  );
}

function Pill({ color, isDark, children }: { color: string; isDark: boolean; children: React.ReactNode }) {
  return (
    <span
      className="inline-block px-3 py-1.5 rounded-full text-xs font-medium"
      style={{
        background: isDark ? color + "18" : color + "12",
        border: `1px solid ${color}35`,
        color,
      }}
    >
      {children}
    </span>
  );
}
