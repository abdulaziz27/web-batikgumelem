import '../css/app.css';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { Toaster } from './components/ui/sonner';
import { initializeTheme } from './hooks/use-appearance';
import { CartProvider } from './hooks/useCart';
import { CouponProvider } from './hooks/useCoupon';
import { ShippingProvider } from './hooks/useShipping';

const appName = import.meta.env.VITE_APP_NAME || 'BatikGumelem';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) => resolvePageComponent(`./pages/${name}.tsx`, import.meta.glob('./pages/**/*.tsx')),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(
            <CartProvider>
                <CouponProvider>
                    <ShippingProvider>
                        <App {...props} />
                        <Toaster />
                    </ShippingProvider>
                </CouponProvider>
            </CartProvider>,
        );
    },
    progress: {
        color: '#4B5563',
    },
});

// This will set light / dark mode on load...
initializeTheme();
