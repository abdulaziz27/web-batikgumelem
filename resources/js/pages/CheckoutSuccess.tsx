import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useCart } from '@/hooks/useCart';
import { formatRupiah } from '@/utils/formatters';
import { Head, router } from '@inertiajs/react';
import { CheckCircle, Package, ArrowRight } from 'lucide-react';
import { useEffect } from 'react';

interface Props {
    order: {
        id: number;
        order_number: string;
        status: string;
        total_price: number;
        total_amount: number;
        payment_status: string;
        payment_method: string;
    };
}

const CheckoutSuccess = ({ order }: Props) => {
    // Safer cart access with try-catch
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

    return (
        <Layout>
            <Head title="Pembayaran Berhasil" />
            <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-3xl">
                    <div className="mb-8">
                        <h1 className="text-batik-brown text-2xl font-bold tracking-tight">
                            Pembayaran Berhasil
                        </h1>
                    </div>

                    <Card>
                        <CardHeader>
                            <div className="flex items-center space-x-2">
                                <CheckCircle className="h-5 w-5 text-green-500" />
                                <CardTitle>Pembayaran Berhasil</CardTitle>
                            </div>
                            <CardDescription>
                                Pembayaran Anda telah berhasil diproses dan pesanan akan segera dikirim
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

                                {/* Success Status */}
                                <div className="rounded-lg border border-green-200 bg-green-50 p-4">
                                    <div className="flex items-center space-x-2">
                                        <CheckCircle className="h-5 w-5 text-green-500" />
                                        <span className="font-medium text-green-800">
                                            Pembayaran Berhasil
                                        </span>
                                    </div>
                                    <p className="mt-2 text-sm text-green-700">
                                        Terima kasih! Pembayaran Anda telah berhasil diverifikasi. Pesanan akan segera diproses dan dikirim.
                                    </p>
                                </div>

                                {/* Next Steps */}
                                <div className="space-y-4">
                                    <h3 className="font-semibold">Langkah Selanjutnya:</h3>
                                    <div className="rounded-lg border p-4">
                                        <ol className="list-decimal space-y-2 pl-4">
                                            <li>Kami akan memproses pesanan Anda dalam 1-2 hari kerja</li>
                                            <li>Anda akan menerima email konfirmasi dengan detail pengiriman</li>
                                            <li>Pesanan akan dikirim sesuai alamat yang telah Anda berikan</li>
                                            <li>Pantau status pesanan melalui halaman riwayat pesanan</li>
                                        </ol>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="flex flex-col space-y-4">
                            {/* Tombol Detail Pesanan */}
                            <Button
                                onClick={() => router.visit(`/orders/detail/${order.order_number}`)}
                                className="bg-batik-brown hover:bg-batik-brown/90 w-full"
                            >
                                <Package className="mr-2 h-4 w-4" />
                                Lihat Detail Pesanan
                            </Button>
                            
                            {/* Tombol Kembali Berbelanja */}
                            {/* <Button
                                variant="outline"
                                onClick={() => router.visit('/products')}
                                className="w-full"
                            >
                                <ArrowRight className="mr-2 h-4 w-4" />
                                Lanjut Berbelanja
                            </Button> */}
                            
                            {/* Tombol Kembali ke Home */}
                            <Button
                                variant="outline"
                                onClick={() => router.visit('/')}
                                className="w-full"
                            >
                                Kembali ke Beranda
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </Layout>
    );
};

export default CheckoutSuccess;
