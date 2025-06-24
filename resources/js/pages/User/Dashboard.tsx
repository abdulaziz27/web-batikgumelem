import { Head, Link, usePage } from '@inertiajs/react';
import { Check, Clock, CreditCard, Package, ShoppingBag } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { formatRupiah } from '@/utils/formatters';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Beranda',
        href: '/dashboard',
    },
];

interface Order {
    id: number;
    order_number: string;
    total_amount: number;
    status: string;
    created_at: string;
}

interface Address {
    id: number;
    name: string;
    address: string;
    city: string;
    province: string;
}

interface UserDashboardProps {
    recentOrders: Order[];
    orderStats: {
        pending: number;
        processing: number;
        shipped: number;
        completed: number;
    };
    shippingAddresses: Address[];
    totalSpent: number;
}

export default function Dashboard({
    recentOrders = [],
    orderStats = { pending: 0, processing: 0, shipped: 0, completed: 0 },
    shippingAddresses = [],
    totalSpent = 0,
}: UserDashboardProps) {
    const { auth } = usePage().props as any;

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
            default:
                return <CreditCard className="h-4 w-4" />;
        }
    };

    const getStatusLabel = (status: string): string => {
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

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Beranda" />

            <div className="space-y-6 p-6">
                <div className="flex flex-col space-y-2 md:flex-row md:items-center md:justify-between md:space-y-0">
                    <h1 className="text-2xl font-bold tracking-tight">Selamat datang, {auth.user.name}</h1>
                    <div className="flex items-center space-x-2">
                        <Button asChild variant="outline">
                            <Link href="/orders">Lihat Semua Pesanan</Link>
                        </Button>
                    </div>
                </div>

                {/* Order Stats Cards */}
                <div className="grid gap-4 md:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Pesanan Tertunda</CardTitle>
                            <Clock className="h-4 w-4 text-orange-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{orderStats.pending}</div>
                            <p className="text-muted-foreground text-xs">Menunggu pembayaran</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Diproses</CardTitle>
                            <Package className="h-4 w-4 text-blue-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{orderStats.processing}</div>
                            <p className="text-muted-foreground text-xs">Sedang diproses</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Dikirim</CardTitle>
                            <ShoppingBag className="h-4 w-4 text-purple-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{orderStats.shipped}</div>
                            <p className="text-muted-foreground text-xs">Dalam pengiriman</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Selesai</CardTitle>
                            <Check className="h-4 w-4 text-green-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{orderStats.completed}</div>
                            <p className="text-muted-foreground text-xs">Pesanan selesai</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Recent Orders */}
                <Card>
                    <CardHeader>
                        <CardTitle>Pesanan Terbaru</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {recentOrders.length > 0 ? (
                            <div className="space-y-4">
                                {recentOrders.map((order) => (
                                    <div key={order.id} className="flex items-center justify-between rounded-lg border p-4">
                                        <div className="space-y-1">
                                            <div className="font-medium">{order.order_number}</div>
                                            <div className="text-muted-foreground text-sm">{formatDate(order.created_at)}</div>
                                        </div>
                                        <div className="flex items-center space-x-4">
                                            <div>{formatRupiah(order.total_amount)}</div>
                                            <div
                                                className={`flex items-center space-x-1 rounded-full px-2 py-1 text-xs ${getStatusColor(order.status)}`}
                                            >
                                                {getStatusIcon(order.status)}
                                                <span>{getStatusLabel(order.status)}</span>
                                            </div>
                                            <Button asChild variant="outline" size="sm">
                                                <Link href={`/orders/detail/${order.order_number}`}>Detail</Link>
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex h-[200px] items-center justify-center rounded-lg border border-dashed">
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

                {/* Account Summary */}
                <div className="grid gap-4 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Ringkasan Akun</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium">Total Pembelian</span>
                                    <span>{formatRupiah(totalSpent)}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium">Email</span>
                                    <span className="text-sm">{auth.user.email}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium">Tanggal Bergabung</span>
                                    <span className="text-sm">{formatDate(auth.user.created_at)}</span>
                                </div>
                                <Button asChild variant="outline" className="w-full">
                                    <Link href="/settings/profile">Edit Profil</Link>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>Alamat Pengiriman</CardTitle>
                            <Button asChild variant="ghost" size="sm">
                                <Link href="/addresses">Kelola</Link>
                            </Button>
                        </CardHeader>
                        <CardContent>
                            {shippingAddresses.length > 0 ? (
                                <div className="space-y-4">
                                    {shippingAddresses.slice(0, 2).map((address) => (
                                        <div key={address.id} className="rounded-lg border p-3">
                                            <div className="font-medium">{address.name}</div>
                                            <div className="text-muted-foreground mt-1 text-sm">
                                                {address.address}, {address.city}, {address.province}
                                            </div>
                                        </div>
                                    ))}
                                    {shippingAddresses.length > 2 && (
                                        <Button asChild variant="link" className="h-auto p-0">
                                            <Link href="/addresses">Lihat semua alamat</Link>
                                        </Button>
                                    )}
                                </div>
                            ) : (
                                <div className="flex h-[150px] items-center justify-center rounded-lg border border-dashed">
                                    <div className="text-center">
                                        <p className="text-muted-foreground text-sm">Belum ada alamat tersimpan</p>
                                        <Button asChild className="mt-2" variant="outline" size="sm">
                                            <Link href="/addresses">Tambah Alamat</Link>
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
