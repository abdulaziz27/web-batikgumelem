import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useCart } from '@/hooks/useCart';
import { formatRupiah } from '@/utils/formatters';
import { router } from '@inertiajs/react';
import { CreditCard, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Head } from '@inertiajs/react';

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

    const handlePayNow = () => {
        if (error) return;
        setIsLoading(true);

        if (window.snap && snapToken) {
            console.log('Opening Snap payment modal with token:', snapToken);
            window.snap.pay(snapToken, {
                onSuccess: (result: any) => {
                    console.log('Payment success:', result);
                    router.visit(`/checkout/success?order_id=${order.id}`, {
                        preserveState: true,
                        preserveScroll: true,
                        replace: true
                    });
                },
                onPending: (result: any) => {
                    console.log('Payment pending:', result);
                    router.visit(`/checkout/success?order_id=${order.id}`, {
                        preserveState: true,
                        preserveScroll: true,
                        replace: true
                    });
                },
                onError: (result: any) => {
                    console.error('Payment error:', result);
                    router.visit(`/checkout/cancel?order_id=${order.id}`, {
                        preserveState: true,
                        preserveScroll: true,
                        replace: true
                    });
                },
                onClose: () => {
                    console.log('Payment widget closed');
                    setIsLoading(false);
                    // Refresh the page to get latest order status
                    router.reload();
                },
            });
        } else {
            console.error('Snap.js not loaded or token not available');
            if (payment_url && payment_url !== 'null') {
                window.location.href = payment_url;
            } else {
                setError('Gateway pembayaran tidak tersedia');
                setIsLoading(false);
            }
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
                            <CardTitle className="flex items-center">
                                <CreditCard className="mr-2 h-5 w-5" />
                                Selesaikan Pembayaran
                            </CardTitle>
                            <CardDescription>Pesanan Anda telah dibuat. Silakan selesaikan pembayaran untuk memproses pesanan Anda.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="mb-6 rounded-lg bg-gray-50 p-4">
                                <p className="font-medium">Detail Pesanan</p>
                                <p className="text-sm text-gray-600">Nomor Pesanan: {order?.order_number}</p>
                                <p className="text-sm text-gray-600">Total: {formatRupiah(order?.total_amount || 0)}</p>
                                <p className="text-sm text-gray-600">
                                    Metode Pembayaran: {order?.payment_method === 'bank_transfer' ? 'Transfer Bank' : 'E-Wallet'}
                                </p>
                            </div>

                            <div className="flex flex-col items-center justify-center">
                                <p className="mb-4 text-center">Klik tombol di bawah untuk melanjutkan ke halaman pembayaran</p>

                                <Button
                                    onClick={handlePayNow}
                                    className="bg-batik-indigo hover:bg-batik-indigo/90"
                                    disabled={isLoading || !snapToken}
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Memproses...
                                        </>
                                    ) : (
                                        'Bayar Sekarang'
                                    )}
                                </Button>
                            </div>
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
};

export default CheckoutPayment;
