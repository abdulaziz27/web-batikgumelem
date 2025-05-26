import { useCallback, useEffect } from 'react';

export type Appearance = 'light';

const setCookie = (name: string, value: string, days = 365) => {
    if (typeof document === 'undefined') {
        return;
    }

    const maxAge = days * 24 * 60 * 60;
    document.cookie = `${name}=${value};path=/;max-age=${maxAge};SameSite=Lax`;
};

const applyTheme = () => {
    document.documentElement.classList.remove('dark');
};

export function initializeTheme() {
    // Always set to light mode
    localStorage.setItem('appearance', 'light');
    document.documentElement.classList.remove('dark');
}

export function useAppearance() {
    const updateAppearance = useCallback(() => {
        // Store in localStorage for client-side persistence
        localStorage.setItem('appearance', 'light');

        // Store in cookie for SSR
        setCookie('appearance', 'light');

        applyTheme();
    }, []);

    useEffect(() => {
        updateAppearance();
    }, [updateAppearance]);

    return { appearance: 'light', updateAppearance } as const;
}
