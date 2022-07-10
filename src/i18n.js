import en from './locales/en.json'
import fr from './locales/fr.json'
import es from './locales/es.json'
import it from './locales/it.json'
import i18n from "i18next";
import {initReactI18next} from "react-i18next";

const resources = {
    en: {
        translation: en,
    },
    fr: {
        translation: fr,
    },
    es: {
        translation: es,
    },
    it: {
        translation: it,
    }
};

i18n.use(initReactI18next).init({
    resources,
    lng: 'en',
    fallbackLng: 'cn',
    detection: {
        caches: ['localStorage', 'sessionStorage', 'cookie'],
    }
});

export default i18n;