"use client";

import { useState, useEffect, useCallback } from "react";
import { SETTING_COLORS, SETTING_LIST } from "@/data/settings";
import type { SettingKey } from "@/data/settings";
import { NPCDetailModal } from "./NPCDetailModal";
import { useApp } from "@/lib/AppContext";
import { t } from "@/lib/i18n";
import { listNPCs, updateNPC, deleteNPC as deleteNPCFromStorage, type SavedNPC } from "@/lib/npcStorage";

interface Props {
  refreshKey: number;
  accent: string;
}

export function SavedTab({ refreshKey, accent }: Props) {
  const { theme, lang } = useApp();
  const isDark = theme === "dark";
  
  const [npcs, setNpcs] = useState<SavedNPC[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<SavedNPC | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    try {
      const result = listNPCs({
        setting: filter !== "all" && filter !== "favorites" ? filter : null,
        favoritesOnly: filter === "favorites",
        search: search.trim(),
      });
      setNpcs(result);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [filter, search]);

  useEffect(() => { load(); }, [load, refreshKey]);

  const toggleFav = (npc: SavedNPC) => {
    try {
      updateNPC(npc.id, { isFavorite: !npc.isFavorite });
      load();
    } catch (e) { console.error(e); }
  };

  const deleteNPC = (id: string) => {
    if (!confirm(t(lang, "confirmDelete"))) return;
    try {
      deleteNPCFromStorage(id);
      setSelected(null);
      load();
    } catch (e) { console.error(e); }
  };

  const getSettingLabel = (key: SettingKey) => t(lang, key as Parameters<typeof t>[1]);

  // Simplified filters - main ones first, then settings
  const mainFilters = [
    { key: "all", label: t(lang, "filterAll"), color: accent, icon: "📋" },
    { key: "favorites", label: t(lang, "filterFavorites"), color: "#f1c40f", icon: "★" },
  ];

  const settingFilters = SETTING_LIST.map((s) => ({
    key: s.key,
    label: getSettingLabel(s.key),
    color: SETTING_COLORS[s.key],
    icon: s.icon,
  }));

  return (
    <>
      {/* ── Header ── */}
      <header className="mb-5">
        <h2
          className="text-2xl font-bold"
          style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}
        >
          {t(lang, "savedTitle")}
        </h2>
        <p className="text-xs mt-1" style={{ color: "var(--text-secondary)" }}>
          {t(lang, "savedSubtitle")}
        </p>
      </header>

      {/* ── Search ── */}
      <div className="mb-4">
        <input
          type="text"
          placeholder={`🔍  ${t(lang, "searchPlaceholder")}`}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all duration-200"
          style={{
            background: "var(--bg-input)",
            border: "1.5px solid var(--border-medium)",
            color: "var(--text-primary)",
            fontFamily: "var(--font-body)",
          }}
        />
      </div>

      {/* ── Main Filters (All / Favorites) ── */}
      <div className="flex gap-2 mb-3">
        {mainFilters.map((f) => {
          const on = filter === f.key;
          return (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className="flex-1 py-2.5 px-3 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer flex items-center justify-center gap-2"
              style={{
                background: on
                  ? (isDark ? f.color + "25" : f.color + "18")
                  : "var(--bg-elevated)",
                border: `2px solid ${on ? f.color : "var(--border-medium)"}`,
                color: on ? f.color : "var(--text-muted)",
              }}
            >
              <span>{f.icon}</span>
              <span>{f.label}</span>
            </button>
          );
        })}
      </div>

      {/* ── Setting Filters (Grid) ── */}
      <div className="grid grid-cols-5 gap-2 mb-5">
        {settingFilters.map((f) => {
          const on = filter === f.key;
          return (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className="py-2 px-1 rounded-lg text-center transition-all duration-200 cursor-pointer flex flex-col items-center gap-0.5"
              style={{
                background: on
                  ? (isDark ? f.color + "25" : f.color + "18")
                  : "var(--bg-elevated)",
                border: `1.5px solid ${on ? f.color : "var(--border-subtle)"}`,
              }}
            >
              <span className="text-lg">{f.icon}</span>
              <span
                className="text-[9px] font-semibold leading-tight"
                style={{ 
                  color: on ? f.color : "var(--text-muted)",
                  fontFamily: "var(--font-mono)",
                }}
              >
                {f.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* ── List ── */}
      {loading ? (
        <div className="text-center py-16" style={{ color: "var(--text-secondary)" }}>
          <p className="text-lg animate-pulse">{t(lang, "loading")}</p>
        </div>
      ) : npcs.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-5xl mb-4">📭</p>
          <p className="text-base font-medium" style={{ color: "var(--text-secondary)" }}>
            {t(lang, "noSaved")}
          </p>
          <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
            {t(lang, "noSavedHint")}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {npcs.map((npc, i) => {
            const c = SETTING_COLORS[npc.setting as SettingKey] || accent;
            const si = SETTING_LIST.find((s) => s.key === npc.setting);
            return (
              <button
                key={npc.id}
                onClick={() => setSelected(npc)}
                className="w-full text-left rounded-2xl p-4 transition-all duration-200 anim-fade-in-up cursor-pointer hover:brightness-105 active:scale-[0.98]"
                style={{
                  background: "var(--bg-card)",
                  border: `1px solid ${c}30`,
                  borderLeft: `4px solid ${c}`,
                  animationDelay: `${i * 40}ms`,
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      {npc.isFavorite && <span className="text-yellow-400">★</span>}
                      <h3
                        className="font-bold text-base truncate"
                        style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}
                      >
                        {npc.name}
                      </h3>
                    </div>
                    <p
                      className="text-xs mt-0.5"
                      style={{ color: "var(--text-secondary)", fontFamily: "var(--font-mono)" }}
                    >
                      {si?.icon} {getSettingLabel(si?.key as SettingKey)} — {npc.role}
                    </p>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); toggleFav(npc); }}
                    className="text-xl p-2 rounded-full transition-all hover:scale-110"
                    style={{ color: npc.isFavorite ? "#f1c40f" : "var(--text-dim)" }}
                  >
                    {npc.isFavorite ? "★" : "☆"}
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5 mt-2.5">
                  {npc.personality.map((p, j) => (
                    <span
                      key={j}
                      className="px-2.5 py-1 rounded-full text-[11px] font-medium"
                      style={{
                        background: isDark ? c + "18" : c + "12",
                        border: `1px solid ${c}35`,
                        color: c,
                        fontFamily: "var(--font-body)",
                      }}
                    >
                      {p}
                    </span>
                  ))}
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* ── Detail Modal ── */}
      {selected && (
        <NPCDetailModal
          npc={selected}
          onClose={() => setSelected(null)}
          onDelete={deleteNPC}
          onToggleFavorite={() => { toggleFav(selected); setSelected({ ...selected, isFavorite: !selected.isFavorite }); }}
        />
      )}
    </>
  );
}
