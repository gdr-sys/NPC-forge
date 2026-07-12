import { fantasy } from "./fantasy";
import { scifi } from "./scifi";
import { horror } from "./horror";
import { modern } from "./modern";
import { historical } from "./historical";
import { postapoc } from "./postapoc";
import { japanese } from "./japanese";
import { steampunk } from "./steampunk";
import { pirate } from "./pirate";
import { western } from "./western";

export type SettingData = typeof fantasy;
export type SettingKey = "fantasy" | "scifi" | "horror" | "modern" | "historical" | "postapoc" | "japanese" | "steampunk" | "pirate" | "western";

export const SETTINGS: Record<SettingKey, SettingData> = {
  fantasy,
  scifi,
  horror,
  modern,
  historical,
  postapoc,
  japanese,
  steampunk,
  pirate,
  western,
};

export const SETTING_COLORS: Record<SettingKey, string> = {
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

export const SETTING_LIST: { key: SettingKey; label: string; icon: string }[] = [
  { key: "fantasy", label: "Fantasy", icon: "⚔️" },
  { key: "scifi", label: "Sci-Fi", icon: "🚀" },
  { key: "horror", label: "Horror", icon: "🩸" },
  { key: "modern", label: "Moderno", icon: "🏙️" },
  { key: "historical", label: "Storico", icon: "🏛️" },
  { key: "postapoc", label: "Post-Apoc", icon: "☢️" },
  { key: "japanese", label: "Giappone", icon: "⛩️" },
  { key: "steampunk", label: "Steampunk", icon: "⚙️" },
  { key: "pirate", label: "Pirata", icon: "🏴‍☠️" },
  { key: "western", label: "Western", icon: "🤠" },
];

export interface GeneratedNPC {
  name: string;
  setting: SettingKey;
  role: string;
  appearance: string[];
  personality: string[];
  secret: string;
  motivation: string;
  hook: string;
  quote: string;
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function pickN<T>(arr: T[], n: number): T[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, n);
}

export function generateNPC(settingKey: SettingKey, lang: "it" | "en" = "it"): GeneratedNPC {
  const data = SETTINGS[settingKey];
  const isMale = Math.random() > 0.5;
  const firstName = pick(isMale ? data.maleNames : data.femaleNames);
  const surname = pick(data.surnames);
  return {
    name: `${firstName} ${surname}`,
    setting: settingKey,
    role: pick(data.roles[lang]),
    appearance: pickN(data.appearance[lang], 3),
    personality: pickN(data.personality[lang], Math.random() > 0.5 ? 3 : 2),
    secret: pick(data.secrets[lang]),
    motivation: pick(data.motivations[lang]),
    hook: pick(data.hooks[lang]),
    quote: pick(data.quotes[lang]),
  };
}

export function regenerateField(settingKey: SettingKey, field: keyof GeneratedNPC, lang: "it" | "en" = "it"): string | string[] {
  const data = SETTINGS[settingKey];
  switch (field) {
    case "name": {
      const isMale = Math.random() > 0.5;
      const firstName = pick(isMale ? data.maleNames : data.femaleNames);
      const surname = pick(data.surnames);
      return `${firstName} ${surname}`;
    }
    case "role":
      return pick(data.roles[lang]);
    case "appearance":
      return pickN(data.appearance[lang], 3);
    case "personality":
      return pickN(data.personality[lang], Math.random() > 0.5 ? 3 : 2);
    case "secret":
      return pick(data.secrets[lang]);
    case "motivation":
      return pick(data.motivations[lang]);
    case "hook":
      return pick(data.hooks[lang]);
    case "quote":
      return pick(data.quotes[lang]);
    default:
      return "";
  }
}
