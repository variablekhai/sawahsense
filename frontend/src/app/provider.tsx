"use client";

import { useEffect } from "react";
import { I18nextProvider } from "react-i18next";

import { i18n } from "@/lib/i18n";

const LANGUAGE_STORAGE_KEY = "sawahsense-language";

export function AppProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const storedLanguage = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);

    if (storedLanguage === "en" || storedLanguage === "ms") {
      void i18n.changeLanguage(storedLanguage);
    }
  }, []);

  useEffect(() => {
    const syncLanguage = (language: string) => {
      document.documentElement.lang = language;
      window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    };

    syncLanguage(i18n.resolvedLanguage || i18n.language || "en");
    i18n.on("languageChanged", syncLanguage);

    return () => {
      i18n.off("languageChanged", syncLanguage);
    };
  }, []);

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
