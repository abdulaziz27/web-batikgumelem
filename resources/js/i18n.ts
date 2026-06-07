import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './locales/en.json';
import id from './locales/id.json';

export const SUPPORTED_LOCALES = ['id', 'en'] as const;
export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];

export function normalizeLocale(locale: string | undefined | null): SupportedLocale {
    if (locale === 'en') return 'en';
    return 'id';
}

export function initI18n(initialLocale: string) {
    const lng = normalizeLocale(initialLocale);

    if (i18n.isInitialized) {
        if (i18n.language !== lng) i18n.changeLanguage(lng);
        return i18n;
    }

    i18n.use(initReactI18next).init({
        resources: {
            id: { translation: id },
            en: { translation: en },
        },
        lng,
        fallbackLng: 'id',
        interpolation: { escapeValue: false },
        returnNull: false,
        returnObjects: true,
    });

    return i18n;
}

export default i18n;

