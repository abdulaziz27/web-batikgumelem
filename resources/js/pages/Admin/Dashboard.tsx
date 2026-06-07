import { Head } from '@inertiajs/react';
import { AlertTriangle, Clock, DollarSign, Package, Pencil, ShoppingCart, Sparkles, Timer, Users } from 'lucide-react';
import { useTranslation } from 'react-i18next';

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
    ai_stats?: {
        month: { requests: number; tokens: number; error_rate: number; avg_latency_ms: number | null };
        daily: { day: string; requests: number; tokens: number; error_rate: number; avg_latency_ms: number | null }[];
        top_questions: { question: string; count: number }[];
    };
}

function pct(n: number) {
    return `${Math.round(n * 1000) / 10}%`;
}

export default function Dashboard({ stats, ai_stats }: DashboardProps) {
    const { t } = useTranslation();
    return (
        <AdminLayout breadcrumbs={breadcrumbs}>
            <Head title={t('dashboard.pages.adminDashboard.headTitle')} />

            <div className="space-y-8 p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold tracking-tight">{t('dashboard.pages.adminDashboard.title')}</h1>
                </div>

                {/* Revenue Stats */}
                <div className="grid gap-4 md:grid-cols-3">
                    <Card className="md:col-span-1">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">{t('dashboard.pages.adminDashboard.revenueTotal')}</CardTitle>
                            <DollarSign className="text-muted-foreground h-4 w-4" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{formatRupiah(stats.total_revenue)}</div>
                            <p className="text-muted-foreground text-xs">{t('dashboard.pages.adminDashboard.revenueTotalHint')}</p>
                            <Button asChild className="mt-4 w-full" size="sm" variant="outline">
                                <Link href="/admin/reports">{t('dashboard.pages.adminDashboard.viewReports')}</Link>
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="md:col-span-1">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">{t('dashboard.pages.adminDashboard.revenuePending')}</CardTitle>
                            <Clock className="text-muted-foreground h-4 w-4" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{formatRupiah(stats.pending_revenue)}</div>
                            <p className="text-muted-foreground text-xs">{t('dashboard.pages.adminDashboard.revenuePendingHint')}</p>
                            <Button asChild className="mt-4 w-full" size="sm" variant="outline">
                                <Link href="/admin/orders">{t('dashboard.pages.adminDashboard.viewOrders')}</Link>
                            </Button>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">{t('dashboard.pages.adminDashboard.orders')}</CardTitle>
                            <ShoppingCart className="text-muted-foreground h-4 w-4" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.orders}</div>
                            <p className="text-muted-foreground text-xs">{t('dashboard.pages.adminDashboard.ordersHint')}</p>
                            <Button asChild className="mt-4 w-full" size="sm" variant="outline">
                                <Link href="/admin/orders">{t('dashboard.pages.adminDashboard.manageOrders')}</Link>
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                {/* Content Stats */}
                <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">{t('dashboard.pages.adminDashboard.products')}</CardTitle>
                            <Package className="text-muted-foreground h-4 w-4" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.products}</div>
                            <p className="text-muted-foreground text-xs">{t('dashboard.pages.adminDashboard.productsHint')}</p>
                            <Button asChild className="mt-4 w-full" size="sm" variant="outline">
                                <Link href="/admin/products">{t('dashboard.pages.adminDashboard.manageProducts')}</Link>
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="md:col-span-1">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">{t('dashboard.pages.adminDashboard.usersTotal')}</CardTitle>
                            <Users className="text-muted-foreground h-4 w-4" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.users}</div>
                            <p className="text-muted-foreground text-xs">{t('dashboard.pages.adminDashboard.usersHint')}</p>
                            <Button asChild className="mt-4 w-full" size="sm" variant="outline">
                                <Link href="/admin/users">{t('dashboard.pages.adminDashboard.manageUsers')}</Link>
                            </Button>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">{t('dashboard.pages.adminDashboard.blogs')}</CardTitle>
                            <Pencil className="text-muted-foreground h-4 w-4" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.blogs}</div>
                            <p className="text-muted-foreground text-xs">{t('dashboard.pages.adminDashboard.blogsHint')}</p>
                            <Button asChild className="mt-4 w-full" size="sm" variant="outline">
                                <Link href="/admin/blogs">{t('dashboard.pages.adminDashboard.manageBlogs')}</Link>
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                {/* AI Chat Usage */}
                {ai_stats && (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold">AI Chat Usage</h2>
                        </div>

                        <div className="grid gap-4 md:grid-cols-4">
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between pb-2">
                                    <CardTitle className="text-sm font-medium">Requests (MTD)</CardTitle>
                                    <Sparkles className="text-muted-foreground h-4 w-4" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{ai_stats.month.requests}</div>
                                    <p className="text-muted-foreground text-xs">Bulan berjalan</p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between pb-2">
                                    <CardTitle className="text-sm font-medium">Tokens (MTD)</CardTitle>
                                    <Sparkles className="text-muted-foreground h-4 w-4" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{ai_stats.month.tokens.toLocaleString()}</div>
                                    <p className="text-muted-foreground text-xs">Total token (jika tersedia)</p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between pb-2">
                                    <CardTitle className="text-sm font-medium">Error rate (MTD)</CardTitle>
                                    <AlertTriangle className="text-muted-foreground h-4 w-4" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{pct(ai_stats.month.error_rate)}</div>
                                    <p className="text-muted-foreground text-xs">Gagal / total request</p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between pb-2">
                                    <CardTitle className="text-sm font-medium">Avg latency (MTD)</CardTitle>
                                    <Timer className="text-muted-foreground h-4 w-4" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">
                                        {ai_stats.month.avg_latency_ms == null ? '-' : `${Math.round(ai_stats.month.avg_latency_ms)} ms`}
                                    </div>
                                    <p className="text-muted-foreground text-xs">Rata-rata waktu respon</p>
                                </CardContent>
                            </Card>
                        </div>

                        <div className="grid gap-4 lg:grid-cols-2">
                            <Card>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm font-medium">Top questions (last 30 days)</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {ai_stats.top_questions.length ? (
                                        <div className="space-y-2">
                                            {ai_stats.top_questions.map((q, idx) => (
                                                <div key={idx} className="flex items-start justify-between gap-4">
                                                    <div className="text-sm text-gray-700 line-clamp-2">{q.question}</div>
                                                    <div className="text-xs text-gray-500">{q.count}x</div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-muted-foreground text-sm">Belum ada data.</div>
                                    )}
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm font-medium">Daily (last 30 days)</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {ai_stats.daily.length ? (
                                        <div className="max-h-64 space-y-2 overflow-auto pr-2">
                                            {ai_stats.daily.map((d, idx) => (
                                                <div key={idx} className="flex items-center justify-between text-sm">
                                                    <div className="text-gray-700">{d.day}</div>
                                                    <div className="flex items-center gap-3 text-xs text-gray-600">
                                                        <span>{d.requests} req</span>
                                                        <span>{d.tokens.toLocaleString()} tok</span>
                                                        <span>{pct(d.error_rate)} err</span>
                                                        <span>{d.avg_latency_ms == null ? '-' : `${Math.round(d.avg_latency_ms)} ms`}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-muted-foreground text-sm">Belum ada data.</div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
