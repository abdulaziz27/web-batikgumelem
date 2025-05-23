import React, { useState } from 'react';
import axios from 'axios';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectItem } from '@/components/ui/select';
import { Loader2, Download } from 'lucide-react';

interface SalesReportProps {
    // Props definition
}

export default function SalesReport() {
    const [dateRange, setDateRange] = useState({
        start_date: '',
        end_date: ''
    });
    const [reportType, setReportType] = useState('daily');
    const [isLoading, setIsLoading] = useState(false);

    const handleDownload = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get('/admin/reports/sales', {
                params: {
                    ...dateRange,
                    type: reportType,
                    format: 'pdf'
                },
                responseType: 'blob'
            });

            // Create download link
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'sales-report.pdf');
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error('Error downloading report:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <Card>
                <CardHeader>
                    <CardTitle>Laporan Penjualan</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label>Tanggal Mulai</Label>
                                <Input
                                    type="date"
                                    value={dateRange.start_date}
                                    onChange={(e) => setDateRange(prev => ({
                                        ...prev,
                                        start_date: e.target.value
                                    }))}
                                />
                            </div>
                            <div>
                                <Label>Tanggal Akhir</Label>
                                <Input
                                    type="date"
                                    value={dateRange.end_date}
                                    onChange={(e) => setDateRange(prev => ({
                                        ...prev,
                                        end_date: e.target.value
                                    }))}
                                />
                            </div>
                        </div>
                        <div>
                            <Label>Tipe Laporan</Label>
                            <Select
                                value={reportType}
                                onValueChange={setReportType}
                            >
                                <SelectItem value="daily">Harian</SelectItem>
                                <SelectItem value="weekly">Mingguan</SelectItem>
                                <SelectItem value="monthly">Bulanan</SelectItem>
                            </Select>
                        </div>
                        <Button
                            onClick={handleDownload}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Memproses...
                                </>
                            ) : (
                                <>
                                    <Download className="mr-2 h-4 w-4" />
                                    Download PDF
                                </>
                            )}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
