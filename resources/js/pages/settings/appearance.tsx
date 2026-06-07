import { Head } from '@inertiajs/react';

import AppearanceTabs from '@/components/appearance-tabs';
import HeadingSmall from '@/components/heading-small';
import SettingsLayoutWrapper from '@/layouts/settings/settings-layout-wrapper';
import { type BreadcrumbItem } from '@/types';
import { useTranslation } from 'react-i18next';

export default function Appearance() {
    const { t } = useTranslation();
    const breadcrumbs: BreadcrumbItem[] = [{ title: t('settings.appearance.breadcrumbs'), href: '/settings/appearance' }];
    return (
        <SettingsLayoutWrapper breadcrumbs={breadcrumbs}>
            <Head title={t('settings.appearance.headTitle')} />

            <div className="space-y-6">
                <HeadingSmall title={t('settings.appearance.headingTitle')} description={t('settings.appearance.headingDesc')} />
                <AppearanceTabs />
            </div>
        </SettingsLayoutWrapper>
    );
}
