import { Head, useForm } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import AdminLayout from '@/layouts/admin-layout';
import { type BreadcrumbItem } from '@/types';
import { Link } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';

interface CreateProps {
    roles: string[];
}

export default function Create({ roles }: CreateProps) {
    const { t } = useTranslation();
    const breadcrumbs: BreadcrumbItem[] = [
        { title: t('dashboard.nav.adminDashboard'), href: '/admin/dashboard' },
        { title: t('dashboard.nav.adminUsers'), href: '/admin/users' },
        { title: t('dashboard.pages.adminUsers.add'), href: '/admin/users/create' },
    ];

    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        role: 'admin', // default admin
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/users');
    };

    return (
        <AdminLayout breadcrumbs={breadcrumbs}>
            <Head title={t('dashboard.pages.adminUserCreate.headTitle')} />

            <div className="space-y-6 p-3 sm:p-6">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/admin/users">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <h1 className="text-2xl font-bold tracking-tight">Tambah Pengguna</h1>
                </div>

                <Separator />

                <Card>
                    <CardHeader className="px-4 py-4 sm:px-6">
                        <h2 className="text-lg font-semibold">{t('dashboard.pages.adminUserCreate.sectionTitle')}</h2>
                    </CardHeader>

                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="name">{t('dashboard.pages.adminUserCreate.name')}</Label>
                                    <Input
                                        id="name"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        placeholder={t('dashboard.pages.adminUserCreate.namePlaceholder')}
                                    />
                                    {errors.name && <p className="text-destructive text-sm">{errors.name}</p>}
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="email">{t('dashboard.pages.adminUserCreate.email')}</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        placeholder={t('dashboard.pages.adminUserCreate.emailPlaceholder')}
                                    />
                                    {errors.email && <p className="text-destructive text-sm">{errors.email}</p>}
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="role">{t('dashboard.pages.adminUserCreate.role')}</Label>
                                    <Select value={data.role} onValueChange={(value) => setData('role', value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder={t('dashboard.pages.adminUserCreate.rolePlaceholder')} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem key="admin" value="admin">Admin</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.role && <p className="text-destructive text-sm">{errors.role}</p>}
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="password">{t('dashboard.pages.adminUserCreate.password')}</Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        placeholder={t('dashboard.pages.adminUserCreate.passwordPlaceholder')}
                                    />
                                    {errors.password && <p className="text-destructive text-sm">{errors.password}</p>}
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="password_confirmation">{t('dashboard.pages.adminUserCreate.passwordConfirm')}</Label>
                                    <Input
                                        id="password_confirmation"
                                        type="password"
                                        value={data.password_confirmation}
                                        onChange={(e) => setData('password_confirmation', e.target.value)}
                                        placeholder={t('dashboard.pages.adminUserCreate.passwordConfirmPlaceholder')}
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end">
                                <Button type="submit" disabled={processing}>
                                    {t('dashboard.pages.adminUserCreate.submit')}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
}
