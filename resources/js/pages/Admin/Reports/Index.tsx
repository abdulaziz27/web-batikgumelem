import { Head } from '@inertiajs/react';
import axios from 'axios';
import { Download } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AdminLayout from '@/layouts/admin-layout';
import { type BreadcrumbItem } from '@/types';
import { useTranslation } from 'react-i18next';

export default function ReportsIndex() {
    const { t } = useTranslation();
    const breadcrumbs: BreadcrumbItem[] = [
        { title: t('dashboard.nav.adminDashboard'), href: '/admin/dashboard' },
        { title: t('dashboard.nav.adminReports'), href: '/admin/reports' },
    ];

    const [dateRange, setDateRange] = useState({
        start_date: '',
        end_date: '',
    });
    const [reportType, setReportType] = useState('daily');
    const [isLoading, setIsLoading] = useState(false);

    const handleDownload = async () => {
        if (!dateRange.start_date || !dateRange.end_date) {
            return;
        }

        setIsLoading(true);

        try {
            const response = await axios.get('/admin/reports/sales', {
                params: {
                    start_date: dateRange.start_date,
                    end_date: dateRange.end_date,
                    type: reportType,
                    format: 'pdf',
                },
                responseType: 'blob',
            });

            // Create download link
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'sales-report.pdf');
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error downloading report:', error);
            // You might want to show an error message to the user here
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AdminLayout breadcrumbs={breadcrumbs}>
            <Head title={t('dashboard.pages.adminReports.headTitle')} />

            <div className="space-y-6 p-6">
                <div className="flex flex-col space-y-2 md:flex-row md:items-center md:justify-between md:space-y-0">
                    <h1 className="text-2xl font-bold tracking-tight">{t('dashboard.pages.adminReports.title')}</h1>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>{t('dashboard.pages.adminReports.cardTitle')}</CardTitle>
                        <CardDescription>{t('dashboard.pages.adminReports.cardDesc')}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-6">
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="start_date">{t('dashboard.pages.adminReports.startDate')}</Label>
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
                                    <Label htmlFor="end_date">{t('dashboard.pages.adminReports.endDate')}</Label>
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
                                <Label htmlFor="report_type">{t('dashboard.pages.adminReports.reportType')}</Label>
                                <Select value={reportType} onValueChange={setReportType}>
                                    <SelectTrigger>
                                        <SelectValue placeholder={t('dashboard.pages.adminReports.reportType')} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="daily">{t('dashboard.pages.adminReports.typeDaily')}</SelectItem>
                                        <SelectItem value="weekly">{t('dashboard.pages.adminReports.typeWeekly')}</SelectItem>
                                        <SelectItem value="monthly">{t('dashboard.pages.adminReports.typeMonthly')}</SelectItem>
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
                                        {t('dashboard.pages.adminReports.processing')}
                                    </>
                                ) : (
                                    <>
                                        <Download className="mr-2 h-4 w-4" />
                                        {t('dashboard.pages.adminReports.download')}
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
