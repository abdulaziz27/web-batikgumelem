import { usePage } from '@inertiajs/react';
import React from 'react';
import { CartProvider } from './hooks/useCart';
import { CouponProvider } from './hooks/useCoupon';
import { ShippingProvider } from './hooks/useShipping';

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { error: any; errorInfo: any }> {
    constructor(props: { children: React.ReactNode }) {
        super(props);
        this.state = { error: null, errorInfo: null };
    }
    static getDerivedStateFromError(error: any) {
        return { error, errorInfo: null };
    }
    componentDidCatch(error: any, errorInfo: any) {
        this.setState({ error, errorInfo });
    }
    render() {
        if (this.state.error) {
            return (
                <div style={{ color: 'red', padding: 24 }}>
                    <h2>Terjadi error di AppProviders:</h2>
                    <pre>{this.state.error?.toString()}</pre>
                    <pre>{this.state.errorInfo?.componentStack}</pre>
                    <pre>{this.state.error?.stack}</pre>
                </div>
            );
        }
        return this.props.children;
    }
}

// Ekspor komponen utama yang menggunakan usePage, selama masih berada dalam konteks Inertia
export function AppProviders({ children }: { children: React.ReactNode }) {
    try {
        const { auth } = usePage().props as any;
        const user = auth?.user;

        return (
            <ErrorBoundary>
                <CartProvider user={user}>
                    <CouponProvider>
                        <ShippingProvider>{children}</ShippingProvider>
                    </CouponProvider>
                </CartProvider>
            </ErrorBoundary>
        );
    } catch (error) {
        // Jika usePage gagal (biasanya di SSR), makanya dibungkus dengan ErrorBoundary
        return <ErrorBoundary>{children}</ErrorBoundary>;
    }
}
