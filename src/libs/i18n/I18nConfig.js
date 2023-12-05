import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

/**
 * i18n config file
 */
import en from './messages/en.json';
import ko from './messages/kr.json';

const resources = {
    en: {
        translation: en,
    },
    ko: {
        translation: ko,
    },
};

i18n.use(initReactI18next) // passes i18n down to react-i18next
    .init({
        fallbackLng: 'ko',
        resources,
        lng: 'ko',
        interpolation: {
            escapeValue: false, // react already safes from xss
        },
    });

export default i18n;
