import { Head, Link, router } from '@inertiajs/react';
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
import { ArrowUpDown, ChevronLeft, ChevronRight, Edit, Eye, PlusCircle, Search, Trash } from 'lucide-react';
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
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AdminLayout from '@/layouts/admin-layout';
import { type BreadcrumbItem } from '@/types';

interface ProductImage {
    id: number;
    product_id: number;
    image: string;
    is_primary: boolean;
}

interface Product {
    id: number;
    name: string;
    slug: string;
    description: string;
    price: number;
    total_stock: number;
    is_active: boolean;
    image?: string;
    image_url?: string;
    images?: ProductImage[];
}

interface ProductsIndexProps {
    products: Product[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dasbor',
        href: '/admin/dashboard',
    },
    {
        title: 'Produk',
        href: '/admin/products',
    },
];

export default function ProductsIndex({ products }: ProductsIndexProps) {
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [productToDelete, setProductToDelete] = useState<Product | null>(null);
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [isMobile, setIsMobile] = useState(false);
    const [searchValue, setSearchValue] = useState('');

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

    const columns: ColumnDef<Product>[] = [
        {
            accessorKey: 'image_url',
            header: 'Gambar',
            cell: ({ row }) => {
                const imageUrl = row.getValue('image_url') as string;
                const name = row.getValue('name') as string;
                return <img src={imageUrl} alt={name} className="h-10 w-10 rounded-md object-cover" />;
            },
            enableSorting: false,
        },
        {
            accessorKey: 'name',
            header: ({ column }) => {
                return (
                    <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')} className="hover:bg-transparent">
                        Nama
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                );
            },
            cell: ({ row }) => <span className="font-medium">{row.getValue('name')}</span>,
            enableColumnFilter: true,
            filterFn: 'includesString',
        },
        {
            accessorKey: 'price',
            header: ({ column }) => {
                return (
                    <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')} className="hover:bg-transparent">
                        Harga
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                );
            },
            cell: ({ row }) => formatPrice(row.getValue('price')),
        },
        {
            accessorKey: 'total_stock',
            header: ({ column }) => {
                return (
                    <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')} className="hover:bg-transparent">
                        Total Stok
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                );
            },
        },
        {
            accessorKey: 'is_active',
            header: 'Status',
            cell: ({ row }) => {
                const isActive = row.getValue('is_active') as boolean;
                return <Badge variant={isActive ? 'default' : 'outline'}>{isActive ? 'Aktif' : 'Nonaktif'}</Badge>;
            },
            enableColumnFilter: true,
            filterFn: (row, id, value) => {
                if (value === 'all') return true;
                const isActive = row.getValue(id) as boolean;
                return (value === 'active' && isActive) || (value === 'inactive' && !isActive);
            },
        },
        {
            id: 'actions',
            header: 'Aksi',
            cell: ({ row }) => {
                const product = row.original;
                return (
                    <div className="flex space-x-2">
                        <Button variant="ghost" size="icon" asChild>
                            <Link href={`/admin/products/${product.id}`}>
                                <Eye className="h-4 w-4" />
                            </Link>
                        </Button>
                        <Button variant="ghost" size="icon" asChild>
                            <Link href={`/admin/products/${product.id}/edit`}>
                                <Edit className="h-4 w-4" />
                            </Link>
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => confirmDelete(product)}>
                            <Trash className="h-4 w-4" />
                        </Button>
                    </div>
                );
            },
            enableSorting: false,
        },
    ];

    const table = useReactTable({
        data: products,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onSortingChange: (updater) => {
            const nextSorting = typeof updater === 'function' ? updater(sorting) : updater;

            setSorting(nextSorting);
        },
        getSortedRowModel: getSortedRowModel(),
        onColumnFiltersChange: setColumnFilters,
        state: {
            sorting,
            columnFilters,
        },
        initialState: {
            pagination: {
                pageSize: 10,
            },
        },
        enableSorting: true,
        enableFilters: true,
    });

    // Debounced search effect - moved here after table is defined
    useEffect(() => {
        if (!table || !table.getColumn('name')) return;

        const timeoutId = setTimeout(() => {
            table.getColumn('name')?.setFilterValue(searchValue);
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [searchValue, table]);

    const confirmDelete = (product: Product) => {
        setProductToDelete(product);
        setDeleteDialogOpen(true);
    };

    const handleDelete = () => {
        if (productToDelete) {
            router.delete(`/admin/products/${productToDelete.id}`, {
                onSuccess: () => {
                    setDeleteDialogOpen(false);
                    setProductToDelete(null);
                },
            });
        }
    };

    // Render product cards for mobile view
    const renderProductCards = () => {
        return table.getRowModel().rows.map((row) => {
            const product = row.original;
            return (
                <Card key={product.id} className="mb-4">
                    <CardContent className="p-4">
                        <div className="mb-3 flex items-center gap-3">
                            <img src={product.image_url} alt={product.name} className="h-16 w-16 rounded-md object-cover" />
                            <div>
                                <h3 className="text-lg font-medium">{product.name}</h3>
                                <Badge variant={product.is_active ? 'default' : 'outline'} className="mt-1">
                                    {product.is_active ? 'Aktif' : 'Nonaktif'}
                                </Badge>
                            </div>
                        </div>

                        <div className="my-2 grid grid-cols-2 gap-2">
                            <div>
                                <p className="text-muted-foreground text-sm">Harga</p>
                                <p className="font-medium">{formatPrice(product.price)}</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground text-sm">Total Stok</p>
                                <p className="font-medium">{product.total_stock}</p>
                            </div>
                        </div>

                        <div className="mt-3 flex justify-end space-x-2">
                            <Button variant="outline" size="sm" asChild className="h-9 px-3 py-1">
                                <Link href={`/admin/products/${product.id}`}>
                                    <Eye className="mr-1 h-4 w-4" /> Lihat
                                </Link>
                            </Button>
                            <Button variant="outline" size="sm" asChild className="h-9 px-3 py-1">
                                <Link href={`/admin/products/${product.id}/edit`}>
                                    <Edit className="mr-1 h-4 w-4" /> Edit
                                </Link>
                            </Button>
                            <Button variant="outline" size="sm" className="h-9 px-3 py-1" onClick={() => confirmDelete(product)}>
                                <Trash className="mr-1 h-4 w-4" /> Hapus
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            );
        });
    };

    return (
        <AdminLayout breadcrumbs={breadcrumbs}>
            <Head title="Manajemen Produk" />

            <div className="space-y-6 p-3 sm:p-6">
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <h1 className="text-2xl font-bold tracking-tight">Manajemen Produk</h1>
                    <Button asChild className="w-full sm:w-auto">
                        <Link href="/admin/products/create">
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Tambah Produk
                        </Link>
                    </Button>
                </div>

                <Separator />

                <Card>
                    <CardHeader className="px-4 py-4 sm:px-6">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div className="relative w-full sm:max-w-xs">
                                <Search className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
                                <Input
                                    type="search"
                                    placeholder="Cari produk..."
                                    value={searchValue}
                                    onChange={(e) => setSearchValue(e.target.value)}
                                    className="w-full pl-8"
                                />
                            </div>
                            <Select
                                value={(table.getColumn('is_active')?.getFilterValue() as string) ?? 'all'}
                                onValueChange={(value) => table.getColumn('is_active')?.setFilterValue(value)}
                            >
                                <SelectTrigger className="w-full sm:w-[180px]">
                                    <SelectValue placeholder="Filter status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Semua Status</SelectItem>
                                    <SelectItem value="active">Aktif</SelectItem>
                                    <SelectItem value="inactive">Nonaktif</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardHeader>
                    <CardContent className="px-4 sm:px-6">
                        {isMobile ? (
                            <div className="py-2">
                                {table.getRowModel().rows?.length ? (
                                    renderProductCards()
                                ) : (
                                    <div className="text-muted-foreground py-10 text-center">Tidak ada produk ditemukan</div>
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
                                        {table.getRowModel().rows?.length ? (
                                            table.getRowModel().rows.map((row) => (
                                                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
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
                                                    Tidak ada produk ditemukan
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        )}
                    </CardContent>
                    <CardFooter className="px-4 py-4 sm:px-6">
                        <div className="flex w-full flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div className="text-muted-foreground text-center text-sm sm:text-left">
                                Menampilkan {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} ke{' '}
                                {Math.min(
                                    (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
                                    table.getFilteredRowModel().rows.length,
                                )}{' '}
                                dari {table.getFilteredRowModel().rows.length} produk
                            </div>
                            <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-6 lg:gap-8">
                                <div className="flex w-full items-center gap-2 sm:w-auto">
                                    <p className="text-sm font-medium whitespace-nowrap">Baris per halaman</p>
                                    <Select
                                        value={`${table.getState().pagination.pageSize}`}
                                        onValueChange={(value) => {
                                            table.setPageSize(Number(value));
                                        }}
                                    >
                                        <SelectTrigger className="h-8 w-[80px]">
                                            <SelectValue placeholder={table.getState().pagination.pageSize} />
                                        </SelectTrigger>
                                        <SelectContent side="top">
                                            {[5, 10, 20, 30, 40, 50].map((pageSize) => (
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
                                            <span className="text-sm">Halaman</span>
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
                        <AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Tindakan ini tidak dapat dibatalkan. Ini akan menghapus produk{' '}
                            <span className="font-medium">{productToDelete?.name}</span> secara permanen dan menghapus datanya dari server.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete}>Hapus</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AdminLayout>
    );
}
