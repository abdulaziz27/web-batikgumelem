import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { formatRupiah } from '@/utils/formatters';
import { Head, router } from '@inertiajs/react';
import { AlertCircle, Clock, Loader2, RefreshCw } from 'lucide-react';
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
}

const CheckoutPending = ({ order }: Props) => {
    const [isChecking, setIsChecking] = useState(false);

    const checkPaymentStatus = () => {
        setIsChecking(true);
        router.visit(`/checkout/check-payment/${order.id}`, {
            preserveState: true,
            onFinish: () => setIsChecking(false),
        });
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
                            <div className="flex items-center space-x-2">
                                <AlertCircle className="h-5 w-5 text-yellow-500" />
                                <CardTitle>Pembayaran Dalam Proses</CardTitle>
                            </div>
                            <CardDescription>Silakan selesaikan pembayaran Anda sesuai instruksi</CardDescription>
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
                            <Button
                                onClick={checkPaymentStatus}
                                disabled={isChecking}
                                className="bg-batik-indigo hover:bg-batik-indigo/90 w-full"
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
                            <Button
                                variant="outline"
                                onClick={() => router.visit(`/orders/${order.id}`)}
                                className="w-full"
                            >
                                Lihat Detail Pesanan
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </Layout>
    );
};

export default CheckoutPending;
