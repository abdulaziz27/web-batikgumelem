import AdminLayout from '@/layouts/admin-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from '@inertiajs/react';
import { Switch } from '@/components/ui/switch';

interface CouponFormData {
    [key: string]: string | number | boolean | undefined;
    code: string;
    discount_percent: string;
    valid_from: string;
    valid_until: string;
    active: boolean;
}

const CreateCoupon = () => {
    const { data, setData, post, processing, errors } = useForm<CouponFormData>({
        code: '',
        discount_percent: '',
        valid_from: '',
        valid_until: '',
        active: true,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/coupons');
    };

    return (
        <AdminLayout>
            <div className="container mx-auto py-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Tambah Kupon Baru</CardTitle>
                        <CardDescription>Buat kupon diskon baru untuk pelanggan</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="code">Kode Kupon</Label>
                                <Input
                                    id="code"
                                    value={data.code}
                                    onChange={e => setData('code', e.target.value)}
                                    placeholder="Contoh: SUMMER2024"
                                />
                                {errors.code && <p className="text-sm text-red-600">{errors.code}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="discount_percent">Persentase Diskon</Label>
                                <Input
                                    id="discount_percent"
                                    type="number"
                                    min="1"
                                    max="100"
                                    value={data.discount_percent}
                                    onChange={e => setData('discount_percent', e.target.value)}
                                    placeholder="10"
                                />
                                {errors.discount_percent && <p className="text-sm text-red-600">{errors.discount_percent}</p>}
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="valid_from">Berlaku Dari</Label>
                                    <Input
                                        id="valid_from"
                                        type="date"
                                        value={data.valid_from}
                                        onChange={e => setData('valid_from', e.target.value)}
                                    />
                                    {errors.valid_from && <p className="text-sm text-red-600">{errors.valid_from}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="valid_until">Berlaku Sampai</Label>
                                    <Input
                                        id="valid_until"
                                        type="date"
                                        value={data.valid_until}
                                        onChange={e => setData('valid_until', e.target.value)}
                                    />
                                    {errors.valid_until && <p className="text-sm text-red-600">{errors.valid_until}</p>}
                                </div>
                            </div>

                            <div className="flex items-center space-x-2">
                                <Switch
                                    id="active"
                                    checked={data.active}
                                    onCheckedChange={(checked: boolean) => setData('active', checked)}
                                />
                                <Label htmlFor="active">Aktif</Label>
                                {errors.active && <p className="text-sm text-red-600">{errors.active}</p>}
                            </div>

                            <div className="flex justify-end">
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Menyimpan...' : 'Simpan Kupon'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
};

export default CreateCoupon; 