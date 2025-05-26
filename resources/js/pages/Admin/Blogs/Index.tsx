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

interface Blog {
    id: number;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    image: string;
    category: string;
    author: string;
    created_at: string;
    updated_at: string;
}

interface BlogsIndexProps {
    blogs: Blog[];
    categories: string[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dasbor',
        href: '/admin/dashboard',
    },
    {
        title: 'Blog',
        href: '/admin/blogs',
    },
];

export default function BlogsIndex({ blogs, categories }: BlogsIndexProps) {
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [blogToDelete, setBlogToDelete] = useState<Blog | null>(null);
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [isMobile, setIsMobile] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const [categoryValue, setCategoryValue] = useState('all');

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

    // Format date helper
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        });
    };

    const columns: ColumnDef<Blog>[] = [
        {
            accessorKey: 'image',
            header: 'Gambar',
            cell: ({ row }) => {
                const blog = row.original;
                return (
                    <img
                        src={blog.image ? `/storage/${blog.image}` : '/placeholder-image.jpg'}
                        alt={blog.title}
                        className="h-10 w-16 rounded-sm object-cover"
                    />
                );
            },
            enableSorting: false,
        },
        {
            accessorKey: 'title',
            header: ({ column }) => (
                <div className="flex items-center">
                    <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')} className="p-0 hover:bg-transparent">
                        Judul
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                </div>
            ),
            cell: ({ row }) => <span className="font-medium">{row.getValue('title')}</span>,
            enableColumnFilter: true,
            filterFn: 'includesString',
        },
        {
            accessorKey: 'category',
            header: 'Kategori',
            cell: ({ row }) => <Badge variant="outline">{row.getValue('category')}</Badge>,
            enableColumnFilter: true,
            filterFn: (row, id, value) => {
                if (!value || value === 'all') return true;
                const category = row.getValue(id) as string;
                return category === value;
            },
        },
        {
            accessorKey: 'author',
            header: 'Penulis',
        },
        {
            accessorKey: 'created_at',
            header: ({ column }) => (
                <div className="flex items-center">
                    <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')} className="p-0 hover:bg-transparent">
                        Tanggal
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
            id: 'actions',
            header: 'Aksi',
            cell: ({ row }) => {
                const blog = row.original;
                return (
                    <div className="flex space-x-2">
                        <Button variant="ghost" size="icon" asChild>
                            <Link href={`/admin/blogs/${blog.id}`}>
                                <Eye className="h-4 w-4" />
                            </Link>
                        </Button>
                        <Button variant="ghost" size="icon" asChild>
                            <Link href={`/admin/blogs/${blog.id}/edit`}>
                                <Edit className="h-4 w-4" />
                            </Link>
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => confirmDelete(blog)}>
                            <Trash className="h-4 w-4" />
                        </Button>
                    </div>
                );
            },
            enableSorting: false,
        },
    ];

    const table = useReactTable({
        data: blogs,
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
        if (!table || !table.getColumn('title')) return;

        const timeoutId = setTimeout(() => {
            table.getColumn('title')?.setFilterValue(searchValue);
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [searchValue, table]);

    // Category filter effect
    useEffect(() => {
        if (!table || !table.getColumn('category')) return;

        table.getColumn('category')?.setFilterValue(categoryValue === 'all' ? null : categoryValue);
    }, [categoryValue, table]);

    const confirmDelete = (blog: Blog) => {
        setBlogToDelete(blog);
        setDeleteDialogOpen(true);
    };

    const handleDelete = () => {
        if (blogToDelete) {
            router.delete(`/admin/blogs/${blogToDelete.id}`, {
                onSuccess: () => {
                    setDeleteDialogOpen(false);
                    setBlogToDelete(null);
                },
            });
        }
    };

    // Handle category filter changes
    const handleCategoryChange = (category: string) => {
        setCategoryValue(category);
    };

    // Handle per page changes
    const handlePerPageChange = (perPage: string) => {
        table.setPageSize(Number(perPage));
    };

    // Render blog cards for mobile view
    const renderBlogCards = () => {
        return table.getRowModel().rows.map((row) => {
            const blog = row.original;
            return (
                <Card key={blog.id} className="mb-4">
                    <CardContent className="p-4">
                        <div className="mb-3 flex items-center gap-3">
                            <img
                                src={blog.image ? `/storage/${blog.image}` : '/placeholder-image.jpg'}
                                alt={blog.title}
                                className="h-16 w-24 rounded-md object-cover"
                            />
                            <div>
                                <h3 className="text-lg font-medium">{blog.title}</h3>
                                <Badge variant="outline" className="mt-1">
                                    {blog.category}
                                </Badge>
                            </div>
                        </div>

                        <div className="my-2 grid grid-cols-2 gap-2">
                            <div>
                                <p className="text-muted-foreground text-sm">Author</p>
                                <p className="font-medium">{blog.author}</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground text-sm">Date</p>
                                <p className="font-medium">{formatDate(blog.created_at)}</p>
                            </div>
                        </div>

                        <div className="mt-3 flex justify-end space-x-2">
                            <Button variant="outline" size="sm" asChild className="h-9 px-3 py-1">
                                <Link href={`/admin/blogs/${blog.id}`}>
                                    <Eye className="mr-1 h-4 w-4" /> View
                                </Link>
                            </Button>
                            <Button variant="outline" size="sm" asChild className="h-9 px-3 py-1">
                                <Link href={`/admin/blogs/${blog.id}/edit`}>
                                    <Edit className="mr-1 h-4 w-4" /> Edit
                                </Link>
                            </Button>
                            <Button variant="outline" size="sm" className="h-9 px-3 py-1" onClick={() => confirmDelete(blog)}>
                                <Trash className="mr-1 h-4 w-4" /> Delete
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            );
        });
    };

    return (
        <AdminLayout breadcrumbs={breadcrumbs}>
            <Head title="Manajemen Blog" />

            <div className="space-y-6 p-3 sm:p-6">
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <h1 className="text-2xl font-bold tracking-tight">Manajemen Blog</h1>
                    <Button asChild className="w-full sm:w-auto">
                        <Link href="/admin/blogs/create">
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Tambah Blog
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
                                    placeholder="Cari blog..."
                                    value={searchValue}
                                    onChange={(e) => setSearchValue(e.target.value)}
                                    className="w-full pl-8"
                                />
                            </div>
                            <Select value={categoryValue} onValueChange={handleCategoryChange}>
                                <SelectTrigger className="w-full sm:w-[180px]">
                                    <SelectValue placeholder="Filter kategori" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Semua Kategori</SelectItem>
                                    {categories.map((category) => (
                                        <SelectItem key={category} value={category}>
                                            {category}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </CardHeader>

                    <CardContent className="px-4 sm:px-6">
                        <div className="rounded-md border">
                            {isMobile ? (
                                <div className="divide-y">
                                    {table.getRowModel().rows.length > 0 ? (
                                        renderBlogCards()
                                    ) : (
                                        <div className="text-muted-foreground py-10 text-center">Tidak ada blog ditemukan</div>
                                    )}
                                </div>
                            ) : (
                                <Table>
                                    <TableHeader>
                                        {table.getHeaderGroups().map((headerGroup) => (
                                            <TableRow key={headerGroup.id}>
                                                {headerGroup.headers.map((header) => (
                                                    <TableHead key={header.id}>
                                                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                                    </TableHead>
                                                ))}
                                            </TableRow>
                                        ))}
                                    </TableHeader>
                                    <TableBody>
                                        {table.getRowModel().rows?.length ? (
                                            table.getRowModel().rows.map((row) => (
                                                <TableRow key={row.id}>
                                                    {row.getVisibleCells().map((cell) => (
                                                        <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                                                    ))}
                                                </TableRow>
                                            ))
                                        ) : (
                                            <TableRow>
                                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                                    Tidak ada blog ditemukan
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            )}
                        </div>

                        <div className="flex flex-col items-center justify-between gap-4 p-4 sm:flex-row">
                            <div className="flex w-full items-center gap-2 sm:w-auto">
                                <p className="text-sm font-medium whitespace-nowrap">Baris per halaman</p>
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
                                        <span className="sr-only">Ke halaman pertama</span>
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
                                        className="h-8 w-8 p-0"
                                        onClick={() => table.previousPage()}
                                        disabled={!table.getCanPreviousPage()}
                                    >
                                        <span className="sr-only">Ke halaman sebelumnya</span>
                                        <ChevronLeft className="h-4 w-4" />
                                    </Button>
                                    <div className="flex items-center gap-1">
                                        <span className="text-sm">Halaman</span>
                                        <strong className="text-sm font-medium">
                                            {table.getState().pagination.pageIndex + 1} dari {table.getPageCount()}
                                        </strong>
                                    </div>
                                    <Button
                                        variant="outline"
                                        className="h-8 w-8 p-0"
                                        onClick={() => table.nextPage()}
                                        disabled={!table.getCanNextPage()}
                                    >
                                        <span className="sr-only">Ke halaman berikutnya</span>
                                        <ChevronRight className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="hidden h-8 w-8 p-0 lg:flex"
                                        onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                                        disabled={!table.getCanNextPage()}
                                    >
                                        <span className="sr-only">Ke halaman terakhir</span>
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
                    </CardContent>
                </Card>
            </div>

            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Tindakan ini tidak dapat dibatalkan. Ini akan menghapus blog{' '}
                            <span className="font-medium">{blogToDelete?.title}</span> secara permanen dan menghapus datanya dari server.
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
