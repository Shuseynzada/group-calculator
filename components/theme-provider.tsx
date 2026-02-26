"use client";

import { createContext, useContext, useEffect, useState } from "react";
import {
  I18nContext,
  LangContext,
  translations,
  getSavedLang,
  saveLang,
  type Lang,
} from "@/lib/i18n";

type Theme = "light" | "dark";

const ThemeContext = createContext<{
  theme: Theme;
  toggle: () => void;
}>({
  theme: "light",
  toggle: () => {},
});

export function useTheme() {
  return useContext(ThemeContext);
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");
  const [lang, setLangState] = useState<Lang>("az");

  useEffect(() => {
    // Theme
    const storedTheme = localStorage.getItem("gc_theme") as Theme | null;
    if (storedTheme) {
      setTheme(storedTheme);
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setTheme("dark");
    }
    // Language
    setLangState(getSavedLang());
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("gc_theme", theme);
  }, [theme]);

  function toggleTheme() {
    setTheme((t) => (t === "dark" ? "light" : "dark"));
  }

  function setLang(newLang: Lang) {
    setLangState(newLang);
    saveLang(newLang);
  }

  return (
    <ThemeContext.Provider value={{ theme, toggle: toggleTheme }}>
      <LangContext.Provider value={{ lang, setLang }}>
        <I18nContext.Provider value={translations[lang]}>
          {children}
        </I18nContext.Provider>
      </LangContext.Provider>
    </ThemeContext.Provider>
  );
}
