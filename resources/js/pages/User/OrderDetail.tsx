import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Check, Clock, CreditCard, Loader2, Package, ShoppingBag, X } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { formatRupiah } from '@/utils/formatters';

// Add Midtrans global window type definition
declare global {
    interface Window {
        snap?: any;
    }
}

interface OrderItem {
    id: number;
    product: {
        id: number;
        name: string;
        slug: string;
        images: string[];
    };
    quantity: number;
    price: number;
    size: string;
}

interface ShippingAddress {
    full_name: string;
    address: string;
    city: string;
    province: string;
    postal_code: string;
    phone: string;
}

interface Order {
    id: number;
    order_number: string;
    status: string;
    payment_status: string;
    payment_method: string;
    payment_url: string | null;
    shipping_method: {
        id: string;
        name: string;
        company: string;
        price: number;
    };
    shipping_cost: number;
    tracking_number: string | null;
    tracking_url: string | null;
    total_price: number;
    total_amount: number;
    created_at: string;
    shipping_address: ShippingAddress;
    items: OrderItem[];
    notes: string | null;
    admin_notes: string | null;
}

interface OrderDetailProps {
    order: Order;
}

export default function OrderDetail({ order }: OrderDetailProps) {
    const [paymentToken, setPaymentToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    // Parse payment URL if it's JSON
    useEffect(() => {
        if (order.payment_url) {
            try {
                // Check if it's a JSON string
                const paymentData = JSON.parse(order.payment_url);

                // Extract token directly from JSON
                if (paymentData.token) {
                    setPaymentToken(paymentData.token);
                } else {
                    // Fallback to extracting from URL
                    const tokenMatch = order.payment_url.match(/([^\/]+)$/);
                    if (tokenMatch && tokenMatch[1]) {
                        setPaymentToken(tokenMatch[1]);
                    }
                }
            } catch (e) {
                // If not JSON, try to extract token from URL
                const tokenMatch = order.payment_url.match(/([^\/]+)$/);
                if (tokenMatch && tokenMatch[1]) {
                    setPaymentToken(tokenMatch[1]);
                }
            }
        }
    }, [order.payment_url]);

    // Load Snap.js script
    useEffect(() => {
        // Remove existing script if any
        const existingScript = document.getElementById('midtrans-script');
        if (existingScript) {
            document.body.removeChild(existingScript);
        }

        // Load new script
        const midtransScriptUrl = 'https://app.sandbox.midtrans.com/snap/snap.js';
        const script = document.createElement('script');
        script.id = 'midtrans-script';
        script.src = midtransScriptUrl;
        script.setAttribute('data-client-key', 'SB-Mid-client-xo3JszBk1gen0AEn');

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

    // Handle payment
    const handlePayNow = () => {
        setIsLoading(true);

        // Check if snap.js is loaded
        if (window.snap && paymentToken) {
            console.log('Opening Snap payment modal with token:', paymentToken);

            window.snap.pay(paymentToken, {
                onSuccess: function (result: any) {
                    console.log('Payment success:', result);
                    // Check payment status after a short delay
                    setTimeout(() => {
                        checkPaymentStatus(order.id);
                    }, 1500);
                },
                onPending: function (result: any) {
                    console.log('Payment pending:', result);
                    setTimeout(() => {
                        checkPaymentStatus(order.id);
                    }, 1500);
                },
                onError: function (result: any) {
                    console.error('Payment error:', result);
                    setIsLoading(false);
                },
                onClose: function () {
                    console.log('Payment widget closed');
                    setIsLoading(false);
                },
            });
        } else {
            console.error('Snap.js not loaded or token not available');
            // Fallback to direct URL (original behavior)
            if (order.payment_url) {
                window.location.href = order.payment_url;
            }
            setIsLoading(false);
        }
    };

    // Add function to check payment status
    const checkPaymentStatus = (orderId: number) => {
        fetch(`/checkout/check-status/${orderId}`)
            .then((response) => {
                if (response.ok) {
                    // Reload the page to show updated status
                    window.location.reload();
                } else {
                    console.error('Failed to check payment status');
                    setIsLoading(false);
                }
            })
            .catch((error) => {
                console.error('Error checking payment status:', error);
                setIsLoading(false);
            });
    };

    // Define breadcrumbs based on order
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Dashboard',
            href: '/dashboard',
        },
        {
            title: 'Pesanan Saya',
            href: '/orders',
        },
        {
            title: `Pesanan #${order.order_number}`,
            href: `/orders/${order.id}`,
        },
    ];

    // Format date to Indonesian format
    const formatDate = (dateString: string) => {
        const options: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        };
        return new Date(dateString).toLocaleDateString('id-ID', options);
    };

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'pending':
                return 'text-orange-500 bg-orange-50';
            case 'processing':
                return 'text-blue-500 bg-blue-50';
            case 'shipped':
                return 'text-purple-500 bg-purple-50';
            case 'completed':
                return 'text-green-500 bg-green-50';
            case 'cancelled':
                return 'text-red-500 bg-red-50';
            default:
                return 'text-gray-500 bg-gray-50';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status.toLowerCase()) {
            case 'pending':
                return <Clock className="h-4 w-4" />;
            case 'processing':
                return <Package className="h-4 w-4" />;
            case 'shipped':
                return <ShoppingBag className="h-4 w-4" />;
            case 'completed':
                return <Check className="h-4 w-4" />;
            case 'cancelled':
                return <X className="h-4 w-4" />;
            default:
                return <Clock className="h-4 w-4" />;
        }
    };

    const getStatusText = (status: string) => {
        switch (status.toLowerCase()) {
            case 'pending':
                return 'Menunggu';
            case 'processing':
                return 'Diproses';
            case 'shipped':
                return 'Dikirim';
            case 'completed':
                return 'Selesai';
            case 'cancelled':
                return 'Dibatalkan';
            default:
                return status;
        }
    };

    const getPaymentStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'paid':
                return 'text-green-500 bg-green-50';
            case 'pending':
                return 'text-orange-500 bg-orange-50';
            case 'failed':
                return 'text-red-500 bg-red-50';
            default:
                return 'text-gray-500 bg-gray-50';
        }
    };

    const getPaymentStatusText = (status: string) => {
        switch (status.toLowerCase()) {
            case 'paid':
                return 'Dibayar';
            case 'pending':
                return 'Menunggu Pembayaran';
            case 'failed':
                return 'Gagal';
            default:
                return status;
        }
    };

    console.log(order);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Pesanan #${order.order_number}`} />

            <div className="space-y-6 p-6">
                <div className="flex flex-col space-y-2 md:flex-row md:items-center md:justify-between md:space-y-0">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Detail Pesanan #{order.order_number}</h1>
                        <p className="text-muted-foreground text-sm">Tanggal pemesanan: {formatDate(order.created_at)}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Button asChild variant="outline">
                            <Link href="/orders">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Kembali ke Daftar Pesanan
                            </Link>
                        </Button>

                        {order.payment_status !== 'paid' && 
                         order.payment_url && 
                         order.status !== 'cancelled' && (
                            <Button
                                onClick={handlePayNow}
                                className="bg-green-600 hover:bg-green-700"
                                disabled={isLoading}
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
                        )}

                        {order.status === 'shipped' && (
                            <Link
                                href={`/orders/${order.id}/complete`}
                                method="put"
                                className="inline-flex items-center justify-center rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-green-700"
                            >
                                <Check className="mr-2 h-4 w-4" />
                                Konfirmasi Terima Pesanan
                            </Link>
                        )}
                    </div>
                </div>

                {/* Order Status */}
                <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">Status Pesanan</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className={`inline-flex items-center space-x-1 rounded-full px-2.5 py-1 text-sm ${getStatusColor(order.status)}`}>
                                {getStatusIcon(order.status)}
                                <span>{getStatusText(order.status)}</span>
                            </div>
                            {order.tracking_number && (
                                <div className="mt-2 text-sm">
                                    <div className="font-medium">Nomor Resi:</div>
                                    <div className="flex items-center justify-between">
                                        <span>{order.tracking_number}</span>
                                        {order.tracking_url && (
                                            <Button asChild variant="link" size="sm" className="h-auto p-0">
                                                <a href={order.tracking_url} target="_blank" rel="noopener noreferrer">
                                                    Lacak
                                                </a>
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">Status Pembayaran</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div
                                className={`inline-flex items-center space-x-1 rounded-full px-2.5 py-1 text-sm ${getPaymentStatusColor(order.payment_status)}`}
                            >
                                <CreditCard className="h-4 w-4" />
                                <span>{getPaymentStatusText(order.payment_status)}</span>
                            </div>
                            <div className="mt-2 text-sm">
                                <div className="font-medium">Metode Pembayaran:</div>
                                <div>{order.payment_method === 'bank_transfer' ? 'Transfer Bank' : 'E-Wallet'}</div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">Pengiriman</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-sm">
                                <div className="font-medium">
                                    {order.shipping_method?.company || 'JNE'} - {order.shipping_method?.name || 'Reguler'}
                                </div>
                                <div className="text-muted-foreground">Biaya: {formatRupiah(order.shipping_cost)}</div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Order Items and Summary */}
                <div className="grid gap-4 md:grid-cols-3">
                    <div className="md:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Item Pesanan</CardTitle>
                                <CardDescription>{order.items.length} item dalam pesanan ini</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {order.items.map((item) => (
                                        <div key={item.id} className="flex items-start space-x-4">
                                            <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border">
                                                <img
                                                    src={item.product.images[0] || '/images/placeholder.png'}
                                                    alt={item.product.name}
                                                    className="h-full w-full object-cover object-center"
                                                />
                                            </div>
                                            <div className="flex-1 space-y-1">
                                                <h3 className="font-medium">
                                                    <Link className="hover:underline" href={`/products/${item.product.slug}`}>
                                                        {item.product.name}
                                                    </Link>
                                                </h3>
                                                {item.size && <p className="text-muted-foreground text-sm">Ukuran: {item.size}</p>}
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm">
                                                        {item.quantity} x {formatRupiah(item.price)}
                                                    </span>
                                                    <span className="font-medium">{formatRupiah(item.quantity * item.price)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {order.notes && (
                                    <div className="mt-6 rounded-lg border p-3">
                                        <h4 className="font-medium">Catatan Saya:</h4>
                                        <p className="text-muted-foreground text-sm">{order.notes}</p>
                                    </div>
                                )}

                                {order.admin_notes && (
                                    <div className="mt-6 rounded-lg border bg-blue-50 p-3">
                                        <h4 className="font-medium">Catatan dari Admin:</h4>
                                        <p className="text-muted-foreground text-sm">{order.admin_notes}</p>
                                    </div>
                                )}

                                {order.status === 'shipped' && (
                                    <div className="mt-6 rounded-lg border bg-yellow-50 p-3">
                                        <h4 className="font-medium">Informasi:</h4>
                                        <p className="text-muted-foreground text-sm">
                                            Harap konfirmasi penerimaan pesanan setelah barang diterima. Jika tidak ada konfirmasi dalam 7 hari
                                            setelah pengiriman, pesanan akan otomatis dianggap selesai.
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    <div>
                        <Card>
                            <CardHeader>
                                <CardTitle>Ringkasan Pesanan</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="space-y-1">
                                        <div className="flex items-center justify-between text-sm">
                                            <span>Subtotal</span>
                                            <span>{formatRupiah(order.total_price)}</span>
                                        </div>
                                        <div className="flex items-center justify-between text-sm">
                                            <span>Ongkos Kirim</span>
                                            <span>{formatRupiah(order.shipping_cost)}</span>
                                        </div>
                                    </div>

                                    <Separator />

                                    <div className="flex items-center justify-between font-medium">
                                        <span>Total</span>
                                        <span>{formatRupiah(order.total_amount)}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="mt-4">
                            <CardHeader>
                                <CardTitle>Alamat Pengiriman</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2 text-sm">
                                    <div className="font-medium">{order.shipping_address.full_name}</div>
                                    <div className="text-muted-foreground">{order.shipping_address.phone}</div>
                                    <div className="text-muted-foreground">
                                        {order.shipping_address.address}, {order.shipping_address.city},
                                        <br />
                                        {order.shipping_address.province}, {order.shipping_address.postal_code}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
