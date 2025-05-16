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

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/admin/dashboard',
    },
    {
        title: 'Orders',
        href: '/admin/orders',
    },
];

type StatusBadgeVariant = 'default' | 'secondary' | 'destructive' | 'outline';

export default function OrdersIndex({ orders, statusCounts }: OrdersIndexProps) {
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
                        Order #
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
                        Date
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
            accessorFn: (row) => (row.user ? row.user.name : row.guest_name || 'Guest'),
            id: 'customer',
            header: 'Customer',
            cell: ({ getValue }) => <span>{getValue<string>()}</span>,
            enableColumnFilter: true,
            filterFn: 'includesString',
        },
        {
            accessorKey: 'total_amount',
            header: ({ column }) => (
                <div className="flex items-center">
                    <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')} className="p-0 hover:bg-transparent">
                        Total
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
            header: 'Status',
            cell: ({ row }) => {
                const status = row.getValue('status') as string;
                return <Badge variant={getStatusColor(status)}>{status.charAt(0).toUpperCase() + status.slice(1)}</Badge>;
            },
            enableColumnFilter: true,
            filterFn: (row, id, value) => {
                if (!value || value === 'all') return true;
                return row.getValue(id) === value;
            },
        },
        {
            accessorKey: 'payment_status',
            header: 'Payment',
            cell: ({ row }) => {
                const status = row.getValue('payment_status') as string;
                return <Badge variant={status === 'paid' ? 'default' : 'secondary'}>{status.charAt(0).toUpperCase() + status.slice(1)}</Badge>;
            },
        },
        {
            id: 'actions',
            header: 'Actions',
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
            <Head title="Order Management" />

            <div className="space-y-6 p-3 sm:p-6">
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <h1 className="text-2xl font-bold tracking-tight">Order Management</h1>
                </div>

                <div className="grid gap-4 md:grid-cols-4">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle>All Orders</CardTitle>
                            <CardDescription>Order overview</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{statusCounts.all}</div>
                            <p className="text-muted-foreground text-xs">Total orders in system</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle>Pending</CardTitle>
                            <CardDescription>Orders to process</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{statusCounts.pending}</div>
                            <p className="text-muted-foreground text-xs">Waiting for processing</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle>Processing</CardTitle>
                            <CardDescription>Orders in process</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{statusCounts.processing}</div>
                            <p className="text-muted-foreground text-xs">Currently being handled</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle>Shipped</CardTitle>
                            <CardDescription>Orders shipped</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{statusCounts.shipped + statusCounts.delivered}</div>
                            <p className="text-muted-foreground text-xs">Shipped or delivered orders</p>
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
                                        placeholder="Search orders..."
                                        value={searchValue}
                                        onChange={(e) => setSearchValue(e.target.value)}
                                        className="w-full pl-8"
                                    />
                                </div>
                            </div>

                            <Tabs value={activeTab} onValueChange={handleStatusChange}>
                                <TabsList className="grid w-full auto-cols-max grid-flow-col overflow-x-auto sm:flex sm:w-auto">
                                    <TabsTrigger className="min-w-[100px] text-center" value="all">
                                        All ({statusCounts.all})
                                    </TabsTrigger>
                                    <TabsTrigger className="min-w-[100px] text-center" value="pending">
                                        Pending ({statusCounts.pending})
                                    </TabsTrigger>
                                    <TabsTrigger className="min-w-[100px] text-center" value="processing">
                                        Processing ({statusCounts.processing})
                                    </TabsTrigger>
                                    <TabsTrigger className="min-w-[100px] text-center" value="shipped">
                                        Shipped ({statusCounts.shipped})
                                    </TabsTrigger>
                                    <TabsTrigger className="min-w-[100px] text-center" value="delivered">
                                        Delivered ({statusCounts.delivered})
                                    </TabsTrigger>
                                    <TabsTrigger className="min-w-[100px] text-center" value="cancelled">
                                        Cancelled ({statusCounts.cancelled})
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
                                    <div className="text-muted-foreground py-10 text-center">No orders found</div>
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
                                                    No orders found
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
                                Showing{' '}
                                {table.getFilteredRowModel().rows.length > 0
                                    ? table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1
                                    : 0}{' '}
                                to{' '}
                                {Math.min(
                                    (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
                                    table.getFilteredRowModel().rows.length,
                                )}{' '}
                                of {table.getFilteredRowModel().rows.length} orders
                            </div>
                            <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-6 lg:gap-8">
                                <div className="flex w-full items-center gap-2 sm:w-auto">
                                    <p className="text-sm font-medium whitespace-nowrap">Rows per page</p>
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
                                            <span className="sr-only">Go to first page</span>
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
                                            <span className="sr-only">Go to previous page</span>
                                            <ChevronLeft className="h-4 w-4" />
                                        </Button>
                                        <div className="flex items-center gap-1">
                                            <span className="text-sm">Page</span>
                                            <strong className="text-sm font-medium">
                                                {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
                                            </strong>
                                        </div>
                                        <Button
                                            variant="outline"
                                            className="h-8 w-8 p-0 sm:h-9 sm:w-9"
                                            onClick={() => table.nextPage()}
                                            disabled={!table.getCanNextPage()}
                                        >
                                            <span className="sr-only">Go to next page</span>
                                            <ChevronRight className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="outline"
                                            className="hidden h-8 w-8 p-0 lg:flex"
                                            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                                            disabled={!table.getCanNextPage()}
                                        >
                                            <span className="sr-only">Go to last page</span>
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
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently delete order{' '}
                            <span className="font-semibold">{orderToDelete?.order_number || `#${orderToDelete?.id}`}</span>. This action cannot be
                            undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AdminLayout>
    );
}
