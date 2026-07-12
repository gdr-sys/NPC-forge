"use client";

import type { GeneratedNPC } from "@/data/settings";
import { useApp } from "@/lib/AppContext";
import { t } from "@/lib/i18n";

interface Props {
  npc: GeneratedNPC;
  accent: string;
  onRegenerate: (field: keyof GeneratedNPC) => void;
  regenField: string | null;
}

export function NPCCardDisplay({ npc, accent, onRegenerate, regenField }: Props) {
  const { theme, lang } = useApp();
  const isDark = theme === "dark";

  return (
    <div
      className="rounded-2xl overflow-hidden transition-colors duration-300"
      style={{
        background: "var(--bg-card)",
        border: `1px solid ${accent}30`,
        boxShadow: "var(--shadow-card)",
      }}
    >
      {/* ── Top accent bar ── */}
      <div className="h-1.5" style={{ background: `linear-gradient(90deg, ${accent}, ${accent}80)` }} />

      <div className="p-5">
        {/* ── Name & Role ── */}
        <div className="flex items-start gap-3 mb-5">
          <div className="flex-1 min-w-0">
            <h2
              className="text-2xl font-bold leading-tight transition-opacity duration-200"
              style={{
                fontFamily: "var(--font-display)",
                color: "var(--text-primary)",
                opacity: regenField === "name" ? 0.2 : 1,
              }}
            >
              {npc.name}
            </h2>
            <p
              className="text-sm mt-1 font-medium tracking-wider uppercase transition-opacity duration-200"
              style={{
                fontFamily: "var(--font-mono)",
                color: accent,
                opacity: regenField === "role" ? 0.2 : 1,
              }}
            >
              {npc.role}
            </p>
          </div>
          <div className="flex gap-1.5 pt-1">
            <RegenBtn onClick={() => onRegenerate("name")} spinning={regenField === "name"} accent={accent} isDark={isDark} />
            <RegenBtn onClick={() => onRegenerate("role")} spinning={regenField === "role"} accent={accent} isDark={isDark} />
          </div>
        </div>

        {/* ── Divider ── */}
        <div className="h-px mb-5" style={{ background: `${accent}25` }} />

        {/* ── Appearance ── */}
        <CardSection
          title={t(lang, "sectionAppearance")}
          accent={accent}
          onRegen={() => onRegenerate("appearance")}
          spinning={regenField === "appearance"}
          isDark={isDark}
        >
          <div
            className="flex flex-wrap gap-2 transition-opacity duration-200"
            style={{ opacity: regenField === "appearance" ? 0.2 : 1 }}
          >
            {npc.appearance.map((trait, i) => (
              <Pill key={`${trait}-${i}`} accent={accent} delay={i * 80} isDark={isDark}>{trait}</Pill>
            ))}
          </div>
        </CardSection>

        {/* ── Personality ── */}
        <CardSection
          title={t(lang, "sectionPersonality")}
          accent={accent}
          onRegen={() => onRegenerate("personality")}
          spinning={regenField === "personality"}
          isDark={isDark}
        >
          <div
            className="flex flex-wrap gap-2 transition-opacity duration-200"
            style={{ opacity: regenField === "personality" ? 0.2 : 1 }}
          >
            {npc.personality.map((trait, i) => (
              <Pill key={`${trait}-${i}`} accent={accent} delay={i * 80} isDark={isDark}>{trait}</Pill>
            ))}
          </div>
        </CardSection>

        {/* ── Secret ── */}
        <CardSection
          title={t(lang, "sectionSecret")}
          accent={accent}
          onRegen={() => onRegenerate("secret")}
          spinning={regenField === "secret"}
          isDark={isDark}
        >
          <p
            className="text-sm leading-relaxed italic transition-opacity duration-200"
            style={{ color: "var(--text-primary)", opacity: regenField === "secret" ? 0.2 : 1 }}
          >
            &ldquo;{npc.secret}&rdquo;
          </p>
        </CardSection>

        {/* ── Motivation ── */}
        <CardSection
          title={t(lang, "sectionMotivation")}
          accent={accent}
          onRegen={() => onRegenerate("motivation")}
          spinning={regenField === "motivation"}
          isDark={isDark}
        >
          <p
            className="text-sm leading-relaxed transition-opacity duration-200"
            style={{ color: "var(--text-primary)", opacity: regenField === "motivation" ? 0.2 : 1 }}
          >
            {npc.motivation}
          </p>
        </CardSection>

        {/* ── Hook ── */}
        <CardSection
          title={t(lang, "sectionHook")}
          accent={accent}
          onRegen={() => onRegenerate("hook")}
          spinning={regenField === "hook"}
          isDark={isDark}
        >
          <p
            className="text-sm leading-relaxed transition-opacity duration-200"
            style={{ color: "var(--text-primary)", opacity: regenField === "hook" ? 0.2 : 1 }}
          >
            {npc.hook}
          </p>
        </CardSection>

        {/* ── Quote ── */}
        <div className="h-px mt-2 mb-4" style={{ background: `${accent}25` }} />
        <div className="flex items-start gap-3">
          <div className="flex-1">
            <p
              className="text-base leading-relaxed italic transition-opacity duration-200"
              style={{
                fontFamily: "var(--font-display)",
                color: accent,
                opacity: regenField === "quote" ? 0.2 : 1,
              }}
            >
              &ldquo;{npc.quote}&rdquo;
            </p>
          </div>
          <RegenBtn onClick={() => onRegenerate("quote")} spinning={regenField === "quote"} accent={accent} isDark={isDark} />
        </div>
      </div>
    </div>
  );
}

/* ── Sub-components ── */

function CardSection({
  title,
  accent,
  onRegen,
  spinning,
  isDark,
  children,
}: {
  title: string;
  accent: string;
  onRegen: () => void;
  spinning: boolean;
  isDark: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-2">
        <span
          className="text-[11px] font-bold uppercase tracking-[2px]"
          style={{ fontFamily: "var(--font-mono)", color: "var(--text-secondary)" }}
        >
          {title}
        </span>
        <RegenBtn onClick={onRegen} spinning={spinning} accent={accent} isDark={isDark} />
      </div>
      {children}
    </div>
  );
}

function RegenBtn({
  onClick,
  spinning,
  accent,
  isDark,
}: {
  onClick: () => void;
  spinning: boolean;
  accent: string;
  isDark: boolean;
}) {
  return (
    <button
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      className={`w-9 h-9 rounded-full flex items-center justify-center text-base transition-all duration-150 cursor-pointer hover:brightness-125 active:scale-90 shrink-0 ${spinning ? "anim-spin-once" : ""}`}
      style={{
        background: isDark ? `${accent}15` : `${accent}12`,
        border: `1px solid ${accent}35`,
        color: "var(--text-secondary)",
      }}
      aria-label="Regenerate"
    >
      ↻
    </button>
  );
}

function Pill({
  accent,
  delay = 0,
  isDark,
  children,
}: {
  accent: string;
  delay?: number;
  isDark: boolean;
  children: React.ReactNode;
}) {
  return (
    <span
      className="inline-block px-3 py-1.5 rounded-full text-xs font-medium anim-trait-pop"
      style={{
        background: isDark ? `${accent}18` : `${accent}12`,
        border: `1px solid ${accent}35`,
        color: accent,
        animationDelay: `${delay}ms`,
        fontFamily: "var(--font-body)",
      }}
    >
      {children}
    </span>
  );
}
