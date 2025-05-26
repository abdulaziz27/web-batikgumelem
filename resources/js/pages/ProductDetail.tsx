import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCart } from '@/hooks/useCart';
import { formatRupiah } from '@/utils/formatters';
import { Link, usePage, router } from '@inertiajs/react';
import { Minus, Plus, ShoppingCart } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface ProductImage {
    id: number;
    product_id: number;
    image: string;
    is_primary: boolean;
}

interface ProductSize {
    id: number;
    product_id: number;
    size: string;
    stock: number;
}

interface Product {
    id: number;
    name: string;
    slug: string;
    description: string;
    price: number;
    stock: number;
    image: string;
    category: string;
    details: {
        material: string;
        technique: string;
        dimensions: string;
        colors: string;
        care: string;
    };
    images: ProductImage[];
    sizes: ProductSize[];
}

interface ProductDetailProps {
    product: Product;
    relatedProducts: Product[];
}

const ProductDetail = () => {
    const { product, relatedProducts } = usePage().props as unknown as ProductDetailProps;
    const { auth } = usePage().props as any;

    // Safer cart access with try-catch (same pattern as other components)
    let addToCart = (item: any) => {
        console.warn("Cart provider not available, cannot add to cart");
        toast.error('Fitur keranjang tidak tersedia saat ini');
    };
    
    try {
        const cart = useCart();
        addToCart = cart.addToCart;
    } catch (error) {
        console.warn("Cart provider not available, using fallback");
    }

    // Default to first size if available
    const [selectedSize, setSelectedSize] = useState<string>(product.sizes && product.sizes.length > 0 ? product.sizes[0].size : '');

    const [quantity, setQuantity] = useState(1);

    // Default to first image or main product image
    const mainImage =
        product.images && product.images.length > 0 ? product.images.find((img) => img.is_primary)?.image || product.images[0].image : product.image;

    const [selectedImage, setSelectedImage] = useState(mainImage);

    // Get all product images or use main image if no additional images
    const allImages = product.images && product.images.length > 0 ? product.images.map((img) => img.image) : [product.image];

    // Check stock for selected size
    const selectedSizeObj = product.sizes && product.sizes.length > 0 ? product.sizes.find((size) => size.size === selectedSize) : null;

    const stockForSelectedSize = selectedSizeObj ? selectedSizeObj.stock : product.stock;
    const isOutOfStock = stockForSelectedSize <= 0;

    const handleAddToCart = () => {
        if (isOutOfStock || quantity <= 0) return;
        if (!auth?.user) {
            toast.error('Anda harus login untuk menambah produk ke keranjang. Silakan login terlebih dahulu.');
            router.visit('/login');
            return;
        }
        
        try {
            addToCart({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                size: selectedSize,
                quantity: quantity,
            });
        } catch (error) {
            console.error('Error adding to cart:', error);
            toast.error('Gagal menambahkan produk ke keranjang');
        }
    };

    const handleIncreaseQuantity = () => {
        if (quantity < stockForSelectedSize) {
            setQuantity(quantity + 1);
        }
    };

    const handleDecreaseQuantity = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
        }
    };

    // Define breadcrumbs
    const breadcrumbs = [
        { title: 'Beranda', href: '/' },
        { title: 'Produk', href: '/products' },
        { title: product.name, href: '' },
    ];

    return (
        <Layout>
            <div className="bg-white">
                <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
                    {/* Breadcrumbs */}
                    <nav className="mb-6 flex" aria-label="Breadcrumb">
                        <ol className="inline-flex items-center space-x-1 md:space-x-3">
                            <li className="inline-flex items-center">
                                <Link href="/" className="hover:text-batik-brown link-hover text-sm text-gray-500">
                                    Beranda
                                </Link>
                            </li>
                            <li>
                                <div className="flex items-center">
                                    <span className="mx-2 text-gray-400">/</span>
                                    <Link href="/products" className="hover:text-batik-brown link-hover text-sm text-gray-500">
                                        Produk
                                    </Link>
                                </div>
                            </li>
                            <li>
                                <div className="flex items-center">
                                    <span className="mx-2 text-gray-400">/</span>
                                    <span className="text-batik-brown text-sm">{product.name}</span>
                                </div>
                            </li>
                        </ol>
                    </nav>

                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                        {/* Product Image Gallery */}
                        <div className="space-y-4">
                            {/* Main image */}
                            <div className="aspect-square overflow-hidden rounded-xl bg-gray-100">
                                <img src={selectedImage} alt={product.name} className="animate-fade-in h-full w-full object-cover object-center" />
                            </div>

                            {/* Thumbnail carousel */}
                            {allImages.length > 1 && (
                                <div className="mt-4">
                                    <Carousel
                                        opts={{
                                            align: 'start',
                                            loop: true,
                                        }}
                                        className="w-full"
                                    >
                                        <CarouselContent>
                                            {allImages.map((image, index) => (
                                                <CarouselItem key={index} className="basis-1/4 md:basis-1/5 lg:basis-1/4">
                                                    <div
                                                        className={`hover-grow aspect-square cursor-pointer overflow-hidden rounded-md border-2 ${
                                                            selectedImage === image ? 'border-batik-brown' : 'border-transparent'
                                                        }`}
                                                        onClick={() => setSelectedImage(image)}
                                                    >
                                                        <img
                                                            src={image}
                                                            alt={`${product.name} view ${index + 1}`}
                                                            className="h-full w-full object-cover object-center"
                                                        />
                                                    </div>
                                                </CarouselItem>
                                            ))}
                                        </CarouselContent>
                                        <CarouselPrevious className="-left-2 h-7 w-7" />
                                        <CarouselNext className="-right-2 h-7 w-7" />
                                    </Carousel>
                                </div>
                            )}
                        </div>

                        {/* Product Info */}
                        <div className="space-y-6">
                            <div className="animate-fade-in">
                                <h1 className="text-batik-brown text-2xl font-bold tracking-tight sm:text-3xl">{product.name}</h1>
                                <p className="mt-1 text-sm text-gray-500">{product.category}</p>
                            </div>

                            <div className="text-batik-brown animate-fade-in text-3xl font-bold" style={{ animationDelay: '200ms' }}>
                                {formatRupiah(product.price)}
                            </div>

                            <div className="animate-fade-in" style={{ animationDelay: '300ms' }}>
                                <h2 className="text-batik-brown text-sm font-medium">Deskripsi</h2>
                                <p className="mt-2 text-sm text-gray-600">{product.description}</p>
                            </div>

                            <div className="animate-fade-in space-y-4" style={{ animationDelay: '400ms' }}>
                                {product.sizes && product.sizes.length > 0 && (
                                    <div>
                                        <h2 className="text-batik-brown text-sm font-medium">Ukuran</h2>
                                        <div className="mt-2">
                                            <Select value={selectedSize} onValueChange={setSelectedSize}>
                                                <SelectTrigger className="w-32">
                                                    <SelectValue placeholder="Pilih Ukuran" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {product.sizes.map((size) => (
                                                        <SelectItem key={size.id} value={size.size} disabled={size.stock <= 0}>
                                                            {size.size} {size.stock <= 0 && '(Habis)'}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                )}

                                <div>
                                    <div className="flex items-center justify-between">
                                        <h2 className="text-batik-brown text-sm font-medium">Jumlah</h2>
                                        <span className={`text-sm ${isOutOfStock ? 'text-red-500' : 'text-green-600'}`}>
                                            {isOutOfStock ? 'Stok habis' : `Tersedia: ${stockForSelectedSize} item`}
                                        </span>
                                    </div>
                                    <div className="mt-2 flex items-center">
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={handleDecreaseQuantity}
                                            disabled={quantity <= 1 || isOutOfStock}
                                            className="h-9 w-9"
                                        >
                                            <Minus className="h-4 w-4" />
                                        </Button>
                                        <span className="flex h-9 w-12 items-center justify-center text-center">{quantity}</span>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={handleIncreaseQuantity}
                                            disabled={quantity >= stockForSelectedSize || isOutOfStock}
                                            className="h-9 w-9"
                                        >
                                            <Plus className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>

                                <Button
                                    className="bg-batik-brown hover:bg-batik-brown/90 hover-lift w-full"
                                    disabled={isOutOfStock}
                                    onClick={handleAddToCart}
                                >
                                    <ShoppingCart className="mr-2 h-5 w-5" />
                                    Tambahkan ke Keranjang
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Product details tabs */}
                    <div className="animate-fade-in mt-12" style={{ animationDelay: '500ms' }}>
                        <Tabs defaultValue="details">
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="details">Detail Produk</TabsTrigger>
                                <TabsTrigger value="care">Perawatan</TabsTrigger>
                            </TabsList>

                            <TabsContent value="details" className="mt-6 space-y-4">
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    {product.details && (
                                        <>
                                            <div>
                                                <h3 className="text-batik-brown text-sm font-medium">Bahan</h3>
                                                <p className="mt-1 text-sm text-gray-600">{product.details.material}</p>
                                            </div>
                                            <div>
                                                <h3 className="text-batik-brown text-sm font-medium">Teknik Pembuatan</h3>
                                                <p className="mt-1 text-sm text-gray-600">{product.details.technique}</p>
                                            </div>
                                            <div>
                                                <h3 className="text-batik-brown text-sm font-medium">Dimensi</h3>
                                                <p className="mt-1 text-sm text-gray-600">{product.details.dimensions}</p>
                                            </div>
                                            <div>
                                                <h3 className="text-batik-brown text-sm font-medium">Warna</h3>
                                                <p className="mt-1 text-sm text-gray-600">{product.details.colors}</p>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </TabsContent>

                            <TabsContent value="care" className="mt-6">
                                <div className="space-y-4">
                                    <h3 className="text-batik-brown text-sm font-medium">Panduan Perawatan</h3>
                                    {product.details ? (
                                        <p className="text-sm text-gray-600">{product.details.care}</p>
                                    ) : (
                                        <p className="text-sm text-gray-600">
                                            Cuci dengan tangan menggunakan deterjen lembut, hindari pemutih, jemur di tempat teduh
                                        </p>
                                    )}
                                </div>
                            </TabsContent>
                        </Tabs>
                    </div>

                    {/* Related Products section */}
                    {relatedProducts && relatedProducts.length > 0 && (
                        <div className="mt-16">
                            <h2 className="text-batik-brown mb-6 text-2xl font-bold">Produk Terkait</h2>
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                {relatedProducts.map((relatedProduct) => (
                                    <Link key={relatedProduct.id} href={`/products/${relatedProduct.slug}`} className="group product-card hover-lift">
                                        <div className="aspect-square overflow-hidden rounded-t-xl">
                                            <img
                                                src={relatedProduct.image}
                                                alt={relatedProduct.name}
                                                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                            />
                                        </div>
                                        <div className="p-4">
                                            <h3 className="text-batik-brown group-hover:text-batik-indigo font-medium">{relatedProduct.name}</h3>
                                            <p className="text-batik-indigo mt-1 font-semibold">{formatRupiah(relatedProduct.price)}</p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
};

export default ProductDetail;