import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import enTranslation from "../../public/locales/en/translation.json";
import msTranslation from "../../public/locales/ms/translation.json";

const resources = {
  en: {
    translation: enTranslation,
  },
  ms: {
    translation: msTranslation,
  },
} as const;

if (!i18n.isInitialized) {
  void i18n.use(initReactI18next).init({
    resources,
    lng: "en",
    fallbackLng: "en",
    supportedLngs: ["en", "ms"],
    interpolation: {
      escapeValue: false,
    },
    returnNull: false,
  });
}

export { i18n };
