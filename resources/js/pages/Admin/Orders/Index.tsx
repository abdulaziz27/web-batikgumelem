import { Head, router } from '@inertiajs/react';
import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from '@tanstack/react-table';
import { ArrowUpDown, ChevronLeft, ChevronRight, Eye, Search } from 'lucide-react';
import { useEffect, useState } from 'react';

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AdminLayout from '@/layouts/admin-layout';
import { type BreadcrumbItem } from '@/types';
import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';

interface ShippingAddress {
    id: number;
    full_name: string;
    address_line1: string;
    address_line2?: string;
    city: string;
    postal_code: string;
    state: string;
    country: string;
    phone: string;
}

interface User {
    id: number;
    name: string;
    email: string;
}

interface Order {
    id: number;
    order_number: string;
    status: string;
    user_id?: number;
    guest_name?: string;
    guest_email?: string;
    total_amount: number;
    total_price: number;
    shipping_cost: number;
    payment_method: string;
    payment_status: string;
    created_at: string;
    updated_at: string;
    user?: User;
    shipping_address_id: number;
    shipping_address?: ShippingAddress;
}

interface OrdersIndexProps {
    orders: Order[];
    statusCounts: {
        all: number;
        pending: number;
        processing: number;
        shipped: number;
        delivered: number;
        cancelled: number;
    };
}

type StatusBadgeVariant = 'default' | 'secondary' | 'destructive' | 'outline';

