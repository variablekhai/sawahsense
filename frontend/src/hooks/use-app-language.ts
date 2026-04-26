"use client";

import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import type { Lang } from "@/types";

function normalizeLanguage(language?: string): Lang {
  return language === "ms" ? "ms" : "en";
}

export function useAppLanguage() {
  const { i18n } = useTranslation();

  const language = useMemo(
    () => normalizeLanguage(i18n.resolvedLanguage || i18n.language),
    [i18n.language, i18n.resolvedLanguage],
  );

  const setLanguage = async (nextLanguage: Lang) => {
    await i18n.changeLanguage(nextLanguage);
  };

  const toggleLanguage = async () => {
    await setLanguage(language === "en" ? "ms" : "en");
  };

  return {
    language,
    setLanguage,
    toggleLanguage,
  };
}
