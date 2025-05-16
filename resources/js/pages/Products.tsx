// resources/js/Pages/Products.tsx
import Layout from '@/components/layout/Layout';
import ProductCard from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Pagination, PaginationContent, PaginationItem, PaginationLink } from '@/components/ui/pagination';
import { Slider } from '@/components/ui/slider';
import { formatRupiah } from '@/utils/formatters';
import { usePage } from '@inertiajs/react';
import { ArrowUpDown, ChevronDown, ChevronUp, Search, SlidersHorizontal } from 'lucide-react';
import { useState } from 'react';

// Define types based on your backend
interface Product {
    id: number;
    name: string;
    price: number;
    description: string;
    image: string;
    rating?: number;
    category?: string;
    slug: string;
}

interface ProductsProps {
    products: {
        data: Product[];
    };
}

const Products = () => {
    const { products } = usePage().props as unknown as ProductsProps;
    const allProducts = products.data || [];

    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [sortOrder, setSortOrder] = useState<'default' | 'priceAsc' | 'priceDesc' | 'nameAsc' | 'nameDesc'>('default');
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000000]);
    const [showFilters, setShowFilters] = useState(false);

    const productsPerPage = 8;

    // Filter products based on search term and price range (client-side filtering)
    const filteredProducts = allProducts.filter((product) => {
        const matchesSearch =
            product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesPriceRange = product.price >= priceRange[0] && product.price <= priceRange[1];
        return matchesSearch && matchesPriceRange;
    });

    // Sort the filtered products
    const sortedProducts = [...filteredProducts].sort((a, b) => {
        switch (sortOrder) {
            case 'priceAsc':
                return a.price - b.price;
            case 'priceDesc':
                return b.price - a.price;
            case 'nameAsc':
                return a.name.localeCompare(b.name);
            case 'nameDesc':
                return b.name.localeCompare(a.name);
            default:
                return 0;
        }
    });

    // Paginate the sorted products
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = sortedProducts.slice(indexOfFirstProduct, indexOfLastProduct);
    const totalPages = Math.ceil(sortedProducts.length / productsPerPage);

    const handleSortChange = (newSortOrder: typeof sortOrder) => {
        setSortOrder(newSortOrder);
    };

    const handlePriceChange = (values: number[]) => {
        setPriceRange([values[0], values[1]]);
    };

    const resetFilters = () => {
        setSearchTerm('');
        setPriceRange([0, 1000000]);
        setSortOrder('default');
    };

    return (
        <Layout>
            <div className="bg-batik-cream/30 batik-pattern py-10">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h1 className="text-batik-brown text-3xl font-bold tracking-tight sm:text-4xl">
                            Produk Batik <span className="text-batik-indigo">Gumelem</span>
                        </h1>
                        <p className="mx-auto mt-4 max-w-xl text-base text-gray-600">
                            Jelajahi koleksi batik tradisional Gumelem dengan berbagai motif khas dan filosofi mendalam
                        </p>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
                {/* Mobile filters toggle */}
                <div className="mb-5 flex items-center justify-between lg:hidden">
                    <div className="relative mr-2 w-full">
                        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-500" />
                        <Input placeholder="Cari produk..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
                    </div>
                    <Button variant="outline" className="flex-shrink-0" onClick={() => setShowFilters(!showFilters)}>
                        <SlidersHorizontal className="mr-2 h-4 w-4" />
                        Filter
                    </Button>
                </div>

                <div className={`lg:grid lg:grid-cols-4 lg:gap-x-8 ${showFilters ? 'block' : 'hidden lg:block'}`}>
                    {/* Sidebar filters */}
                    <div className="col-span-1 space-y-6 rounded-xl bg-white p-6 shadow-sm">
                        <div className="hidden lg:block">
                            <h3 className="text-batik-brown mb-4 text-lg font-medium">Pencarian</h3>
                            <div className="relative">
                                <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-500" />
                                <Input
                                    placeholder="Cari produk..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </div>

                        <div>
                            <h3 className="text-batik-brown mb-4 text-lg font-medium">Urutkan</h3>
                            <div className="space-y-2">
                                <Button
                                    variant={sortOrder === 'default' ? 'secondary' : 'outline'}
                                    onClick={() => handleSortChange('default')}
                                    className="w-full justify-start"
                                >
                                    <ArrowUpDown className="mr-2 h-4 w-4" />
                                    Default
                                </Button>
                                <Button
                                    variant={sortOrder === 'priceAsc' ? 'secondary' : 'outline'}
                                    onClick={() => handleSortChange('priceAsc')}
                                    className="w-full justify-start"
                                >
                                    <ChevronUp className="mr-2 h-4 w-4" />
                                    Harga: Rendah ke Tinggi
                                </Button>
                                <Button
                                    variant={sortOrder === 'priceDesc' ? 'secondary' : 'outline'}
                                    onClick={() => handleSortChange('priceDesc')}
                                    className="w-full justify-start"
                                >
                                    <ChevronDown className="mr-2 h-4 w-4" />
                                    Harga: Tinggi ke Rendah
                                </Button>
                                <Button
                                    variant={sortOrder === 'nameAsc' ? 'secondary' : 'outline'}
                                    onClick={() => handleSortChange('nameAsc')}
                                    className="w-full justify-start"
                                >
                                    <ChevronUp className="mr-2 h-4 w-4" />
                                    Nama: A-Z
                                </Button>
                                <Button
                                    variant={sortOrder === 'nameDesc' ? 'secondary' : 'outline'}
                                    onClick={() => handleSortChange('nameDesc')}
                                    className="w-full justify-start"
                                >
                                    <ChevronDown className="mr-2 h-4 w-4" />
                                    Nama: Z-A
                                </Button>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-batik-brown mb-4 text-lg font-medium">Rentang Harga</h3>
                            <div className="space-y-4">
                                <Slider
                                    defaultValue={[0, 1000000]}
                                    max={1000000}
                                    step={50000}
                                    value={[priceRange[0], priceRange[1]]}
                                    onValueChange={handlePriceChange}
                                    className="w-full"
                                />
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-500">{formatRupiah(priceRange[0])}</span>
                                    <span className="text-sm text-gray-500">{formatRupiah(priceRange[1])}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Product grid */}
                    <div className="col-span-3 mt-6 lg:mt-0">
                        {currentProducts.length > 0 ? (
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                {currentProducts.map((product) => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>
                        ) : (
                            <div className="py-12 text-center">
                                <p className="text-lg text-gray-600">Tidak ada produk yang sesuai dengan pencarian Anda.</p>
                                <Button className="bg-batik-brown hover:bg-batik-brown/90 mt-4" onClick={resetFilters}>
                                    Lihat Semua Produk
                                </Button>
                            </div>
                        )}

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <Pagination className="mt-10">
                                <PaginationContent>
                                    {Array.from({ length: totalPages }).map((_, i) => (
                                        <PaginationItem key={i}>
                                            <PaginationLink isActive={currentPage === i + 1} onClick={() => setCurrentPage(i + 1)}>
                                                {i + 1}
                                            </PaginationLink>
                                        </PaginationItem>
                                    ))}
                                </PaginationContent>
                            </Pagination>
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Products;
