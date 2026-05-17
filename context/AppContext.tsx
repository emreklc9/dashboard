"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type AccentColor = "red" | "green" | "blue";
export type Language = "tr" | "en";

const ACCENT_CLASSES: Record<AccentColor, string> = {
  red: "accent-red",
  green: "accent-green",
  blue: "accent-blue",
};

interface AppContextValue {
  accent: AccentColor;
  setAccent: (color: AccentColor) => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  accentClass: string;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [accent, setAccent] = useState<AccentColor>("blue");
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState<Language>("tr");

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add("dark");
      root.setAttribute("data-theme", "dark");
    } else {
      root.classList.remove("dark");
      root.setAttribute("data-theme", "light");
    }
  }, [darkMode]);

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.accent = accent;
  }, [accent]);

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  return (
    <AppContext.Provider
      value={{
        accent,
        setAccent,
        darkMode,
        toggleDarkMode,
        language,
        setLanguage,
        accentClass: ACCENT_CLASSES[accent],
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
