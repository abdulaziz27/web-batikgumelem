import { Head, Link, router, usePage } from '@inertiajs/react';
import { Check, ChevronLeft, ChevronRight, Clock, CreditCard, Loader2, Package, ShoppingBag, X } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { formatRupiah } from '@/utils/formatters';

// Add Midtrans global window type definition
declare global {
    interface Window {
        snap?: any;
    }
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Pesanan Saya',
        href: '/orders',
    },
];

interface OrderItem {
    id: number;
    product: {
        name: string;
        images: string[];
    };
    quantity: number;
    price: number;
    size: string;
}

interface Order {
    id: number;
    order_number: string;
    status: string;
    payment_status: string;
    payment_url: string | null;
    total_amount: number;
    created_at: string;
    items: OrderItem[];
}

interface OrdersProps {
    orders: {
        data: Order[];
        links: {
            url: string | null;
            label: string;
            active: boolean;
        }[];
        current_page: number;
        last_page: number;
        from: number;
        to: number;
        total: number;
    };
    midtrans_client_key: string;
    is_production: boolean;
}

export default function Orders({ orders, midtrans_client_key, is_production }: OrdersProps) {
    const { auth } = usePage().props as any;
    const [paymentTokens, setPaymentTokens] = useState<Record<number, string>>({});
    const [loadingOrder, setLoadingOrder] = useState<number | null>(null);

    // Load Snap.js script
    useEffect(() => {
        // Remove existing script if any
        const existingScript = document.getElementById('midtrans-script');
        if (existingScript) {
            document.body.removeChild(existingScript);
        }

        // Load new script
        const midtransScriptUrl = is_production ? 'https://app.midtrans.com/snap/snap.js' : 'https://app.sandbox.midtrans.com/snap/snap.js';

        const script = document.createElement('script');
        script.id = 'midtrans-script';
        script.src = midtransScriptUrl;
        script.setAttribute('data-client-key', midtrans_client_key);

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
    }, [is_production, midtrans_client_key]);

    // Parse payment URLs for each order to extract tokens
    useEffect(() => {
        const tokens: Record<number, string> = {};

        orders.data.forEach((order) => {
            if (order.payment_url) {
                try {
                    // Check if it's a JSON string
                    const paymentData = JSON.parse(order.payment_url);

                    // Extract token directly from JSON
                    if (paymentData.token) {
                        tokens[order.id] = paymentData.token;
                    } else {
                        // Fallback to extracting from URL
                        const tokenMatch = order.payment_url.match(/([^\/]+)$/);
                        if (tokenMatch && tokenMatch[1]) {
                            tokens[order.id] = tokenMatch[1];
                        }
                    }
                } catch (e) {
                    // If not JSON, try to extract token from URL
                    const tokenMatch = order.payment_url.match(/([^\/]+)$/);
                    if (tokenMatch && tokenMatch[1]) {
                        tokens[order.id] = tokenMatch[1];
                    }
                }
            }
        });

        setPaymentTokens(tokens);
    }, [orders.data]);

    // Handle payment for a specific order
    const handlePayment = (orderId: number) => {
        const token = paymentTokens[orderId];
        if (!token) return;

        setLoadingOrder(orderId);

        // Check if snap.js is loaded
        if (window.snap && token) {
            window.snap.pay(token, {
                onSuccess: function (result: any) {
                    console.log('Payment success:', result);
                    // Check payment status after a short delay
                    setTimeout(() => {
                        checkPaymentStatus(orderId);
                    }, 1500);
                },
                onPending: function (result: any) {
                    console.log('Payment pending:', result);
                    setTimeout(() => {
                        checkPaymentStatus(orderId);
                    }, 1500);
                },
                onError: function (result: any) {
                    console.error('Payment error:', result);
                    setLoadingOrder(null);
                },
                onClose: function () {
                    console.log('Payment widget closed');
                    setLoadingOrder(null);
                },
            });
        } else {
            console.error('Snap.js not loaded or token not available');
            // Fallback to direct URL
            const order = orders.data.find((o) => o.id === orderId);
            if (order?.payment_url) {
                window.location.href = order.payment_url;
            }
            setLoadingOrder(null);
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
                    setLoadingOrder(null);
                }
            })
            .catch((error) => {
                console.error('Error checking payment status:', error);
                setLoadingOrder(null);
            });
    };

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

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Pesanan Saya" />

            <div className="space-y-6 p-6">
                <div className="flex flex-col space-y-2 md:flex-row md:items-center md:justify-between md:space-y-0">
                    <h1 className="text-2xl font-bold tracking-tight">Pesanan Saya</h1>
                    <div className="flex items-center space-x-2">
                        <Button asChild variant="outline">
                            <Link href="/dashboard">Kembali ke Dashboard</Link>
                        </Button>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Riwayat Pesanan</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {orders.data.length > 0 ? (
                            <div className="space-y-6">
                                {orders.data.map((order) => (
                                    <div key={order.id} className="rounded-lg border p-4">
                                        <div className="flex flex-col space-y-3 md:flex-row md:items-center md:justify-between md:space-y-0">
                                            <div className="space-y-1">
                                                <div className="font-medium">Pesanan #{order.order_number}</div>
                                                <div className="text-muted-foreground text-sm">{formatDate(order.created_at)}</div>
                                                <div className="flex items-center space-x-2">
                                                    <div
                                                        className={`inline-flex items-center space-x-1 rounded-full px-2 py-1 text-xs ${getStatusColor(order.status)}`}
                                                    >
                                                        {getStatusIcon(order.status)}
                                                        <span>{order.status}</span>
                                                    </div>
                                                    <div className="text-muted-foreground text-sm">{order.items.length} item</div>
                                                </div>
                                            </div>

                                            <div className="flex flex-col items-start space-y-2 md:items-end">
                                                <div className="font-semibold">{formatRupiah(order.total_amount)}</div>
                                                <div className="flex space-x-2">
                                                    <Button asChild variant="outline" size="sm">
                                                        <Link href={`/orders/${order.id}`}>Lihat Detail</Link>
                                                    </Button>

                                                    {order.payment_status !== 'paid' && order.payment_url && order.status !== 'cancelled' && (
                                                        <Button
                                                            onClick={() => handlePayment(order.id)}
                                                            size="sm"
                                                            className="bg-green-600 hover:bg-green-700"
                                                            disabled={loadingOrder === order.id}
                                                        >
                                                            {loadingOrder === order.id ? (
                                                                <>
                                                                    <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                                                                    Memproses...
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <CreditCard className="mr-1 h-3 w-3" />
                                                                    Bayar
                                                                </>
                                                            )}
                                                        </Button>
                                                    )}

                                                    {(order.status === 'pending' || order.status === 'processing') && (
                                                        <Link
                                                            href={`/orders/${order.id}/cancel`}
                                                            method="put"
                                                            as="button"
                                                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90 inline-flex h-8 items-center justify-center rounded-md px-3 py-1 text-xs font-medium shadow"
                                                            onSuccess={() => {
                                                                // Optionally refresh the page or update the order status locally
                                                                router.reload();
                                                            }}
                                                        >
                                                            Batalkan
                                                        </Link>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {/* Pagination */}
                                {orders.last_page > 1 && (
                                    <div className="flex items-center justify-between border-t pt-4">
                                        <div className="text-muted-foreground text-sm">
                                            Menampilkan {orders.from}-{orders.to} dari {orders.total} pesanan
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            {orders.links.map((link, i) => (
                                                <Button
                                                    key={i}
                                                    asChild={!!link.url}
                                                    variant={link.active ? 'default' : 'outline'}
                                                    size="sm"
                                                    disabled={!link.url}
                                                >
                                                    {link.url ? (
                                                        <Link href={link.url}>
                                                            {link.label === '&laquo; Previous' ? (
                                                                <ChevronLeft className="h-4 w-4" />
                                                            ) : link.label === 'Next &raquo;' ? (
                                                                <ChevronRight className="h-4 w-4" />
                                                            ) : (
                                                                link.label
                                                            )}
                                                        </Link>
                                                    ) : (
                                                        <span>
                                                            {link.label === '&laquo; Previous' ? (
                                                                <ChevronLeft className="h-4 w-4" />
                                                            ) : link.label === 'Next &raquo;' ? (
                                                                <ChevronRight className="h-4 w-4" />
                                                            ) : (
                                                                link.label
                                                            )}
                                                        </span>
                                                    )}
                                                </Button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="flex h-[300px] items-center justify-center rounded-lg border border-dashed">
                                <div className="text-center">
                                    <h3 className="text-lg font-medium">Belum ada pesanan</h3>
                                    <p className="text-muted-foreground text-sm">Anda belum melakukan pemesanan produk</p>
                                    <Button asChild className="mt-4" variant="outline">
                                        <Link href="/products">Lihat Produk</Link>
                                    </Button>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
