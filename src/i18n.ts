import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "./locales/en/translation.json";
import de from "./locales/de/translation.json";
import zh from "./locales/zh/translation.json";
import hi from "./locales/hi/translation.json";
import es from "./locales/es/translation.json";
import fr from "./locales/fr/translation.json";
import ar from "./locales/ar/translation.json";
import bn from "./locales/bn/translation.json";
import ru from "./locales/ru/translation.json";
import pt from "./locales/pt/translation.json";
import id from "./locales/id/translation.json";

const savedLang = localStorage.getItem("lang") || "en";

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    de: { translation: de },
    zh: { translation: zh },
    hi: { translation: hi },
    es: { translation: es },
    fr: { translation: fr },
    ar: { translation: ar },
    bn: { translation: bn },
    ru: { translation: ru },
    pt: { translation: pt },
    id: { translation: id },
  },
  lng: savedLang,
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
