import { Head, router } from '@inertiajs/react';
import { format, parseISO } from 'date-fns';
import { ArrowLeft, CheckCircle, CircleCheck, Package, Receipt, ShoppingCart, Truck, XCircle } from 'lucide-react';
import React, { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import AdminLayout from '@/layouts/admin-layout';
import { type BreadcrumbItem } from '@/types';

interface ShippingAddress {
    id: number;
    full_name: string;
    address_line1: string;
    address_line2?: string;
    city: string;
    postal_code: string;
    state: string;
    country: string;
    phone: string;
}

interface User {
    id: number;
    name: string;
    email: string;
}

interface Product {
    id: number;
    name: string;
    slug: string;
    price: number;
}

interface OrderItem {
    id: number;
    order_id: number;
    product_id: number;
    product: Product;
    quantity: number;
    price: number;
}

interface Order {
    id: number;
    order_number: string;
    status: string;
    user_id?: number;
    guest_name?: string;
    guest_email?: string;
    total_amount: number;
    total_price: number;
    shipping_cost: number;
    payment_method: string;
    payment_status: string;
    tracking_number?: string;
    tracking_url?: string;
    admin_notes?: string;
    created_at: string;
    updated_at: string;
    user?: User;
    shipping_address_id: number;
    shipping_address?: ShippingAddress;
    items: OrderItem[];
}

interface TimelineEvent {
    date: string;
    status: string;
    description: string;
    icon: string;
}

interface OrderShowProps {
    order: Order;
    timeline: TimelineEvent[];
}

type IconMapping = {
    [key: string]: React.ReactNode;
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dasbor',
        href: '/admin/dashboard',
    },
    {
        title: 'Pesanan',
        href: '/admin/orders',
    },
    {
        title: 'Detail Pesanan',
        href: '#',
    },
];