export default function OrdersIndex({ orders, statusCounts }: OrdersIndexProps) {
    const { t } = useTranslation();
    const breadcrumbs: BreadcrumbItem[] = [
        { title: t('dashboard.nav.adminDashboard'), href: '/admin/dashboard' },
        { title: t('dashboard.nav.adminOrders'), href: '/admin/orders' },
    ];

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [orderToDelete, setOrderToDelete] = useState<Order | null>(null);
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [isMobile, setIsMobile] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const [activeTab, setActiveTab] = useState('all');

    // Check if we're on a mobile device
    useEffect(() => {
        const checkIfMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkIfMobile();
        window.addEventListener('resize', checkIfMobile);

        return () => {
            window.removeEventListener('resize', checkIfMobile);
        };
    }, []);

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(price);
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return format(date, 'dd MMM yyyy HH:mm');
    };

    const getStatusColor = (status: string): StatusBadgeVariant => {
        switch (status) {
            case 'pending':
                return 'default';
            case 'processing':
                return 'secondary';
            case 'shipped':
                return 'default';
            case 'delivered':
                return 'default';
            case 'cancelled':
                return 'destructive';
            default:
                return 'secondary';
        }
    };

    // Handle status tab changes
    const handleStatusChange = (status: string) => {
        setActiveTab(status);

        if (table && table.getColumn('status')) {
            if (status === 'all') {
                table.getColumn('status')?.setFilterValue(null);
            } else {
                table.getColumn('status')?.setFilterValue(status);
            }
        }
    };

    // Handle per page changes
    const handlePerPageChange = (perPage: string) => {
        table.setPageSize(Number(perPage));
    };

    const columns: ColumnDef<Order>[] = [
        {
            accessorKey: 'order_number',
            header: ({ column }) => (
                <div className="flex items-center">
                    <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')} className="p-0 hover:bg-transparent">
                        No. Pesanan
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                </div>
            ),
            cell: ({ row }) => <span className="font-medium">{row.getValue('order_number') || `#${row.original.id}`}</span>,
            enableColumnFilter: true,
            filterFn: 'includesString',
        },
        {
            accessorKey: 'created_at',
            header: ({ column }) => (
                <div className="flex items-center">
                    <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')} className="p-0 hover:bg-transparent">
                        {t('dashboard.pages.adminOrders.table.date')}
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                </div>
            ),
            cell: ({ row }) => formatDate(row.getValue('created_at')),
            sortingFn: (rowA, rowB, columnId) => {
                const dateA = new Date(rowA.getValue(columnId)).getTime();
                const dateB = new Date(rowB.getValue(columnId)).getTime();
                return dateA < dateB ? -1 : dateA > dateB ? 1 : 0;
            },
        },
        {
            accessorFn: (row) => (row.user ? row.user.name : row.guest_name || t('dashboard.pages.adminOrders.guest')),
            id: 'customer',
            header: t('dashboard.pages.adminOrders.table.customer'),
            cell: ({ getValue }) => <span>{getValue<string>()}</span>,
            enableColumnFilter: true,
            filterFn: 'includesString',
        },
        {
            accessorKey: 'total_amount',
            header: ({ column }) => (
                <div className="flex items-center">
                    <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')} className="p-0 hover:bg-transparent">
                        {t('dashboard.pages.adminOrders.table.total')}
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                </div>
            ),
            cell: ({ row }) => formatPrice(row.original.total_amount || row.original.total_price || 0),
            sortingFn: (rowA, rowB, columnId) => {
                const amountA = rowA.original.total_amount || rowA.original.total_price || 0;
                const amountB = rowB.original.total_amount || rowB.original.total_price || 0;
                return amountA < amountB ? -1 : amountA > amountB ? 1 : 0;
            },
        },
        {
            accessorKey: 'status',
            header: t('dashboard.pages.adminOrders.table.status'),
            cell: ({ row }) => {
                const status = row.getValue('status') as string;
                const normalized = (status || '').toLowerCase();
                const label = t(`dashboard.pages.adminOrders.statusLabel.${normalized}`, { defaultValue: status });
                return <Badge variant={getStatusColor(status)}>{label}</Badge>;
            },
            enableColumnFilter: true,
            filterFn: (row, id, value) => {
                if (!value || value === 'all') return true;
                return row.getValue(id) === value;
            },
        },
        {
            accessorKey: 'payment_status',
            header: t('dashboard.pages.adminOrders.table.payment'),
            cell: ({ row }) => {
                const status = row.getValue('payment_status') as string;
                const normalized = (status || '').toLowerCase();
                const label = t(`dashboard.pages.adminOrders.paymentLabel.${normalized}`, { defaultValue: status });
                return <Badge variant={status === 'paid' ? 'default' : 'secondary'}>{label}</Badge>;
            },
        },
        {
            id: 'actions',
            header: t('dashboard.pages.adminOrders.table.actions'),
            cell: ({ row }) => {
                const order = row.original;
                return (
                    <Button variant="ghost" size="icon" asChild>
                        <a href={`/admin/orders/${order.id}`}>
                            <Eye className="h-4 w-4" />
                        </a>
                    </Button>
                );
            },
            enableSorting: false,
        },
    ];

    const table = useReactTable({
        data: orders,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        onColumnFiltersChange: setColumnFilters,
        state: {
            sorting,
            columnFilters,
            pagination: {
                pageIndex: 0,
                pageSize: 10,
            },
        },
        initialState: {
            pagination: {
                pageSize: 10,
            },
        },
        enableSorting: true,
        enableFilters: true,
    });

    // Debounced search effect
    useEffect(() => {
        if (!table) return;

        const timeoutId = setTimeout(() => {
            // Search in order number
            if (table.getColumn('order_number')) {
                table.getColumn('order_number')?.setFilterValue(searchValue);
            }

            // Also search in customer name
            if (table.getColumn('customer')) {
                table.getColumn('customer')?.setFilterValue(searchValue);
            }
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [searchValue, table]);

    // Set initial status filter
    useEffect(() => {
        if (!table || !table.getColumn('status')) return;

        if (activeTab && activeTab !== 'all') {
            table.getColumn('status')?.setFilterValue(activeTab);
        }
    }, [table, activeTab]);

    const confirmDelete = (order: Order) => {
        setOrderToDelete(order);
        setDeleteDialogOpen(true);
    };

    const handleDelete = () => {
        if (orderToDelete) {
            router.delete(`/admin/orders/${orderToDelete.id}`, {
                onSuccess: () => {
                    setDeleteDialogOpen(false);
                    setOrderToDelete(null);
                },
            });
        }
    };

    // Render order cards for mobile view
    const renderOrderCards = () => {
        return table.getRowModel().rows.map((row) => {
            const order = row.original;
            return (
                <Card key={order.id} className="mb-4">
                    <CardContent className="p-4">
                        <div className="mb-3 flex items-center justify-between">
                            <h3 className="text-lg font-medium">{order.order_number || `Order #${order.id}`}</h3>
                            <Badge variant={getStatusColor(order.status)} className="ml-2">
                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </Badge>
                        </div>

                        <div className="my-2 grid grid-cols-2 gap-2">
                            <div>
                                <p className="text-muted-foreground text-sm">Date</p>
                                <p className="font-medium">{formatDate(order.created_at)}</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground text-sm">Customer</p>
                                <p className="font-medium">{order.user ? order.user.name : order.guest_name || 'Guest'}</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground text-sm">Amount</p>
                                <p className="font-medium">{formatPrice(order.total_amount || order.total_price || 0)}</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground text-sm">Payment</p>
                                <Badge variant={order.payment_status === 'paid' ? 'default' : 'secondary'}>
                                    {order.payment_status.charAt(0).toUpperCase() + order.payment_status.slice(1)}
                                </Badge>
                            </div>
                        </div>

                        <div className="mt-4 flex justify-end space-x-2">
                            <Button variant="ghost" size="icon" asChild>
                                <a href={`/admin/orders/${order.id}`}>
                                    <Eye className="h-4 w-4" />
                                </a>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            );
        });
    };

    return (
        <AdminLayout breadcrumbs={breadcrumbs}>
            <Head title={t('dashboard.pages.adminOrders.headTitle')} />

            <div className="space-y-6 p-3 sm:p-6">
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <h1 className="text-2xl font-bold tracking-tight">{t('dashboard.nav.adminOrders')}</h1>
                </div>

                <div className="grid gap-4 md:grid-cols-4">
                    <Card>
                        <CardHeader className="pb-2">
                    <CardTitle>{t('dashboard.pages.adminOrders.cards.allTitle')}</CardTitle>
                    <CardDescription>{t('dashboard.pages.adminOrders.cards.allDesc')}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{statusCounts.all}</div>
                    <p className="text-muted-foreground text-xs">{t('dashboard.pages.adminOrders.cards.allHint')}</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-2">
                    <CardTitle>{t('dashboard.pages.adminOrders.cards.pendingTitle')}</CardTitle>
                    <CardDescription>{t('dashboard.pages.adminOrders.cards.pendingDesc')}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{statusCounts.pending}</div>
                    <p className="text-muted-foreground text-xs">{t('dashboard.pages.adminOrders.cards.pendingHint')}</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-2">
                    <CardTitle>{t('dashboard.pages.adminOrders.cards.processingTitle')}</CardTitle>
                    <CardDescription>{t('dashboard.pages.adminOrders.cards.processingDesc')}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{statusCounts.processing}</div>
                    <p className="text-muted-foreground text-xs">{t('dashboard.pages.adminOrders.cards.processingHint')}</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-2">
                    <CardTitle>{t('dashboard.pages.adminOrders.cards.shippedTitle')}</CardTitle>
                    <CardDescription>{t('dashboard.pages.adminOrders.cards.shippedDesc')}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{statusCounts.shipped + statusCounts.delivered}</div>
                    <p className="text-muted-foreground text-xs">{t('dashboard.pages.adminOrders.cards.shippedHint')}</p>
                        </CardContent>
                    </Card>
                </div>

                <Separator />

                <Card>
                    <CardHeader className="px-4 py-4 sm:px-6">
                        <div className="flex flex-col gap-4">
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                <div className="relative w-full sm:max-w-xs">
                                    <Search className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
                                    <Input
                                        type="search"
                                        name="search"
                                        placeholder={t('dashboard.pages.adminOrders.searchPlaceholder')}
                                        value={searchValue}
                                        onChange={(e) => setSearchValue(e.target.value)}
                                        className="w-full pl-8"
                                    />
                                </div>
                            </div>

                            <Tabs value={activeTab} onValueChange={handleStatusChange}>
                                <TabsList className="grid w-full auto-cols-max grid-flow-col overflow-x-auto sm:flex sm:w-auto">
                                    <TabsTrigger className="min-w-[100px] text-center" value="all">
                                        {t('dashboard.pages.adminOrders.tabs.all')} ({statusCounts.all})
                                    </TabsTrigger>
                                    <TabsTrigger className="min-w-[100px] text-center" value="pending">
                                        {t('dashboard.pages.adminOrders.tabs.pending')} ({statusCounts.pending})
                                    </TabsTrigger>
                                    <TabsTrigger className="min-w-[100px] text-center" value="processing">
                                        {t('dashboard.pages.adminOrders.tabs.processing')} ({statusCounts.processing})
                                    </TabsTrigger>
                                    <TabsTrigger className="min-w-[100px] text-center" value="shipped">
                                        {t('dashboard.pages.adminOrders.tabs.shipped')} ({statusCounts.shipped})
                                    </TabsTrigger>
                                    <TabsTrigger className="min-w-[100px] text-center" value="delivered">
                                        {t('dashboard.pages.adminOrders.tabs.delivered')} ({statusCounts.delivered})
                                    </TabsTrigger>
                                    <TabsTrigger className="min-w-[100px] text-center" value="cancelled">
                                        {t('dashboard.pages.adminOrders.tabs.cancelled')} ({statusCounts.cancelled})
                                    </TabsTrigger>
                                </TabsList>
                            </Tabs>
                        </div>
                    </CardHeader>
                    <CardContent className="px-4 sm:px-6">
                        {isMobile ? (
                            <div className="py-2">
                                {table.getRowModel().rows.length ? (
                                    renderOrderCards()
                                ) : (
                                    <div className="text-muted-foreground py-10 text-center">{t('dashboard.pages.adminOrders.empty')}</div>
                                )}
                            </div>
                        ) : (
                            <div className="rounded-md border">
                                <Table>
                                    <TableHeader>
                                        {table.getHeaderGroups().map((headerGroup) => (
                                            <TableRow key={headerGroup.id}>
                                                {headerGroup.headers.map((header) => (
                                                    <TableHead key={header.id}>
                                                        {header.isPlaceholder
                                                            ? null
                                                            : flexRender(header.column.columnDef.header, header.getContext())}
                                                    </TableHead>
                                                ))}
                                            </TableRow>
                                        ))}
                                    </TableHeader>
                                    <TableBody>
                                        {table.getRowModel().rows.length ? (
                                            table.getRowModel().rows.map((row) => (
                                                <TableRow key={row.id} data-state={row.original.status === 'cancelled' ? 'destructive' : undefined}>
                                                    {row.getVisibleCells().map((cell) => (
                                                        <TableCell key={cell.id}>
                                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                        </TableCell>
                                                    ))}
                                                </TableRow>
                                            ))
                                        ) : (
                                            <TableRow>
                                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                                    {t('dashboard.pages.adminOrders.empty')}
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        )}
                    </CardContent>
                    <CardFooter className="border-t px-4 py-4 sm:px-6">
                        <div className="flex w-full flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div className="text-muted-foreground text-center text-sm sm:text-left">
                                {t('dashboard.pages.adminOrders.pagination.showingFmt', {
                                    from:
                                        table.getFilteredRowModel().rows.length > 0
                                            ? table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1
                                            : 0,
                                    to: Math.min(
                                        (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
                                        table.getFilteredRowModel().rows.length,
                                    ),
                                    total: table.getFilteredRowModel().rows.length,
                                })}
                            </div>
                            <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-6 lg:gap-8">
                                <div className="flex w-full items-center gap-2 sm:w-auto">
                                    <p className="text-sm font-medium whitespace-nowrap">{t('dashboard.pages.adminOrders.pagination.rowsPerPage')}</p>
                                    <Select value={String(table.getState().pagination.pageSize)} onValueChange={handlePerPageChange}>
                                        <SelectTrigger className="h-8 w-[80px]">
                                            <SelectValue placeholder={table.getState().pagination.pageSize} />
                                        </SelectTrigger>
                                        <SelectContent side="top">
                                            {[5, 10, 20, 30, 50, 100].map((pageSize) => (
                                                <SelectItem key={pageSize} value={`${pageSize}`}>
                                                    {pageSize}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="flex w-full items-center justify-center sm:w-auto">
                                    <div className="flex items-center space-x-2">
                                        <Button
                                            variant="outline"
                                            className="hidden h-8 w-8 p-0 lg:flex"
                                            onClick={() => table.setPageIndex(0)}
                                            disabled={!table.getCanPreviousPage()}
                                        >
                                            <span className="sr-only">{t('dashboard.pages.adminOrders.pagination.first')}</span>
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="16"
                                                height="16"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                className="lucide lucide-chevrons-left"
                                            >
                                                <path d="m11 17-5-5 5-5" />
                                                <path d="m18 17-5-5 5-5" />
                                            </svg>
                                        </Button>
                                        <Button
                                            variant="outline"
                                            className="h-8 w-8 p-0 sm:h-9 sm:w-9"
                                            onClick={() => table.previousPage()}
                                            disabled={!table.getCanPreviousPage()}
                                        >
                                            <span className="sr-only">{t('dashboard.pages.adminOrders.pagination.prev')}</span>
                                            <ChevronLeft className="h-4 w-4" />
                                        </Button>
                                        <div className="flex items-center gap-1">
                                            <span className="text-sm">{t('dashboard.pages.adminOrders.pagination.page')}</span>
                                            <strong className="text-sm font-medium">
                                                {table.getState().pagination.pageIndex + 1} {t('dashboard.pages.adminOrders.pagination.of')}{' '}
                                                {table.getPageCount()}
                                            </strong>
                                        </div>
                                        <Button
                                            variant="outline"
                                            className="h-8 w-8 p-0 sm:h-9 sm:w-9"
                                            onClick={() => table.nextPage()}
                                            disabled={!table.getCanNextPage()}
                                        >
                                            <span className="sr-only">{t('dashboard.pages.adminOrders.pagination.next')}</span>
                                            <ChevronRight className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="outline"
                                            className="hidden h-8 w-8 p-0 lg:flex"
                                            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                                            disabled={!table.getCanNextPage()}
                                        >
                                            <span className="sr-only">{t('dashboard.pages.adminOrders.pagination.last')}</span>
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="16"
                                                height="16"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                className="lucide lucide-chevrons-right"
                                            >
                                                <path d="m6 17 5-5-5-5" />
                                                <path d="m13 17 5-5-5-5" />
                                            </svg>
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardFooter>
                </Card>
            </div>

            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>{t('dashboard.pages.adminOrders.dialog.confirmTitle')}</AlertDialogTitle>
                        <AlertDialogDescription>
                            {t('dashboard.pages.adminOrders.dialog.confirmDescFmt', {
                                order: orderToDelete?.order_number || `#${orderToDelete?.id}`,
                            })}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>{t('dashboard.pages.adminOrders.dialog.cancel')}</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                            {t('dashboard.pages.adminOrders.dialog.delete')}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AdminLayout>
    );
}
