"use client";

import { useCallback, useState } from "react";
import type { GeneratedNPC } from "@/data/settings";
import { SETTING_COLORS, SETTING_LIST } from "@/data/settings";
import { useApp } from "@/lib/AppContext";
import { t } from "@/lib/i18n";

interface Props {
  npc: GeneratedNPC;
  accent: string;
}

export function ExportButtons({ npc, accent }: Props) {
  const { theme, lang } = useApp();
  const isDark = theme === "dark";
  const [exporting, setExporting] = useState(false);

  const exportPNG = useCallback(async () => {
    setExporting(true);
    
    try {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        alert("Canvas not supported");
        setExporting(false);
        return;
      }

      const W = 800;
      const H = 1100;
      canvas.width = W;
      canvas.height = H;

      const color = SETTING_COLORS[npc.setting];
      const info = SETTING_LIST.find((s) => s.key === npc.setting);

      // Colors based on theme
      const bg = isDark ? "#0f0f1a" : "#f5f5f8";
      const cardBg = isDark ? "#1e1e38" : "#ffffff";
      const textMain = isDark ? "#e8e6f0" : "#1a1a2e";
      const textSec = isDark ? "#9e9cc0" : "#666680";

      // Background
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);

      // Card with rounded corners
      ctx.fillStyle = cardBg;
      roundedRect(ctx, 30, 30, W - 60, H - 60, 16);
      ctx.fill();

      // Card border
      ctx.strokeStyle = color;
      ctx.lineWidth = 3;
      roundedRect(ctx, 30, 30, W - 60, H - 60, 16);
      ctx.stroke();

      // Top accent line
      ctx.fillStyle = color;
      ctx.fillRect(33, 33, W - 66, 6);

      let y = 85;

      // Setting badge
      ctx.font = "bold 13px Arial, sans-serif";
      ctx.fillStyle = color;
      ctx.fillText(`${info?.icon || "⚔️"} ${(info?.label || npc.setting).toUpperCase()}`, 55, y);
      y += 40;

      // Name
      ctx.font = "bold 34px Georgia, serif";
      ctx.fillStyle = textMain;
      const nameLines = wrapText(ctx, npc.name, W - 110);
      for (const line of nameLines) {
        ctx.fillText(line, 55, y);
        y += 42;
      }
      y += 5;

      // Role
      ctx.font = "bold 13px Arial, sans-serif";
      ctx.fillStyle = color;
      ctx.fillText(npc.role.toUpperCase(), 55, y);
      y += 30;

      // Divider
      ctx.strokeStyle = color + "50";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(55, y);
      ctx.lineTo(W - 55, y);
      ctx.stroke();
      y += 25;

      // Helper functions
      const drawSectionTitle = (title: string) => {
        ctx.font = "bold 11px Arial, sans-serif";
        ctx.fillStyle = textSec;
        ctx.fillText(title.toUpperCase(), 55, y);
        y += 20;
      };

      const drawText = (text: string, italic = false) => {
        ctx.font = (italic ? "italic " : "") + "14px Georgia, serif";
        ctx.fillStyle = textMain;
        const lines = wrapText(ctx, text, W - 110);
        for (const line of lines) {
          ctx.fillText(line, 55, y);
          y += 20;
        }
        y += 8;
      };

      // Appearance
      drawSectionTitle(lang === "it" ? "ASPETTO" : "APPEARANCE");
      ctx.font = "14px Georgia, serif";
      ctx.fillStyle = textMain;
      for (const trait of npc.appearance) {
        ctx.fillText("• " + trait, 60, y);
        y += 22;
      }
      y += 8;

      // Personality
      drawSectionTitle(lang === "it" ? "PERSONALITÀ" : "PERSONALITY");
      ctx.font = "14px Georgia, serif";
      ctx.fillStyle = textMain;
      ctx.fillText(npc.personality.join("  •  "), 55, y);
      y += 28;

      // Secret
      drawSectionTitle(lang === "it" ? "SEGRETO" : "SECRET");
      drawText(`"${npc.secret}"`, true);

      // Motivation
      drawSectionTitle(lang === "it" ? "MOTIVAZIONE" : "MOTIVATION");
      drawText(npc.motivation);

      // Hook
      drawSectionTitle(lang === "it" ? "HOOK" : "NARRATIVE HOOK");
      drawText(npc.hook);

      // Quote divider
      ctx.strokeStyle = color + "50";
      ctx.beginPath();
      ctx.moveTo(55, y);
      ctx.lineTo(W - 55, y);
      ctx.stroke();
      y += 25;

      // Quote
      ctx.font = "italic 17px Georgia, serif";
      ctx.fillStyle = color;
      const quoteLines = wrapText(ctx, `"${npc.quote}"`, W - 110);
      for (const line of quoteLines) {
        ctx.fillText(line, 55, y);
        y += 24;
      }

      // Watermark
      ctx.font = "11px Arial, sans-serif";
      ctx.fillStyle = textSec + "90";
      ctx.fillText("NPC FORGE — Universal NPC Generator", 55, H - 50);

      // Get image data URL
      const dataUrl = canvas.toDataURL("image/png");
      
      // Open in new window (works better in sandboxed environments)
      const newWindow = window.open("", "_blank");
      if (newWindow) {
        newWindow.document.write(`
          <!DOCTYPE html>
          <html>
          <head>
            <title>NPC: ${npc.name}</title>
            <style>
              body { 
                margin: 0; 
                padding: 20px; 
                background: #111; 
                display: flex; 
                flex-direction: column;
                align-items: center; 
                min-height: 100vh;
                font-family: system-ui, sans-serif;
              }
              img { 
                max-width: 100%; 
                height: auto; 
                border-radius: 12px;
                box-shadow: 0 8px 32px rgba(0,0,0,0.5);
              }
              .instructions {
                color: #888;
                margin-top: 20px;
                text-align: center;
                font-size: 14px;
              }
              .download-btn {
                margin-top: 15px;
                padding: 12px 24px;
                background: ${color};
                color: white;
                border: none;
                border-radius: 8px;
                font-size: 14px;
                font-weight: 600;
                cursor: pointer;
                text-decoration: none;
                display: inline-block;
              }
              .download-btn:hover { opacity: 0.9; }
            </style>
          </head>
          <body>
            <img src="${dataUrl}" alt="NPC Card: ${npc.name}">
            <a class="download-btn" href="${dataUrl}" download="npc-${npc.name.replace(/\s+/g, "-").toLowerCase()}.png">
              📥 Download PNG
            </a>
            <p class="instructions">
              ${lang === "it" 
                ? "Clicca il pulsante per scaricare, oppure tasto destro sull'immagine → Salva immagine" 
                : "Click the button to download, or right-click on image → Save image"}
            </p>
          </body>
          </html>
        `);
        newWindow.document.close();
      }
      
      setExporting(false);
      
    } catch (err) {
      console.error("Export error:", err);
      alert("Export error: " + (err as Error).message);
      setExporting(false);
    }
  }, [npc, isDark, lang]);

  const exportPDF = useCallback(() => {
    const color = SETTING_COLORS[npc.setting];
    const info = SETTING_LIST.find((s) => s.key === npc.setting);
    
    const bgBase = isDark ? "#0f0f1a" : "#f5f5f8";
    const bgCard = isDark ? "#1e1e38" : "#ffffff";
    const textPrimary = isDark ? "#e8e6f0" : "#1a1a2e";
    const textSecondary = isDark ? "#9e9cc0" : "#5a5880";

    const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>NPC: ${npc.name}</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=Playfair+Display:ital,wght@0,700;1,400&display=swap" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    @page { size: A4; margin: 15mm; }
    body { font-family: 'Inter', sans-serif; background: ${bgBase}; padding: 30px; }
    .card {
      background: ${bgCard};
      border-radius: 12px;
      padding: 28px;
      max-width: 500px;
      margin: 0 auto;
      border: 2px solid ${color};
      border-top: 5px solid ${color};
    }
    .badge { display: flex; align-items: center; gap: 8px; margin-bottom: 12px; }
    .badge-icon { font-size: 22px; }
    .badge-label { font-size: 11px; font-weight: 700; color: ${color}; text-transform: uppercase; letter-spacing: 2px; }
    .name { font-family: 'Playfair Display', serif; font-size: 28px; font-weight: 700; color: ${textPrimary}; margin-bottom: 4px; }
    .role { font-size: 13px; font-weight: 600; color: ${color}; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 16px; }
    .divider { height: 1px; background: ${color}30; margin: 14px 0; }
    .section { margin-bottom: 14px; }
    .section-title { font-size: 10px; font-weight: 700; color: ${textSecondary}; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 6px; }
    .section-text { font-size: 13px; line-height: 1.5; color: ${textPrimary}; }
    .section-text.italic { font-style: italic; }
    .pills { display: flex; flex-wrap: wrap; gap: 6px; }
    .pill { display: inline-block; padding: 5px 10px; background: ${color}15; border: 1px solid ${color}30; border-radius: 20px; font-size: 11px; color: ${color}; }
    .quote { font-family: 'Playfair Display', serif; font-size: 16px; font-style: italic; color: ${color}; line-height: 1.4; margin-top: 10px; }
    .watermark { font-size: 9px; color: ${textSecondary}80; text-align: center; margin-top: 20px; }
    @media print { body { padding: 0; background: white; } .card { box-shadow: none; } }
  </style>
</head>
<body>
  <div class="card">
    <div class="badge">
      <span class="badge-icon">${info?.icon || "⚔️"}</span>
      <span class="badge-label">${info?.label || npc.setting}</span>
    </div>
    <h1 class="name">${npc.name}</h1>
    <div class="role">${npc.role}</div>
    <div class="divider"></div>
    <div class="section">
      <div class="section-title">${lang === "it" ? "Aspetto" : "Appearance"}</div>
      <div class="pills">${npc.appearance.map(item => `<span class="pill">${item}</span>`).join("")}</div>
    </div>
    <div class="section">
      <div class="section-title">${lang === "it" ? "Personalità" : "Personality"}</div>
      <div class="pills">${npc.personality.map(item => `<span class="pill">${item}</span>`).join("")}</div>
    </div>
    <div class="section">
      <div class="section-title">${lang === "it" ? "Segreto" : "Secret"}</div>
      <p class="section-text italic">"${npc.secret}"</p>
    </div>
    <div class="section">
      <div class="section-title">${lang === "it" ? "Motivazione" : "Motivation"}</div>
      <p class="section-text">${npc.motivation}</p>
    </div>
    <div class="section">
      <div class="section-title">${lang === "it" ? "Hook Narrativo" : "Narrative Hook"}</div>
      <p class="section-text">${npc.hook}</p>
    </div>
    <div class="divider"></div>
    <p class="quote">"${npc.quote}"</p>
    <p class="watermark">NPC FORGE — Universal NPC Generator</p>
  </div>
  <script>window.onload = () => setTimeout(() => window.print(), 300);</script>
</body>
</html>`;

    const win = window.open("", "_blank");
    if (win) {
      win.document.write(html);
      win.document.close();
    }
  }, [npc, isDark, lang]);

  return (
    <div className="flex gap-3 mt-3">
      <button
        onClick={exportPNG}
        disabled={exporting}
        className="flex-1 py-3.5 rounded-2xl font-semibold text-sm tracking-wide transition-all duration-200 cursor-pointer disabled:opacity-50"
        style={{
          background: "var(--bg-card)",
          border: `1.5px solid ${accent}30`,
          color: "var(--text-primary)",
        }}
      >
        {exporting ? "⏳..." : `📷 ${t(lang, "exportPng")}`}
      </button>
      <button
        onClick={exportPDF}
        className="flex-1 py-3.5 rounded-2xl font-semibold text-sm tracking-wide transition-all duration-200 cursor-pointer"
        style={{
          background: "var(--bg-card)",
          border: `1.5px solid ${accent}30`,
          color: "var(--text-primary)",
        }}
      >
        📄 {t(lang, "exportPdf")}
      </button>
    </div>
  );
}

function roundedRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.arcTo(x + w, y, x + w, y + r, r);
  ctx.lineTo(x + w, y + h - r);
  ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
  ctx.lineTo(x + r, y + h);
  ctx.arcTo(x, y + h, x, y + h - r, r);
  ctx.lineTo(x, y + r);
  ctx.arcTo(x, y, x + r, y, r);
  ctx.closePath();
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let currentLine = "";

  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    const metrics = ctx.measureText(testLine);
    
    if (metrics.width > maxWidth && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  }
  
  if (currentLine) {
    lines.push(currentLine);
  }
  
  return lines;
}
