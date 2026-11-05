import { usePage } from '@inertiajs/react';

/**
 * Hook central i18n pour EliteSport.
 * Usage : const { __, locale, isRTL } = useTranslation();
 */
export function useTranslation() {
    const { translations = {}, locale = 'fr' } = usePage().props;

    const __ = (key, replacements = {}) => {
        let value = translations[key];
        if (value === undefined || value === null) return key;
        Object.keys(replacements).forEach((r) => {
            value = value.replace(`:${r}`, replacements[r]);
        });
        return value;
    };

    return { __, locale, isRTL: locale === 'ar' };
}