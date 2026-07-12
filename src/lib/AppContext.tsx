"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import type { Lang } from "./i18n";

export type Theme = "dark" | "light";

interface AppContextValue {
  theme: Theme;
  setTheme: (t: Theme) => void;
  lang: Lang;
  setLang: (l: Lang) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("dark");
  const [lang, setLangState] = useState<Lang>("en");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Load from localStorage
    const savedTheme = localStorage.getItem("npc-forge-theme") as Theme | null;
    const savedLang = localStorage.getItem("npc-forge-lang") as Lang | null;
    
    if (savedTheme) setThemeState(savedTheme);
    if (savedLang) setLangState(savedLang);
    
    // Detect browser language
    if (!savedLang) {
      const browserLang = navigator.language.toLowerCase();
      if (browserLang.startsWith("it")) setLangState("it");
    }
    
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem("npc-forge-theme", theme);
      document.documentElement.setAttribute("data-theme", theme);
    }
  }, [theme, mounted]);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem("npc-forge-lang", lang);
    }
  }, [lang, mounted]);

  const setTheme = (t: Theme) => setThemeState(t);
  const setLang = (l: Lang) => setLangState(l);

  return (
    <AppContext.Provider value={{ theme, setTheme, lang, setLang }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
