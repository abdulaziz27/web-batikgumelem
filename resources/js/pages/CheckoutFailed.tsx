import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { formatRupiah } from '@/utils/formatters';
import { Head, router } from '@inertiajs/react';
import { XCircle, RotateCcw, ArrowLeft, Mail } from 'lucide-react';

interface Props {
    order: {
        id: number;
        order_number: string;
        status: string;
        total_amount: number;
        payment_status: string;
        payment_method: string;
        payment_url: string;
    };
    error_message?: string;
}

const CheckoutFailed = ({ order, error_message }: Props) => {
    const getFailureReason = () => {
        if (error_message) return error_message;
        if (order.payment_status === 'expired') return 'Waktu pembayaran telah habis';
        if (order.payment_status === 'denied') return 'Pembayaran ditolak oleh sistem';
        if (order.payment_status === 'cancelled') return 'Pembayaran dibatalkan';
        return 'Pembayaran gagal diproses';
    };

    const getFailureDescription = () => {
        if (order.payment_status === 'expired') {
            return 'Waktu pembayaran telah habis. Silakan buat pesanan baru untuk melanjutkan.';
        }
        return 'Terjadi kesalahan saat memproses pembayaran Anda. Silakan coba lagi atau hubungi customer service.';
    };

    return (
        <Layout>
            <Head title="Pembayaran Gagal" />
            <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-3xl">
                    <div className="mb-8">
                        <h1 className="text-batik-brown text-2xl font-bold tracking-tight">
                            Pembayaran Gagal
                        </h1>
                    </div>

                    <Card>
                        <CardHeader>
                            <div className="flex items-center space-x-2">
                                <XCircle className="h-5 w-5 text-red-500" />
                                <CardTitle>Pembayaran Gagal</CardTitle>
                            </div>
                            <CardDescription>
                                {getFailureDescription()}
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
                                            <span className="capitalize">{order.payment_method?.replace('_', ' ') || 'Tidak ditentukan'}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Failed Status */}
                                <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                                    <div className="flex items-center space-x-2">
                                        <XCircle className="h-5 w-5 text-red-500" />
                                        <span className="font-medium text-red-800">
                                            {getFailureReason()}
                                        </span>
                                    </div>
                                    <p className="mt-2 text-sm text-red-700">
                                        Jangan khawatir, tidak ada biaya yang dikenakan untuk transaksi yang gagal.
                                    </p>
                                </div>

                                {/* Next Steps */}
                                <div className="space-y-4">
                                    <h3 className="font-semibold">Langkah Selanjutnya:</h3>
                                    <div className="rounded-lg border p-4">
                                        <ol className="list-decimal space-y-2 pl-4">
                                            <li>Periksa kembali informasi pembayaran Anda</li>
                                            <li>Pastikan saldo atau limit kartu Anda mencukupi</li>
                                            <li>Coba gunakan metode pembayaran lain</li>
                                            <li>Hubungi customer service jika masalah berlanjut</li>
                                        </ol>
                                    </div>
                                </div>

                                {/* Customer Service Info */}
                                {/* <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                                    <div className="flex items-center space-x-2">
                                        <Mail className="h-5 w-5 text-blue-500" />
                                        <span className="font-medium text-blue-800">
                                            Butuh Bantuan?
                                        </span>
                                    </div>
                                    <p className="mt-2 text-sm text-blue-700">
                                        Hubungi customer service kami di: 
                                        <a href="mailto:admin@batikgumelem.com" className="font-medium underline ml-1">
                                            admin@batikgumelem.com
                                        </a>
                                    </p>
                                </div> */}
                            </div>
                        </CardContent>
                        <CardFooter className="flex flex-col space-y-4">
                            {/* Tombol Belanja Lagi */}
                            <Button
                                onClick={() => router.visit('/products')}
                                className="bg-batik-brown hover:bg-batik-brown/90 w-full"
                            >
                                <RotateCcw className="mr-2 h-4 w-4" />
                                Belanja Lagi
                            </Button>
                            
                            {/* Tombol Detail Pesanan */}
                            <Button
                                variant="outline"
                                onClick={() => router.visit(`/orders/detail/${order.order_number}`)}
                                className="w-full"
                            >
                                Lihat Detail Pesanan
                            </Button>
                            
                            {/* Tombol Kembali ke Home */}
                            {/* <Button
                                variant="outline"
                                onClick={() => router.visit('/')}
                                className="w-full"
                            >
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Kembali ke Beranda
                            </Button> */}
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </Layout>
    );
};

export default CheckoutFailed;
