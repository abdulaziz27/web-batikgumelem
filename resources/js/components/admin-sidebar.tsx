import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { BarChart3, BookOpen, LayoutGrid, Package, Pencil, ShoppingCart, Users, Ticket } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import AppLogo from './app-logo';

export function AdminSidebar() {
    const { t } = useTranslation();

    const adminNavItems: NavItem[] = [
        { title: t('dashboard.nav.adminDashboard'), href: '/admin/dashboard', icon: LayoutGrid },
        { title: t('dashboard.nav.adminOrders'), href: '/admin/orders', icon: ShoppingCart },
        { title: t('dashboard.nav.adminProducts'), href: '/admin/products', icon: Package },
        { title: t('dashboard.nav.adminUsers'), href: '/admin/users', icon: Users },
        { title: t('dashboard.nav.adminCoupons'), href: '/admin/coupons', icon: Ticket },
        { title: t('dashboard.nav.adminBlogs'), href: '/admin/blogs', icon: Pencil },
        { title: t('dashboard.nav.adminReports'), href: '/admin/reports', icon: BarChart3 },
    ];

    const footerNavItems: NavItem[] = [
        { title: t('dashboard.nav.viewStore'), href: '/', icon: ShoppingCart },
        { title: t('dashboard.nav.documentation'), href: 'https://laravel.com/docs/starter-kits#react', icon: BookOpen },
    ];

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/admin/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={adminNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
