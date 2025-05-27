import { Head, router } from '@inertiajs/react';
import { Download } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AdminLayout from '@/layouts/admin-layout';
import { type BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dasbor',
        href: '/admin/dashboard',
    },
    {
        title: 'Laporan',
        href: '/admin/reports',
    },
];

export default function ReportsIndex() {
    const [dateRange, setDateRange] = useState({
        start_date: '',
        end_date: '',
    });
    const [reportType, setReportType] = useState('daily');
    const [isLoading, setIsLoading] = useState(false);

    const handleDownload = () => {
        if (!dateRange.start_date || !dateRange.end_date) {
            return;
        }

        setIsLoading(true);

        // Use Inertia's router.get with preserveState and preserveScroll
        router.get(
            '/admin/reports/sales',
            {
                start_date: dateRange.start_date,
                end_date: dateRange.end_date,
                type: reportType,
                format: 'pdf',
            },
            {
                preserveState: true,
                preserveScroll: true,
                onFinish: () => setIsLoading(false),
            },
        );
    };

    return (
        <AdminLayout breadcrumbs={breadcrumbs}>
            <Head title="Laporan Penjualan" />

            <div className="space-y-6 p-6">
                <div className="flex flex-col space-y-2 md:flex-row md:items-center md:justify-between md:space-y-0">
                    <h1 className="text-2xl font-bold tracking-tight">Laporan Penjualan</h1>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Unduh Laporan</CardTitle>
                        <CardDescription>Pilih rentang tanggal dan tipe laporan yang diinginkan</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-6">
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="start_date">Tanggal Mulai</Label>
                                    <Input
                                        id="start_date"
                                        type="date"
                                        value={dateRange.start_date}
                                        onChange={(e) =>
                                            setDateRange((prev) => ({
                                                ...prev,
                                                start_date: e.target.value,
                                            }))
                                        }
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="end_date">Tanggal Akhir</Label>
                                    <Input
                                        id="end_date"
                                        type="date"
                                        value={dateRange.end_date}
                                        onChange={(e) =>
                                            setDateRange((prev) => ({
                                                ...prev,
                                                end_date: e.target.value,
                                            }))
                                        }
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="report_type">Tipe Laporan</Label>
                                <Select value={reportType} onValueChange={setReportType}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih tipe laporan" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="daily">Harian</SelectItem>
                                        <SelectItem value="weekly">Mingguan</SelectItem>
                                        <SelectItem value="monthly">Bulanan</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <Button
                                onClick={handleDownload}
                                disabled={isLoading || !dateRange.start_date || !dateRange.end_date}
                                className="w-full md:w-auto"
                            >
                                {isLoading ? (
                                    <>
                                        <Download className="mr-2 h-4 w-4 animate-spin" />
                                        Memproses...
                                    </>
                                ) : (
                                    <>
                                        <Download className="mr-2 h-4 w-4" />
                                        Unduh Laporan
                                    </>
                                )}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
}
