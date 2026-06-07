import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import '../css/app.css';
import { AppProviders } from './AppProviders'; // <-- Tambahkan ini
import { Toaster } from './components/ui/sonner';
import { initializeTheme } from './hooks/use-appearance';
import { initI18n } from './i18n';

const appName = 'Batik Gumelem';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) => resolvePageComponent(`./pages/${name}.tsx`, import.meta.glob('./pages/**/*.tsx')),
    setup({ el, App, props }) {
        const root = createRoot(el);
        // Init i18n from server-provided locale (Inertia shared prop)
        // @ts-expect-error inertia page props are dynamic
        initI18n(props?.initialPage?.props?.locale);

        root.render(
            <>
                <AppProviders>
                    {' '}
                    {/* <-- Tambahkan ini */}
                    <App {...props} />
                    <Toaster />
                </AppProviders>{' '}
                {/* <-- Dan ini */}
            </>,
        );
    },
    progress: {
        color: '#4B5563',
    },
});

initializeTheme();
