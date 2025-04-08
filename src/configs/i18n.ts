import i18n from "i18next";

import { initReactI18next } from "react-i18next";

import translationENG from "@/data/dictionaries/en.json";
import translationInd from "@/data/dictionaries/id.json";

const resources = {
  en: { translation: translationENG },
  id: { translation: translationInd },
};

// Safe access to localStorage
const getLanguage = (): "en" | "ind" => {
  if (typeof window !== "undefined") {
    const lang = localStorage.getItem("I18N_LANGUAGE") as string | null;

    return (lang === "en" || lang === "ind" ) ? lang : "en"; // Default to 'en'
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
