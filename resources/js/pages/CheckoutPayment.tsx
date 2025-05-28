import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useCart } from '@/hooks/useCart';
import { formatRupiah } from '@/utils/formatters';
import { Head, router } from '@inertiajs/react';
import { CreditCard, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';

interface Props {
    order: {
        id: number;
        order_number: string;
        status: string;
        total_price: number;
        total_amount: number;
        payment_status: string;
        payment_method: string;
        payment_token: string;
        payment_url: string;
    };
    payment_url: string;
    midtrans_client_key: string;
    is_production: boolean;
}

declare global {
    interface Window {
        snap?: any;
    }
}

const CheckoutPayment = ({ order, payment_url, midtrans_client_key, is_production }: Props) => {
    const [isLoading, setIsLoading] = useState(false);
    const [snapToken, setSnapToken] = useState('');
    const [error, setError] = useState<string | null>(null);

    // Safer cart access
    let clearCart = () => {};
    try {
        const cart = useCart();
        clearCart = cart.clearCart;
    } catch (error) {
        console.warn('Cart provider not available, using fallback');
    }

    // Validate order data
    useEffect(() => {
        if (!order || !order.id) {
            setError('Data pesanan tidak valid');
            console.error('Invalid order data:', order);
            return;
        }

        if (!order.payment_token && !order.payment_url) {
            console.warn("Payment token/URL missing - this means the payment wasn't properly initialized");
        }
    }, [order]);

    // Extract token
    useEffect(() => {
        if (error) return;

        let token = '';
        if (order?.payment_token) {
            token = order.payment_token;
        } else if (payment_url && payment_url !== 'null') {
            const tokenMatch = payment_url.match(/([^\/]+)$/);
            if (tokenMatch && tokenMatch[1]) {
                token = tokenMatch[1];
            }
        }

        setSnapToken(token);
    }, [order, payment_url, error]);

    // Load Snap.js
    useEffect(() => {
        if (error || !snapToken) return;

        const existingScript = document.getElementById('midtrans-script');
        if (existingScript) {
            document.body.removeChild(existingScript);
        }

        const midtransScriptUrl = is_production ? 'https://app.midtrans.com/snap/snap.js' : 'https://app.sandbox.midtrans.com/snap/snap.js';

        const script = document.createElement('script');
        script.id = 'midtrans-script';
        script.src = midtransScriptUrl;
        script.setAttribute('data-client-key', midtrans_client_key);

        script.onload = () => console.log('Snap.js loaded successfully');
        script.onerror = () => setError('Gagal memuat payment processor');

        document.body.appendChild(script);

        return () => {
            const scriptToRemove = document.getElementById('midtrans-script');
            if (scriptToRemove) document.body.removeChild(scriptToRemove);
        };
    }, [snapToken, error, is_production, midtrans_client_key]);

    // Clear cart
    useEffect(() => {
        try {
            clearCart();
        } catch (err) {
            console.warn('Error clearing cart:', err);
        }
    }, []);

    useEffect(() => {
        console.log('Order data:', order);
        console.log('Payment URL:', payment_url);
        console.log('Payment token:', order?.payment_token);
    }, [order, payment_url]);

    // Error UI
    if (error) {
        return (
            <Layout>
                <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
                    <div className="mx-auto max-w-3xl">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-red-600">Terjadi Kesalahan</CardTitle>
                                <CardDescription>Tidak dapat memproses pembayaran saat ini</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-700">{error}</p>
                                <p className="mt-2 text-sm text-gray-500">Silakan coba lagi atau hubungi customer service kami</p>
                            </CardContent>
                            <CardFooter>
                                <Button variant="outline" asChild className="mr-auto">
                                    <a href="/">Kembali ke Beranda</a>
                                </Button>
                            </CardFooter>
                        </Card>
                    </div>
                </div>
            </Layout>
        );
    }

    const handlePayment = () => {
        if (!snapToken) {
            setError('Token pembayaran tidak valid');
            return;
        }

        setIsLoading(true);

        if (window.snap) {
            window.snap.pay(snapToken, {
                onSuccess: function (result: any) {
                    console.log('Payment success:', result);
                    router.visit(`/checkout/success?order_id=${result.order_id}`);
                },
                onPending: function (result: any) {
                    console.log('Payment pending:', result);
                    router.visit(`/checkout/pending?order_id=${result.order_id}`);
                },
                onError: function (result: any) {
                    console.error('Payment error:', result);
                    router.visit(`/checkout/failed?order_id=${result.order_id}`);
                },
                onClose: function () {
                    console.log('Payment widget closed without completion');
                    const orderId = `ORD-${order.id}-${Math.floor(Date.now() / 1000)}`;
                    router.visit(`/checkout/pending?order_id=${orderId}`, {
                        preserveState: true,
                        preserveScroll: true,
                    });
                }
            });
        } else {
            setError('Payment gateway not initialized');
            setIsLoading(false);
        }
    };

    return (
        <Layout>
            <Head title="Pembayaran" />
            <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-3xl">
                    <div className="mb-8">
                        <h1 className="text-batik-brown text-2xl font-bold tracking-tight">Pembayaran</h1>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Detail Pembayaran</CardTitle>
                            <CardDescription>Silakan selesaikan pembayaran Anda</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium">Nomor Pesanan</span>
                                    <span>{order.order_number}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium">Total Pembayaran</span>
                                    <span className="font-semibold">{formatRupiah(order.total_amount)}</span>
                                </div>
                                {error && (
                                    <div className="rounded-md bg-red-50 p-4">
                                        <div className="text-sm text-red-700">{error}</div>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-center">
                            <Button
                                onClick={handlePayment}
                                disabled={isLoading || !snapToken || !!error}
                                className="bg-batik-indigo hover:bg-batik-indigo/90 w-full"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Memproses...
                                    </>
                                ) : (
                                    <>
                                        <CreditCard className="mr-2 h-4 w-4" />
                                        Bayar Sekarang
                                    </>
                                )}
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </Layout>
    );
};

export default CheckoutPayment;
