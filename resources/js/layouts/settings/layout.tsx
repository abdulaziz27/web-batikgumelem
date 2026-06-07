import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { type NavItem } from '@/types';
import { router, usePage, Link } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';
import { useTranslation } from 'react-i18next';

export default function SettingsLayout({ children }: PropsWithChildren) {
    // When server-side rendering, we only render the layout on the client...
    if (typeof window === 'undefined') {
        return null;
    }

    const { t, i18n } = useTranslation();
    const { url } = usePage();
    const { locale } = usePage().props as any;
    const currentLocale = (locale === 'en' ? 'en' : 'id') as 'id' | 'en';

    const sidebarNavItems: NavItem[] = [
        { title: t('settings.nav.profile'), href: '/settings/profile', icon: null },
        { title: t('settings.nav.password'), href: '/settings/password', icon: null },
        { title: t('settings.nav.appearance'), href: '/settings/appearance', icon: null },
    ];

    const setLocale = (nextLocale: 'id' | 'en') => {
        router.post(
            route('locale.set'),
            { locale: nextLocale, redirect: url || '/' },
            {
                preserveScroll: true,
                onSuccess: () => i18n.changeLanguage(nextLocale),
            },
        );
    };

    const currentPath = window.location.pathname;

    return (
        <div className="px-4 py-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <Heading title={t('settings.title')} description={t('settings.description')} />

                <div className="w-full max-w-xs">
                    <Label className="text-sm font-medium">{t('settings.language.label')}</Label>
                    <div className="mt-2">
                        <Select value={currentLocale} onValueChange={(v) => setLocale(v as 'id' | 'en')}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="id">{t('settings.language.id')}</SelectItem>
                                <SelectItem value="en">{t('settings.language.en')}</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <p className="mt-2 text-xs text-neutral-500">{t('settings.language.helper')}</p>
                </div>
            </div>

            <div className="flex flex-col space-y-8 lg:flex-row lg:space-y-0 lg:space-x-12">
                <aside className="w-full max-w-xl lg:w-48">
                    <nav className="flex flex-col space-y-1 space-x-0">
                        {sidebarNavItems.map((item, index) => (
                            <Button
                                key={`${item.href}-${index}`}
                                size="sm"
                                variant="ghost"
                                asChild
                                className={cn('w-full justify-start', {
                                    'bg-muted': currentPath === item.href,
                                })}
                            >
                                <Link href={item.href} prefetch>
                                    {item.title}
                                </Link>
                            </Button>
                        ))}
                    </nav>
                </aside>

                <Separator className="my-6 md:hidden" />

                <div className="flex-1 md:max-w-2xl">
                    <section className="max-w-xl space-y-12">{children}</section>
                </div>
            </div>
        </div>
    );
}
