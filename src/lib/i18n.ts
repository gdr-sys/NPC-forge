export type Lang = "en" | "it";

export const translations = {
  en: {
    // App
    appName: "NPC Forge",
    appTagline: "Universal NPC Generator",
    version: "v1.1",

    // Navigation
    navGenerate: "Generate",
    navSaved: "Saved",
    navSettings: "Settings",

    // Generator
    settingLabel: "Setting",
    generateBtn: "Generate NPC",
    generating: "Generating…",
    saveBtn: "Save NPC",
    saving: "Saving…",
    saved: "Saved!",
    exportPng: "Export PNG",
    exportPdf: "Export PDF",

    // NPC Card sections
    sectionAppearance: "Appearance",
    sectionPersonality: "Personality",
    sectionSecret: "Secret",
    sectionMotivation: "Motivation",
    sectionHook: "Narrative Hook",
    sectionQuote: "Signature Quote",
    regenerate: "Regenerate",

    // Saved
    savedTitle: "Saved NPCs",
    savedSubtitle: "Your character collection",
    searchPlaceholder: "Search by name or role…",
    filterAll: "All",
    filterFavorites: "Favorites",
    noSaved: "No NPCs saved",
    noSavedHint: "Generate an NPC and save it to see it here",
    loading: "Loading…",
    favorite: "Favorite",
    addFavorite: "Add to Favorites",
    deleteNpc: "Delete NPC",
    confirmDelete: "Delete this NPC?",

    // Settings
    settingsTitle: "Settings",
    dataManagement: "Data Management",
    exportAllJson: "Export all NPCs (JSON)",
    importJson: "Import NPCs from JSON",
    exporting: "Exporting…",
    exported: "Exported!",
    importing: "Importing…",
    imported: "Imported!",
    importError: "Import error",
    about: "About",
    aboutDesc: "Generate instant NPCs for any tabletop RPG. 10 settings, hundreds of names, traits and secrets.",
    createdBy: "Created by",
    support: "Support & Discover",
    buyMeCoffee: "Buy me a coffee",
    moreTools: "More RPG Tools",
    settingsAppearance: "Appearance",
    theme: "Theme",
    themeDark: "Dark",
    themeLight: "Light",
    language: "Language",

    // Settings names
    fantasy: "Fantasy",
    scifi: "Sci-Fi",
    horror: "Horror",
    modern: "Modern",
    historical: "Historical",
    postapoc: "Post-Apoc",
    japanese: "Japan",
    steampunk: "Steampunk",
    pirate: "Pirate",
    western: "Western",
  },
  it: {
    // App
    appName: "NPC Forge",
    appTagline: "Generatore Universale di NPC",
    version: "v1.1",

    // Navigation
    navGenerate: "Genera",
    navSaved: "Salvati",
    navSettings: "Settings",

    // Generator
    settingLabel: "Ambientazione",
    generateBtn: "Genera NPC",
    generating: "Generando…",
    saveBtn: "Salva NPC",
    saving: "Salvataggio…",
    saved: "Salvato!",
    exportPng: "Esporta PNG",
    exportPdf: "Esporta PDF",

    // NPC Card sections
    sectionAppearance: "Aspetto",
    sectionPersonality: "Personalità",
    sectionSecret: "Segreto",
    sectionMotivation: "Motivazione",
    sectionHook: "Hook Narrativo",
    sectionQuote: "Frase Tipica",
    regenerate: "Rigenera",

    // Saved
    savedTitle: "NPC Salvati",
    savedSubtitle: "La tua collezione di personaggi",
    searchPlaceholder: "Cerca per nome o ruolo…",
    filterAll: "Tutti",
    filterFavorites: "Preferiti",
    noSaved: "Nessun NPC salvato",
    noSavedHint: "Genera un NPC e salvalo per vederlo qui",
    loading: "Caricamento…",
    favorite: "Preferito",
    addFavorite: "Aggiungi ai Preferiti",
    deleteNpc: "Elimina NPC",
    confirmDelete: "Eliminare questo NPC?",

    // Settings
    settingsTitle: "Impostazioni",
    dataManagement: "Gestione Dati",
    exportAllJson: "Esporta tutti gli NPC (JSON)",
    importJson: "Importa NPC da file JSON",
    exporting: "Esportando…",
    exported: "Esportato!",
    importing: "Importando…",
    imported: "Importati!",
    importError: "Errore di importazione",
    about: "Informazioni",
    aboutDesc: "Genera NPC istantanei per qualsiasi gioco di ruolo. 10 ambientazioni, centinaia di nomi, tratti e segreti.",
    createdBy: "Creato da",
    support: "Supporta & Scopri",
    buyMeCoffee: "Offrimi un caffè",
    moreTools: "Altri strumenti per GDR",
    settingsAppearance: "Aspetto",
    theme: "Tema",
    themeDark: "Scuro",
    themeLight: "Chiaro",
    language: "Lingua",

    // Settings names
    fantasy: "Fantasy",
    scifi: "Sci-Fi",
    horror: "Horror",
    modern: "Moderno",
    historical: "Storico",
    postapoc: "Post-Apoc",
    japanese: "Giappone",
    steampunk: "Steampunk",
    pirate: "Pirata",
    western: "Western",
  },
} as const;

export type TranslationKey = keyof typeof translations.en;

export function t(lang: Lang, key: TranslationKey): string {
  return translations[lang][key] || translations.en[key] || key;
}
