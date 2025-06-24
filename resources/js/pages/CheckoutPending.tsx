import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { formatRupiah } from '@/utils/formatters';
import { Head, router } from '@inertiajs/react';
import { AlertCircle, Clock, Loader2, RefreshCw, CreditCard, CheckCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useCart } from '@/hooks/useCart';

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
    midtrans_client_key?: string;
    is_production?: boolean;
}

// Add global type for Midtrans Snap
declare global {
    interface Window {
        snap?: any;
    }
}

const CheckoutPending = ({ order, midtrans_client_key = '', is_production = false }: Props) => {
    const [isChecking, setIsChecking] = useState(false);
    const [isProcessingPayment, setIsProcessingPayment] = useState(false);
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

    // Clear cart on mount
    useEffect(() => {
        try {
            clearCart();
        } catch (err) {
            console.warn('Error clearing cart:', err);
        }
    }, []);

    // Extract Snap token
    useEffect(() => {
        let token = '';
        if (order?.payment_token) {
            token = order.payment_token;
        } else if (order?.payment_url) {
            const tokenMatch = order.payment_url.match(/([^\/]+)$/);
            if (tokenMatch && tokenMatch[1]) {
                token = tokenMatch[1];
            }
        }
        setSnapToken(token);
    }, [order]);

    // Load Snap.js script
    useEffect(() => {
        if (!snapToken || !midtrans_client_key) return;

        const existingScript = document.getElementById('midtrans-script');
        if (existingScript) {
            document.body.removeChild(existingScript);
        }

        const midtransScriptUrl = is_production 
            ? 'https://app.midtrans.com/snap/snap.js' 
            : 'https://app.sandbox.midtrans.com/snap/snap.js';

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
    }, [snapToken, midtrans_client_key, is_production]);

    const handlePayment = () => {
        if (!snapToken) {
            setError('Token pembayaran tidak valid');
            return;
        }

        setIsProcessingPayment(true);

        if (window.snap) {
            window.snap.pay(snapToken, {
                onSuccess: function (result: any) {
                    console.log('Payment success:', result);
                    setIsProcessingPayment(false);
                    // Use the order_id from result which should be in ORD-X-timestamp format
                    router.visit(`/checkout/success?order_id=${result.order_id}`);
                },
                onPending: function (result: any) {
                    console.log('Payment pending:', result);
                    setIsProcessingPayment(false);
                    // Stay on this page and show updated status
                    checkPaymentStatus();
                },
                onError: function (result: any) {
                    console.error('Payment error:', result);
                    setIsProcessingPayment(false);
                    router.visit(`/checkout/failed?order_id=${result.order_id}`);
                },
                onClose: function () {
                    console.log('Payment widget closed without completion');
                    setIsProcessingPayment(false);
                    // Stay on pending page - no need to redirect
                }
            });
        } else {
            setError('Payment gateway not initialized');
            setIsProcessingPayment(false);
        }
    };

    const checkPaymentStatus = () => {
        setIsChecking(true);
        router.visit(`/checkout/check-payment/${order.order_number}`, {
            preserveState: true,
            onFinish: () => setIsChecking(false),
            onError: (errors) => {
                console.error('Error checking payment status:', errors);
            }
        });
    };

    return (
        <Layout>
            <Head title="Pembayaran Pesanan" />
            <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-3xl">
                    <div className="mb-8">
                        <h1 className="text-batik-brown text-2xl font-bold tracking-tight">
                            Pembayaran Pesanan
                        </h1>
                    </div>

                    <Card>
                        <CardHeader>
                            <div className="flex items-center space-x-2">
                                <AlertCircle className="h-5 w-5 text-yellow-500" />
                                <CardTitle>Pembayaran Dalam Proses</CardTitle>
                            </div>
                            <CardDescription>
                                Silakan selesaikan pembayaran Anda sesuai instruksi
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                {/* Order Details */}
                                <div className="rounded-lg bg-gray-50 p-4">
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-medium">Nomor Pesanan</span>
                                            <span className="font-mono">{order.order_number}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-medium">Total Pembayaran</span>
                                            <span className="font-semibold">{formatRupiah(order.total_amount)}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-medium">Metode Pembayaran</span>
                                            <span className="capitalize">{order.payment_method.replace('_', ' ')}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Payment Status */}
                                <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
                                    <div className="flex items-center space-x-2">
                                        <Clock className="h-5 w-5 text-yellow-500" />
                                        <span className="font-medium text-yellow-800">
                                            Menunggu Pembayaran
                                        </span>
                                    </div>
                                    <p className="mt-2 text-sm text-yellow-700">
                                        Mohon selesaikan pembayaran Anda dalam waktu 24 jam untuk menghindari pembatalan otomatis
                                    </p>
                                </div>

                                {/* Payment Instructions */}
                                <div className="space-y-4">
                                    <h3 className="font-semibold">Instruksi Pembayaran:</h3>
                                    <div className="rounded-lg border p-4">
                                        <ol className="list-decimal space-y-2 pl-4">
                                            <li>Catat nomor pesanan Anda: <span className="font-mono font-medium">{order.order_number}</span></li>
                                            <li>Lakukan pembayaran sesuai total yang tertera</li>
                                            <li>Pembayaran akan diverifikasi secara otomatis oleh sistem</li>
                                            <li>Status pesanan Anda akan diperbarui setelah pembayaran terverifikasi</li>
                                        </ol>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="flex flex-col space-y-4">
                            {/* Tombol Bayar Sekarang (jika ada token) */}
                            {snapToken && (
                                <Button
                                    onClick={handlePayment}
                                    disabled={isProcessingPayment || !!error}
                                    className="bg-batik-brown hover:bg-batik-brown/90 w-full"
                                >
                                    {isProcessingPayment ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Memproses Pembayaran...
                                        </>
                                    ) : (
                                        <>
                                            <CreditCard className="mr-2 h-4 w-4" />
                                            Bayar Sekarang
                                        </>
                                    )}
                                </Button>
                            )}
                            
                            {/* Tombol Cek Status */}
                            <Button
                                onClick={checkPaymentStatus}
                                disabled={isChecking}
                                variant={snapToken ? "outline" : "default"}
                                className={snapToken ? "w-full" : "bg-batik-indigo hover:bg-batik-indigo/90 w-full"}
                            >
                                {isChecking ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Memeriksa Status...
                                    </>
                                ) : (
                                    <>
                                        <RefreshCw className="mr-2 h-4 w-4" />
                                        Cek Status Pembayaran
                                    </>
                                )}
                            </Button>
                            
                            {/* Tombol Detail Pesanan */}
                            <Button
                                variant="outline"
                                onClick={() => router.visit(`/orders/detail/${order.order_number}`)}
                                className="w-full"
                            >
                                Lihat Detail Pesanan
                            </Button>

                            {/* Error Message */}
                            {error && (
                                <div className="rounded-md bg-red-50 p-3 w-full">
                                    <div className="text-sm text-red-700">{error}</div>
                                </div>
                            )}
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </Layout>
    );
};

export default CheckoutPending;
