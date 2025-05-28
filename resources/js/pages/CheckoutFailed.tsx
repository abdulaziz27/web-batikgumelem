import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { formatRupiah } from '@/utils/formatters';
import { XCircle } from 'lucide-react';
import { Head } from '@inertiajs/react';

interface Props {
    order: {
        id: number;
        order_number: string;
        status: string;
        total_amount: number;
        payment_status: string;
        payment_url: string;
    };
    error_message?: string;
}

const CheckoutFailed = ({ order, error_message }: Props) => {
    const getFailureReason = () => {
        if (error_message) return error_message;
        if (order.payment_status === 'expired') return 'Waktu pembayaran telah habis';
        return 'Pembayaran gagal diproses';
    };

    return (
        <Layout>
            <Head title="Pembayaran Gagal" />
            <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-3xl">
                    <div className="mb-8">
                        <h1 className="text-batik-brown text-2xl font-bold tracking-tight">Pembayaran Gagal</h1>
                    </div>

                    <Card>
                        <CardHeader>
                            <div className="mb-4 flex justify-center">
                                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                                    <XCircle className="h-8 w-8 text-red-600" />
                                </div>
                            </div>
                            <CardTitle className="text-center text-xl">Maaf, Pembayaran Anda Gagal</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="mb-6 text-center">
                                <p className="text-gray-600">
                                    {getFailureReason()}
                                </p>
                            </div>

                            <div className="rounded-lg bg-gray-50 p-4">
                                <p className="font-medium">Detail Pesanan</p>
                                <p className="text-sm text-gray-600">Nomor Pesanan: {order.order_number}</p>
                                <p className="text-sm text-gray-600">Total: {formatRupiah(order.total_amount)}</p>
                                <p className="text-sm text-gray-600">
                                    Status:{' '}
                                    <span className="rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-800">
                                        Gagal
                                    </span>
                                </p>
                            </div>

                            <div className="mt-6 text-center">
                                <p className="text-sm text-gray-600">
                                    Jika Anda mengalami masalah, silakan hubungi customer service kami di:
                                </p>
                                <p className="mt-1 text-sm font-medium text-batik-indigo">
                                    <a href="mailto:help@batikgumelem.com">help@batikgumelem.com</a>
                                </p>
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-center gap-4">
                            <Button asChild variant="outline">
                                <a href="/">Kembali ke Beranda</a>
                            </Button>
                            <Button asChild className="bg-batik-indigo hover:bg-batik-indigo/90">
                                <a href={`/orders/${order.id}`}>Lihat Detail Pesanan</a>
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </Layout>
    );
};

export default CheckoutFailed; 