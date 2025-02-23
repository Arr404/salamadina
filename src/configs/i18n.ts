import i18n from "i18next";

import { initReactI18next } from "react-i18next";

import translationENG from "../locales/en.json";
import translationFR from "../locales/fr.json";

const resources = {
  en: { translation: translationENG },
  fr: { translation: translationFR },
};

// Safe access to localStorage
const getLanguage = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("I18N_LANGUAGE") || "en";
  }

  return "en";
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: getLanguage(),
    fallbackLng: "en",
    keySeparator: false,
    interpolation: { escapeValue: false },
  });

if (typeof window !== "undefined") {
  localStorage.setItem("I18N_LANGUAGE", getLanguage());
}

export default i18n;
