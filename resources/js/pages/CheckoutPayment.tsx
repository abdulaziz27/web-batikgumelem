import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useCart } from '@/hooks/useCart';
import { formatRupiah } from '@/utils/formatters';
import { router } from '@inertiajs/react';
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
    };
    payment_url: string;
}

declare global {
    interface Window {
        snap?: any;
    }
}

const CheckoutPayment = ({ order, payment_url }: Props) => {
    const [isLoading, setIsLoading] = useState(false);
    const [snapToken, setSnapToken] = useState('');
    const { clearCart } = useCart();

    // Extract token from payment_url or order
    useEffect(() => {
        let token = '';

        if (order.payment_token) {
            token = order.payment_token;
        } else if (payment_url) {
            const tokenMatch = payment_url.match(/([^\/]+)$/);
            if (tokenMatch && tokenMatch[1]) {
                token = tokenMatch[1];
            }
        }

        setSnapToken(token);

        // Log untuk debugging
        console.log('Payment token:', token);
        console.log('Payment URL:', payment_url);
    }, [order, payment_url]);

    // Load Snap.js script
    useEffect(() => {
        // Hapus script lama jika ada
        const existingScript = document.getElementById('midtrans-script');
        if (existingScript) {
            document.body.removeChild(existingScript);
        }

        // Load script baru
        const midtransScriptUrl = 'https://app.sandbox.midtrans.com/snap/snap.js';
        const script = document.createElement('script');
        script.id = 'midtrans-script';
        script.src = midtransScriptUrl;
        script.setAttribute('data-client-key', 'SB-Mid-client-xo3JszBk1gen0AEn'); // Gunakan client key dari respons JSON

        script.onload = () => {
            console.log('Snap.js loaded successfully');
        };

        script.onerror = () => {
            console.error('Failed to load Snap.js');
        };

        document.body.appendChild(script);

        return () => {
            // Cleanup
            const scriptToRemove = document.getElementById('midtrans-script');
            if (scriptToRemove) {
                document.body.removeChild(scriptToRemove);
            }
        };
    }, []);

    useEffect(() => {
        clearCart();
        localStorage.removeItem('cart');
    }, []);

    const handlePayNow = () => {
        setIsLoading(true);

        console.log('Pay Now clicked, snap object:', window.snap);

        // Periksa apakah snap.js sudah dimuat
        if (window.snap && snapToken) {
            console.log('Opening Snap payment modal with token:', snapToken);

            window.snap.pay(snapToken, {
                onSuccess: function (result: any) {
                    console.log('Payment success:', result);
                    router.visit(`/checkout/success?order_id=${order.id}`);
                },
                onPending: function (result: any) {
                    console.log('Payment pending:', result);
                    router.visit(`/checkout/success?order_id=${order.id}`);
                },
                onError: function (result: any) {
                    console.error('Payment error:', result);
                    router.visit(`/checkout/cancel?order_id=${order.id}`);
                },
                onClose: function () {
                    console.log('Payment widget closed');
                    setIsLoading(false);
                },
            });
        } else {
            console.error('Snap.js not loaded or token not available');
            // Fallback ke redirect langsung ke payment URL
            window.location.href = payment_url;
        }
    };

    return (
        <Layout>
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
                                <p className="text-sm text-gray-600">Nomor Pesanan: {order.order_number}</p>
                                <p className="text-sm text-gray-600">Total: {formatRupiah(order.total_amount)}</p>
                                <p className="text-sm text-gray-600">
                                    Metode Pembayaran: {order.payment_method === 'bank_transfer' ? 'Transfer Bank' : 'E-Wallet'}
                                </p>
                            </div>

                            <div className="flex flex-col items-center justify-center">
                                <p className="mb-4 text-center">Klik tombol di bawah untuk melanjutkan ke halaman pembayaran</p>

                                <Button onClick={handlePayNow} className="bg-batik-indigo hover:bg-batik-indigo/90" disabled={isLoading}>
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
