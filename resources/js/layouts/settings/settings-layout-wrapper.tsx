import { type BreadcrumbItem } from '@/types';
import { usePage } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';
import AppLayout from '@/layouts/app-layout';
import AdminLayout from '@/layouts/admin-layout';
import SettingsLayout from '@/layouts/settings/layout';

interface SettingsLayoutWrapperProps extends PropsWithChildren {
    breadcrumbs: BreadcrumbItem[];
}

export default function SettingsLayoutWrapper({ children, breadcrumbs }: SettingsLayoutWrapperProps) {
    const { auth } = usePage().props as any;
    const isAdmin = auth.user?.roles?.includes('admin');

    const Layout = isAdmin ? AdminLayout : AppLayout;

    return (
        <Layout breadcrumbs={breadcrumbs}>
            <SettingsLayout>
                {children}
            </SettingsLayout>
        </Layout>
    );
}