export default function OrderShow({ order, timeline }: OrderShowProps) {
    const [orderStatus, setOrderStatus] = useState(order.status);
    const [trackingNumber, setTrackingNumber] = useState(order.tracking_number || '');
    const [trackingUrl, setTrackingUrl] = useState(order.tracking_url || '');
    const [notes, setNotes] = useState(order.admin_notes || '');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(price);
    };

    const formatDate = (dateString: string) => {
        return format(parseISO(dateString), 'dd MMM yyyy, HH:mm');
    };

    const getStatusBadgeVariant = (status: string) => {
        switch (status) {
            case 'pending':
                return 'default';
            case 'processing':
                return 'secondary';
            case 'shipped':
                return 'default';
            case 'delivered':
                return 'default';
            case 'cancelled':
                return 'destructive';
            default:
                return 'secondary';
        }
    };

    const handleUpdateOrder = () => {
        setIsSubmitting(true);
        router.post(
            `/admin/orders/${order.id}`,
            {
                _method: 'PUT',
                status: orderStatus,
                tracking_number: trackingNumber,
                tracking_url: trackingUrl,
                notes: notes,
            },
            {
                onSuccess: () => {
                    setIsSubmitting(false);
                },
                onError: () => {
                    setIsSubmitting(false);
                },
            },
        );
    };

    const iconMap: IconMapping = {
        ShoppingCart: <ShoppingCart className="h-6 w-6" />,
        Package: <Package className="h-6 w-6" />,
        Truck: <Truck className="h-6 w-6" />,
        CheckCircle: <CheckCircle className="h-6 w-6" />,
        XCircle: <XCircle className="h-6 w-6" />,
        Receipt: <Receipt className="h-6 w-6" />,
        CircleCheck: <CircleCheck className="h-6 w-6" />,
    };

    const displayIcon = (iconName: string) => {
        return iconMap[iconName] || <CircleCheck className="h-6 w-6" />;
    };

    const orderTotal = order.total_amount || order.total_price || 0;
    const subtotal = orderTotal - (order.shipping_cost || 0);

    return (
        <AdminLayout breadcrumbs={breadcrumbs}>
            <Head title={`Pesanan #${order.order_number || order.id}`} />

            <div className="space-y-6 p-3 sm:p-6">
                <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center sm:gap-4">
                    <div className="flex items-center gap-3">
                        <Button variant="outline" size="icon" asChild>
                            <a href="/admin/orders">
                                <ArrowLeft className="h-4 w-4" />
                            </a>
                        </Button>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">Pesanan {order.order_number || `#${order.id}`}</h1>
                            <p className="text-muted-foreground text-sm">Dibuat pada {formatDate(order.created_at)}</p>
                        </div>
                    </div>
                    <div className="mt-3 flex items-center gap-3 sm:mt-0">
                        <Badge variant={getStatusBadgeVariant(order.status)}>
                            {order.status === 'pending'
                                ? 'Menunggu'
                                : order.status === 'processing'
                                  ? 'Diproses'
                                  : order.status === 'shipped'
                                    ? 'Dikirim'
                                    : order.status === 'delivered'
                                      ? 'Diterima'
                                      : order.status === 'cancelled'
                                        ? 'Dibatalkan'
                                        : order.status}
                        </Badge>
                        <Badge variant={order.payment_status === 'paid' ? 'default' : 'secondary'}>
                            Pembayaran: {order.payment_status === 'paid' ? 'Dibayar' : order.payment_status === 'pending' ? 'Menunggu' : 'Gagal'}
                        </Badge>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    <div className="space-y-6 lg:col-span-2">
                        {/* Order Items */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Detail Produk</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Produk</TableHead>
                                            <TableHead className="text-right">Harga</TableHead>
                                            <TableHead className="text-center">Jumlah</TableHead>
                                            <TableHead className="text-right">Total</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {order.items.map((item) => (
                                            <TableRow key={item.id}>
                                                <TableCell>{item.product.name}</TableCell>
                                                <TableCell className="text-right">{formatPrice(item.price)}</TableCell>
                                                <TableCell className="text-center">{item.quantity}</TableCell>
                                                <TableCell className="text-right">{formatPrice(item.price * item.quantity)}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                    <TableFooter>
                                        <TableRow>
                                            <TableCell colSpan={3}>Subtotal</TableCell>
                                            <TableCell className="text-right">{formatPrice(subtotal)}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell colSpan={3}>Biaya Pengiriman</TableCell>
                                            <TableCell className="text-right">{formatPrice(order.shipping_cost)}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell colSpan={3} className="font-bold">
                                                Total
                                            </TableCell>
                                            <TableCell className="text-right font-bold">{formatPrice(orderTotal)}</TableCell>
                                        </TableRow>
                                    </TableFooter>
                                </Table>
                            </CardContent>
                        </Card>

                        {/* Customer Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Informasi Pelanggan</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid gap-6 sm:grid-cols-2">
                                    <div>
                                        <h3 className="text-muted-foreground mb-2 text-sm font-medium">Detail Pelanggan</h3>
                                        <p className="font-medium">{order.user ? order.user.name : order.guest_name || 'Tamu'}</p>
                                        <p className="text-muted-foreground text-sm">{order.user ? order.user.email : order.guest_email}</p>
                                    </div>
                                    <div>
                                        <h3 className="text-muted-foreground mb-2 text-sm font-medium">Metode Pembayaran</h3>
                                        <p className="font-medium">{order.payment_method}</p>
                                        <p className="text-muted-foreground text-sm">
                                            Status:{' '}
                                            {order.payment_status === 'paid' ? 'Dibayar' : order.payment_status === 'pending' ? 'Menunggu' : 'Gagal'}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Shipping Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Informasi Pengiriman</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid gap-6 sm:grid-cols-2">
                                    <div>
                                        <h3 className="text-muted-foreground mb-2 text-sm font-medium">Alamat Pengiriman</h3>
                                        {order.shipping_address ? (
                                            <>
                                                <p className="font-medium">{order.shipping_address.full_name}</p>
                                                <p className="text-muted-foreground text-sm">
                                                    {order.shipping_address.address_line1}
                                                    {order.shipping_address.address_line2 && (
                                                        <>
                                                            <br />
                                                            {order.shipping_address.address_line2}
                                                        </>
                                                    )}
                                                    <br />
                                                    {order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.postal_code}
                                                    <br />
                                                    {order.shipping_address.country}
                                                    <br />
                                                    Telepon: {order.shipping_address.phone}
                                                </p>
                                            </>
                                        ) : (
                                            <p className="text-muted-foreground">Tidak ada alamat pengiriman</p>
                                        )}
                                    </div>
                                    <div>
                                        <h3 className="text-muted-foreground mb-2 text-sm font-medium">Status Pengiriman</h3>
                                        <p className="font-medium">
                                            {order.status === 'pending'
                                                ? 'Menunggu'
                                                : order.status === 'processing'
                                                  ? 'Diproses'
                                                  : order.status === 'shipped'
                                                    ? 'Dikirim'
                                                    : order.status === 'delivered'
                                                      ? 'Diterima'
                                                      : order.status === 'cancelled'
                                                        ? 'Dibatalkan'
                                                        : order.status}
                                        </p>
                                        {order.tracking_number && (
                                            <p className="text-muted-foreground text-sm">
                                                No. Resi: {order.tracking_number}
                                                {order.tracking_url && (
                                                    <>
                                                        <br />
                                                        <a
                                                            href={order.tracking_url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-primary hover:underline"
                                                        >
                                                            Lacak Pengiriman
                                                        </a>
                                                    </>
                                                )}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Order Management */}
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Kelola Pesanan</CardTitle>
                                <CardDescription>Perbarui status dan informasi pengiriman</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <label htmlFor="status" className="text-sm font-medium">
                                        Status Pesanan
                                    </label>
                                    <Select value={orderStatus} onValueChange={setOrderStatus}>
                                        <SelectTrigger id="status">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="pending">Menunggu</SelectItem>
                                            <SelectItem value="processing">Diproses</SelectItem>
                                            <SelectItem value="shipped">Dikirim</SelectItem>
                                            <SelectItem value="delivered">Diterima</SelectItem>
                                            <SelectItem value="cancelled">Dibatalkan</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="tracking_number" className="text-sm font-medium">
                                        Nomor Resi
                                    </label>
                                    <Input
                                        id="tracking_number"
                                        value={trackingNumber}
                                        onChange={(e) => setTrackingNumber(e.target.value)}
                                        placeholder="Masukkan nomor resi"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="tracking_url" className="text-sm font-medium">
                                        Link Pelacakan
                                    </label>
                                    <Input
                                        id="tracking_url"
                                        value={trackingUrl}
                                        onChange={(e) => setTrackingUrl(e.target.value)}
                                        placeholder="Masukkan link pelacakan"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="notes" className="text-sm font-medium">
                                        Catatan Admin
                                    </label>
                                    <Textarea
                                        id="notes"
                                        value={notes}
                                        onChange={(e) => setNotes(e.target.value)}
                                        placeholder="Tambahkan catatan internal"
                                        rows={4}
                                    />
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button onClick={handleUpdateOrder} disabled={isSubmitting} className="w-full">
                                    {isSubmitting ? 'Menyimpan...' : 'Simpan Perubahan'}
                                </Button>
                            </CardFooter>
                        </Card>

                        {/* Order Timeline */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Riwayat Pesanan</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {timeline.map((event, index) => (
                                        <div key={index} className="flex gap-4">
                                            <div className="text-muted-foreground flex h-6 w-6 items-center justify-center">
                                                {displayIcon(event.icon)}
                                            </div>
                                            <div>
                                                <p className="font-medium">
                                                    {event.status === 'pending'
                                                        ? 'Menunggu'
                                                        : event.status === 'processing'
                                                          ? 'Diproses'
                                                          : event.status === 'shipped'
                                                            ? 'Dikirim'
                                                            : event.status === 'delivered'
                                                              ? 'Diterima'
                                                              : event.status === 'cancelled'
                                                                ? 'Dibatalkan'
                                                                : event.status}
                                                </p>
                                                <p className="text-muted-foreground text-sm">{event.description}</p>
                                                <p className="text-muted-foreground text-sm">{formatDate(event.date)}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
