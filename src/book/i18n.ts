import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
    .use(initReactI18next) // passes i18n down to react-i18next
    .use(Backend)
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        fallbackLng: "en",
        backend: {
            loadPath: '/locales/{{lng}}.json'
        },
        interpolation: {
            escapeValue: false
        }
    });


export default i18n;