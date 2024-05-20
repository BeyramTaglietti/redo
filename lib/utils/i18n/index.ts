import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "./languages/en.json";
import es from "./languages/es.json";
import fr from "./languages/fr.json";
import it from "./languages/it.json";

enum SupportedLanguages {
  en = "en",
  it = "it",
  es = "es",
  fr = "fr",
}

export const resources: {
  [key in SupportedLanguages]: { translation: any };
} = {
  es: {
    translation: es,
  },
  en: {
    translation: en,
  },
  it: {
    translation: it,
  },
  fr: {
    translation: fr,
  },
};

i18n.use(initReactI18next).init({
  compatibilityJSON: "v3",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
  resources,
});

export { SupportedLanguages, i18n };
