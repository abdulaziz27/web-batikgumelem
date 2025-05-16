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
        title: 'Dashboard',
        href: '/admin/dashboard',
    },
    {
        title: 'Orders',
        href: '/admin/orders',
    },
    {
        title: 'Order Details',
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
            <Head title={`Order #${order.order_number || order.id} Details`} />

            <div className="space-y-6 p-3 sm:p-6">
                <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center sm:gap-4">
                    <div className="flex items-center gap-3">
                        <Button variant="outline" size="icon" asChild>
                            <a href="/admin/orders">
                                <ArrowLeft className="h-4 w-4" />
                            </a>
                        </Button>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">Order {order.order_number || `#${order.id}`}</h1>
                            <p className="text-muted-foreground text-sm">Placed on {formatDate(order.created_at)}</p>
                        </div>
                    </div>
                    <div className="mt-3 flex items-center gap-3 sm:mt-0">
                        <Badge variant={getStatusBadgeVariant(order.status)}>{order.status.charAt(0).toUpperCase() + order.status.slice(1)}</Badge>
                        <Badge variant={order.payment_status === 'paid' ? 'default' : 'secondary'}>
                            Payment: {order.payment_status.charAt(0).toUpperCase() + order.payment_status.slice(1)}
                        </Badge>
                    </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    {/* Customer Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Customer Information</CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-4">
                            <div>
                                <div className="font-semibold">Customer</div>
                                <div>
                                    {order.user ? (
                                        <>
                                            <div>{order.user.name}</div>
                                            <div className="text-muted-foreground text-sm">{order.user.email}</div>
                                        </>
                                    ) : (
                                        <>
                                            <div>{order.guest_name || 'Guest'}</div>
                                            <div className="text-muted-foreground text-sm">{order.guest_email}</div>
                                        </>
                                    )}
                                </div>
                            </div>

                            <div>
                                <div className="font-semibold">Shipping Address</div>
                                {order.shipping_address ? (
                                    <div>
                                        <div>{order.shipping_address.full_name}</div>
                                        <div>{order.shipping_address.address_line1}</div>
                                        {order.shipping_address.address_line2 && <div>{order.shipping_address.address_line2}</div>}
                                        <div>
                                            {order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.postal_code}
                                        </div>
                                        <div>{order.shipping_address.country}</div>
                                        <div>{order.shipping_address.phone}</div>
                                    </div>
                                ) : (
                                    <div className="text-muted-foreground text-sm">No shipping address provided</div>
                                )}
                            </div>

                            <div>
                                <div className="font-semibold">Payment Information</div>
                                <div>
                                    <div>Method: {order.payment_method}</div>
                                    <div>Status: {order.payment_status.charAt(0).toUpperCase() + order.payment_status.slice(1)}</div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Order Management */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Order Management</CardTitle>
                            <CardDescription>Update order status and shipping information</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-2">
                                <label htmlFor="status">Order Status</label>
                                <Select value={orderStatus} onValueChange={setOrderStatus} disabled={isSubmitting}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="pending">Pending</SelectItem>
                                        <SelectItem value="processing">Processing</SelectItem>
                                        <SelectItem value="shipped">Shipped</SelectItem>
                                        <SelectItem value="delivered">Delivered</SelectItem>
                                        <SelectItem value="cancelled">Cancelled</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="grid gap-2">
                                <label htmlFor="tracking-number">Tracking Number</label>
                                <Input
                                    id="tracking-number"
                                    placeholder="Enter tracking number"
                                    value={trackingNumber}
                                    onChange={(e) => setTrackingNumber(e.target.value)}
                                    disabled={isSubmitting}
                                />
                            </div>

                            <div className="grid gap-2">
                                <label htmlFor="tracking-url">Tracking URL</label>
                                <Input
                                    id="tracking-url"
                                    placeholder="Enter tracking URL"
                                    value={trackingUrl}
                                    onChange={(e) => setTrackingUrl(e.target.value)}
                                    disabled={isSubmitting}
                                />
                            </div>

                            <div className="grid gap-2">
                                <label htmlFor="notes">Admin Notes</label>
                                <Textarea
                                    id="notes"
                                    placeholder="Add notes about this order"
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    disabled={isSubmitting}
                                    rows={4}
                                />
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button onClick={handleUpdateOrder} disabled={isSubmitting} className="w-full">
                                {isSubmitting ? 'Updating...' : 'Update Order'}
                            </Button>
                        </CardFooter>
                    </Card>
                </div>

                {/* Order Items */}
                <Card>
                    <CardHeader>
                        <CardTitle>Order Items</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[400px]">Product</TableHead>
                                    <TableHead className="text-right">Price</TableHead>
                                    <TableHead className="text-right">Quantity</TableHead>
                                    <TableHead className="text-right">Subtotal</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {order.items.map((item) => (
                                    <TableRow key={item.id}>
                                        <TableCell className="font-medium">{item.product.name}</TableCell>
                                        <TableCell className="text-right">{formatPrice(item.price)}</TableCell>
                                        <TableCell className="text-right">{item.quantity}</TableCell>
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
                                    <TableCell colSpan={3}>Shipping</TableCell>
                                    <TableCell className="text-right">{formatPrice(order.shipping_cost || 0)}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell colSpan={3}>Total</TableCell>
                                    <TableCell className="text-right font-bold">{formatPrice(orderTotal)}</TableCell>
                                </TableRow>
                            </TableFooter>
                        </Table>
                    </CardContent>
                </Card>

                {/* Order Timeline */}
                <Card>
                    <CardHeader>
                        <CardTitle>Order Timeline</CardTitle>
                        <CardDescription>Order status history</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="relative">
                            <div className="bg-border absolute top-0 left-5 h-full w-px"></div>
                            <ol className="relative space-y-6">
                                {timeline.map((event, index) => (
                                    <li key={index} className="relative flex gap-6">
                                        <div className="bg-background z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border">
                                            {displayIcon(event.icon)}
                                        </div>
                                        <div className="flex min-h-[40px] flex-col items-start justify-center">
                                            <div className="flex items-center gap-2">
                                                <span className="font-semibold">{event.status}</span>
                                                <span className="text-muted-foreground text-sm">{formatDate(event.date)}</span>
                                            </div>
                                            <p className="text-muted-foreground text-sm">{event.description}</p>
                                        </div>
                                    </li>
                                ))}
                            </ol>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
}
