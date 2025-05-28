import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { formatRupiah } from '@/utils/formatters';
import { router } from '@inertiajs/react';
import { Clock, RefreshCw } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Head } from '@inertiajs/react';

interface Props {
    order: {
        id: number;
        order_number: string;
        status: string;
        total_amount: number;
        payment_status: string;
        payment_url: string;
        created_at: string;
    };
}

const CheckoutPending = ({ order }: Props) => {
    const [isChecking, setIsChecking] = useState(false);
    const [timeLeft, setTimeLeft] = useState<string>('');

    // Calculate time left (24 hours from order creation)
    useEffect(() => {
        const calculateTimeLeft = () => {
            const createdAt = new Date(order.created_at);
            const expiryTime = new Date(createdAt.getTime() + 24 * 60 * 60 * 1000); // 24 hours
            const now = new Date();
            const difference = expiryTime.getTime() - now.getTime();

            if (difference > 0) {
                const hours = Math.floor(difference / (1000 * 60 * 60));
                const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
                setTimeLeft(`${hours} jam ${minutes} menit`);
            } else {
                setTimeLeft('Waktu pembayaran telah habis');
                // Redirect to failed page if payment expired
                router.visit(`/checkout/failed?order_id=${order.id}`);
            }
        };

        calculateTimeLeft();
        const timer = setInterval(calculateTimeLeft, 60000); // Update every minute

        return () => clearInterval(timer);
    }, [order]);

    // Auto-poll for payment status updates
    useEffect(() => {
        let statusCheckInterval: ReturnType<typeof setInterval> | null = null;

        // Check every 20 seconds
        statusCheckInterval = setInterval(checkPaymentStatus, 20000);

        return () => {
            if (statusCheckInterval) {
                clearInterval(statusCheckInterval);
            }
        };
    }, []);

    const checkPaymentStatus = () => {
        if (isChecking) return;

        setIsChecking(true);
        router.visit(`/checkout/check-status/${order.id}`, {
            onFinish: () => setIsChecking(false),
            preserveState: true,
        });
    };

    const handlePayNow = () => {
        if (order.payment_url) {
            window.location.href = order.payment_url;
        }
    };

    return (
        <Layout>
            <Head title="Menunggu Pembayaran" />
            <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-3xl">
                    <div className="mb-8">
                        <h1 className="text-batik-brown text-2xl font-bold tracking-tight">Menunggu Pembayaran</h1>
                    </div>

                    <Card>
                        <CardHeader>
                            <div className="mb-4 flex justify-center">
                                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-yellow-100">
                                    <Clock className="h-8 w-8 text-yellow-600" />
                                </div>
                            </div>
                            <CardTitle className="text-center text-xl">Selesaikan Pembayaran Anda</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="mb-6 text-center">
                                <p className="text-gray-600">
                                    Pesanan Anda telah dibuat. Silakan selesaikan pembayaran sebelum batas waktu berakhir.
                                </p>
                                <p className="mt-2 font-medium text-yellow-600">
                                    Sisa waktu: {timeLeft}
                                </p>
                            </div>

                            <div className="rounded-lg bg-gray-50 p-4">
                                <p className="font-medium">Detail Pesanan</p>
                                <p className="text-sm text-gray-600">Nomor Pesanan: {order.order_number}</p>
                                <p className="text-sm text-gray-600">Total: {formatRupiah(order.total_amount)}</p>
                                <p className="text-sm text-gray-600">
                                    Status:{' '}
                                    <span className="rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-800">
                                        Menunggu Pembayaran
                                    </span>
                                </p>

                                <div className="mt-4 flex flex-col gap-2">
                                    <Button
                                        onClick={handlePayNow}
                                        className="bg-batik-indigo hover:bg-batik-indigo/90"
                                    >
                                        Lanjutkan Pembayaran
                                    </Button>
                                    
                                    <Button
                                        onClick={checkPaymentStatus}
                                        disabled={isChecking}
                                        variant="outline"
                                        className="flex items-center"
                                    >
                                        <RefreshCw className={`mr-1 h-3 w-3 ${isChecking ? 'animate-spin' : ''}`} />
                                        {isChecking ? 'Memeriksa...' : 'Perbarui Status Pembayaran'}
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-center">
                            <Button asChild variant="outline">
                                <a href="/">Kembali ke Beranda</a>
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </Layout>
    );
};

export default CheckoutPending; 