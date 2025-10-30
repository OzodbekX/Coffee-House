import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import enJson from '../../public/locales/en/translation.json';
import uzJson from '../../public/locales/uz/translation.json';
i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        fallbackLng: "en",
        debug: false,
        interpolation: { escapeValue: false },
        resources: {
            en: { translation: enJson },
            uz: { translation: uzJson },
        },
    });

export default i18n;
