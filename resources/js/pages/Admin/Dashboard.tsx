import { Head } from '@inertiajs/react';
import { Clock, DollarSign, Package, Pencil, ShoppingCart, Users } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AdminLayout from '@/layouts/admin-layout';
import { type BreadcrumbItem } from '@/types';
import { formatRupiah } from '@/utils/formatters';
import { Link } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

interface DashboardProps {
    stats: {
        products: number;
        orders: number;
        blogs: number;
        users: number;
        total_revenue: number;
        pending_revenue: number;
    };
}

export default function Dashboard({ stats }: DashboardProps) {
    return (
        <AdminLayout breadcrumbs={breadcrumbs}>
            <Head title="Admin Dashboard" />

            <div className="space-y-8 p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold tracking-tight">Admin Dashboard</h1>
                </div>

                {/* Revenue Stats */}
                <div className="grid gap-4 md:grid-cols-3">
                    <Card className="md:col-span-1">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Total Penghasilan</CardTitle>
                            <DollarSign className="text-muted-foreground h-4 w-4" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{formatRupiah(stats.total_revenue)}</div>
                            <p className="text-muted-foreground text-xs">Dari pesanan selesai</p>
                            <Button asChild className="mt-4 w-full" size="sm" variant="outline">
                                <Link href="/admin/reports">Lihat Laporan</Link>
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="md:col-span-1">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Penghasilan Tertunda</CardTitle>
                            <Clock className="text-muted-foreground h-4 w-4" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{formatRupiah(stats.pending_revenue)}</div>
                            <p className="text-muted-foreground text-xs">Dari pesanan dalam proses</p>
                            <Button asChild className="mt-4 w-full" size="sm" variant="outline">
                                <Link href="/admin/orders">Lihat Pesanan</Link>
                            </Button>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Pesanan</CardTitle>
                            <ShoppingCart className="text-muted-foreground h-4 w-4" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.orders}</div>
                            <p className="text-muted-foreground text-xs">Total pesanan</p>
                            <Button asChild className="mt-4 w-full" size="sm" variant="outline">
                                <Link href="/admin/orders">Kelola Pesanan</Link>
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                {/* Content Stats */}
                <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Produk</CardTitle>
                            <Package className="text-muted-foreground h-4 w-4" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.products}</div>
                            <p className="text-muted-foreground text-xs">Total produk</p>
                            <Button asChild className="mt-4 w-full" size="sm" variant="outline">
                                <Link href="/admin/products">Kelola Produk</Link>
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="md:col-span-1">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Total Pengguna</CardTitle>
                            <Users className="text-muted-foreground h-4 w-4" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.users}</div>
                            <p className="text-muted-foreground text-xs">Pengguna terdaftar</p>
                            <Button asChild className="mt-4 w-full" size="sm" variant="outline">
                                <Link href="/admin/users">Kelola Pengguna</Link>
                            </Button>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Blog</CardTitle>
                            <Pencil className="text-muted-foreground h-4 w-4" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.blogs}</div>
                            <p className="text-muted-foreground text-xs">Total artikel blog</p>
                            <Button asChild className="mt-4 w-full" size="sm" variant="outline">
                                <Link href="/admin/blogs">Kelola Blog</Link>
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AdminLayout>
    );
}
