import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useCart } from '@/hooks/useCart';
import { formatRupiah } from '@/utils/formatters';
import { router } from '@inertiajs/react';
import { Check, RefreshCw } from 'lucide-react';
import { useEffect, useState } from 'react';

interface Props {
    order: {
        id: number;
        order_number: string;
        status: string;
        total_price: number;
        total_amount: number;
        payment_status: string;
    };
}

const CheckoutSuccess = ({ order }: Props) => {
    const [isChecking, setIsChecking] = useState(false);
    
    // Safer cart access with try-catch (same pattern as CheckoutPayment)
    let clearCart = () => {};
    try {
        const cart = useCart();
        clearCart = cart.clearCart;
    } catch (error) {
        console.warn("Cart provider not available, using fallback");
    }

    useEffect(() => {
        try {
            clearCart();
        } catch (err) {
            console.warn('Error clearing cart:', err);
        }
    }, []);

    // Auto-poll for payment status updates if not paid
    useEffect(() => {
        let statusCheckInterval: ReturnType<typeof setInterval> | null = null;

        // Only set up polling if the payment is not yet completed
        if (order.payment_status !== 'paid') {
            // Initial check after 5 seconds
            const initialCheckTimeout = setTimeout(() => {
                checkPaymentStatus();

                // Then check every 20 seconds
                statusCheckInterval = setInterval(checkPaymentStatus, 20000);
            }, 5000);

            return () => {
                clearTimeout(initialCheckTimeout);
                if (statusCheckInterval) {
                    clearInterval(statusCheckInterval);
                }
            };
        }
    }, [order.payment_status]);

    const checkPaymentStatus = () => {
        if (isChecking) return; // Prevent multiple simultaneous checks

        setIsChecking(true);
        router.visit(`/checkout/check-status/${order.id}`, {
            onFinish: () => setIsChecking(false),
        });
    };

    return (
        <Layout>
            <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-3xl">
                    <div className="mb-8">
                        <h1 className="text-batik-brown text-2xl font-bold tracking-tight">Pesanan Berhasil</h1>
                    </div>

                    <Card>
                        <CardHeader>
                            <div className="mb-4 flex justify-center">
                                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                                    <Check className="h-8 w-8 text-green-600" />
                                </div>
                            </div>
                            <CardTitle className="text-center text-xl">Terima Kasih Atas Pesanan Anda!</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="mb-6 text-center">
                                <p className="text-gray-600">
                                    {order.payment_status === 'paid'
                                        ? 'Pembayaran Anda telah berhasil diterima.'
                                        : 'Pesanan Anda telah berhasil dibuat dan menunggu pembayaran.'}
                                </p>
                            </div>

                            <div className="rounded-lg bg-gray-50 p-4">
                                <p className="font-medium">Detail Pesanan</p>
                                <p className="text-sm text-gray-600">Nomor Pesanan: {order.order_number}</p>
                                <p className="text-sm text-gray-600">Total: {formatRupiah(order.total_amount)}</p>
                                <p className="text-sm text-gray-600">
                                    Status:{' '}
                                    <span
                                        className={`rounded-full px-2 py-1 text-xs font-medium ${
                                            order.payment_status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                        }`}
                                    >
                                        {order.payment_status === 'paid' ? 'Dibayar' : 'Menunggu Pembayaran'}
                                    </span>
                                </p>

                                {order.payment_status !== 'paid' && (
                                    <Button
                                        onClick={checkPaymentStatus}
                                        disabled={isChecking}
                                        variant="outline"
                                        size="sm"
                                        className="mt-2 flex items-center"
                                    >
                                        <RefreshCw className={`mr-1 h-3 w-3 ${isChecking ? 'animate-spin' : ''}`} />
                                        {isChecking ? 'Memeriksa...' : 'Perbarui Status Pembayaran'}
                                    </Button>
                                )}
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-center">
                            <Button asChild className="bg-batik-indigo hover:bg-batik-indigo/90">
                                <a href="/">Kembali ke Beranda</a>
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </Layout>
    );
};

export default CheckoutSuccess;