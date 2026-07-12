# ⚒️ NPC Forge — Universal NPC Generator

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1-38bdf8?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Drizzle-336791?style=flat-square&logo=postgresql)](https://www.postgresql.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen?style=flat-square)](http://makeapullrequest.com)

> **Generate instant NPCs for any tabletop RPG.** Fantasy, Sci-Fi, Horror, Modern, and more. Save, edit, and export beautiful character cards.


## ✨ Features

### 🎲 Instant NPC Generation
- **One-tap generation** — Create a complete NPC with a single click
- **10 settings/genres** — Fantasy, Sci-Fi, Horror, Modern, Historical, Post-Apocalyptic, Japanese, Steampunk, Pirate, Western
- **Rich databases** — 100+ names, 50+ traits, 30+ secrets per setting
- **Granular regeneration** — Regenerate individual fields while keeping the rest

### 📦 NPC Components
Each generated NPC includes:
- **Name** — Setting-appropriate first and last names
- **Role** — Profession or social position
- **Appearance** — 3 distinctive physical traits
- **Personality** — 2-3 character traits
- **Secret** — Hidden information or dark past
- **Motivation** — What drives them
- **Narrative Hook** — How they can interact with the party
- **Signature Quote** — A memorable line

### 💾 Save & Organize
- Save NPCs to your personal collection, stored locally in the browser (`localStorage`) — no server or database needed
- Mark favorites with ★
- Search by name or role
- Filter by setting or favorites
- Full CRUD operations

### 📷 Export Options
- **PNG Export** — High-quality 1080×1400px cards matching screen design
- **PDF Export** — Print-ready character sheets
- **JSON Export/Import** — Backup and transfer your collection

### 🎨 Appearance
- **Dark & Light themes** — Switch between dark grimoire and clean light mode
- **Dynamic accent colors** — UI colors change based on selected setting
- **Smooth animations** — Card reveals, trait pop-ins, satisfying interactions

### 🌍 Internationalization
- **English** 🇬🇧
- **Italian** 🇮🇹
- Auto-detects browser language

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| Framework | [Next.js 16](https://nextjs.org/) (App Router) |
| Language | [TypeScript 5.9](https://www.typescriptlang.org/) |
| Styling | [Tailwind CSS 4](https://tailwindcss.com/) |
| Persistence | Browser `localStorage` (no database, no backend) |
| Export | Canvas API, Print API |
| Fonts | Playfair Display, Inter, JetBrains Mono |

## 🚀 Getting Started

### Prerequisites
- Node.js 18+

No database, no environment variables, no external services required — the app is fully static/client-side.

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/npc-forge.git
cd npc-forge

# Install dependencies
npm install

# Start development server
npm run dev
```

### Deployment

Since all data lives in the browser's `localStorage` and the app builds to a fully static export, there's no database provisioning step and no Node.js server needed at runtime.

```bash
npm run build
```

This produces a static site in the `out/` folder — upload that folder to any static host.

**Cloudflare Pages** (recommended):
1. Connect the repo (or drag-and-drop the `out/` folder for a manual deploy)
2. Build command: `npm run build`
3. Build output directory: `out`
4. No environment variables needed

Also works on Netlify, GitHub Pages, or any static hosting — just point it at the `out/` directory after building.

## 📁 Project Structure

```
npc-forge/
├── public/
│   ├── manifest.json       # PWA manifest
│   └── icons/              # App icons
├── src/
│   ├── app/
│   │   ├── layout.tsx      # Root layout
│   │   ├── page.tsx        # Home page
│   │   └── globals.css     # Global styles + themes
│   ├── components/
│   │   ├── NPCForgeApp.tsx     # Main app shell
│   │   ├── GeneratorTab.tsx    # NPC generation UI
│   │   ├── NPCCardDisplay.tsx  # NPC card component
│   │   ├── SavedTab.tsx        # Saved NPCs list
│   │   ├── NPCDetailModal.tsx  # NPC detail view
│   │   ├── SettingsTab.tsx     # Settings & preferences
│   │   └── ExportButtons.tsx   # PNG/PDF export
│   ├── data/
│   │   ├── settings.ts     # Generation logic
│   │   ├── fantasy.ts      # Fantasy names/traits
│   │   ├── scifi.ts        # Sci-Fi names/traits
│   │   └── ...             # Other settings
│   └── lib/
│       ├── AppContext.tsx  # Theme/language context
│       ├── i18n.ts         # Translations
│       └── npcStorage.ts   # localStorage-backed NPC persistence
├── package.json
└── README.md
```

## 🎨 Design System

### Color Palette

**Dark Theme:**
- Background: `#0f0f1a` → `#1a1a2e` → `#222240`
- Text: `#e8e6f0` (primary), `#9e9cc0` (secondary)

**Light Theme:**
- Background: `#f5f5f8` → `#ffffff`
- Text: `#1a1a2e` (primary), `#5a5880` (secondary)

### Setting Accent Colors

| Setting | Color |
|---------|-------|
| Fantasy | `#9b59b6` (Purple) |
| Sci-Fi | `#00bcd4` (Cyan) |
| Horror | `#e74c3c` (Red) |
| Modern | `#3498db` (Blue) |
| Historical | `#d4a762` (Gold) |
| Post-Apoc | `#8bc34a` (Green) |
| Japanese | `#e91e63` (Pink) |
| Steampunk | `#ff9800` (Orange) |
| Pirate | `#26c6da` (Teal) |
| Western | `#a1887f` (Brown) |

### Typography

- **Display:** Playfair Display (NPC names, headers)
- **Body:** Inter (UI text, descriptions)
- **Mono:** JetBrains Mono (labels, tags, settings)

## 💾 Data Storage

All NPCs are stored in the browser's `localStorage` under the `npc-forge:npcs` key via `src/lib/npcStorage.ts`, which exposes the same operations the old API used to (`listNPCs`, `createNPC`, `updateNPC`, `deleteNPC`, `exportAllNPCs`, `importNPCs`). Data is per-browser/per-device only — use the JSON export/import feature in Settings to move a collection between devices or back it up.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 💖 Support

If you find this project useful, consider supporting the developer:

[![Ko-fi](https://img.shields.io/badge/Ko--fi-Support%20Me-FF5E5B?style=for-the-badge&logo=ko-fi&logoColor=white)](https://ko-fi.com/noemimarcolini)

## 🔗 Links

- 🎲 [More RPG Tools](https://gdr-sys-portfolio2026.vercel.app/)
- ☕ [Buy me a coffee](https://ko-fi.com/noemimarcolini)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Created with ❤️ by [Noemi Marcolini](https://gdr-sys-portfolio2026.vercel.app/)**

*NPC Forge v1.1 — Universal NPC Generator for Tabletop RPGs*
