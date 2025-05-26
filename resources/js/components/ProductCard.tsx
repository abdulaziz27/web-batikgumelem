import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/useCart';
import { formatRupiah } from '@/utils/formatters';
import { Link, router, usePage } from '@inertiajs/react';
import { ShoppingCart } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface ProductCardProps {
    product: {
        id: number;
        name: string;
        price: number;
        image: string;
        description?: string;
        slug: string;
    };
    className?: string;
}

const ProductCard = ({ product, className = '' }: ProductCardProps) => {
    const { addToCart, isLoading } = useCart();
    const [isHovering, setIsHovering] = useState(false);
    const { auth } = usePage().props as any;

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (!auth?.user) {
            toast.error('Anda harus login untuk menambah produk ke keranjang. Silakan login terlebih dahulu.');
            router.visit('/login');
            return;
        }
        addToCart({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
        });
    };

    return (
        <div
            className={`product-card animate-fade-in group ${className}`}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
        >
            <Link href={`/products/${product.slug}`} className="block">
                <div className="relative overflow-hidden">
                    <div className="aspect-square overflow-hidden">
                        <img
                            src={product.image}
                            alt={product.name}
                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                    </div>
                </div>

                <div className="p-4">
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <h3 className="text-batik-brown group-hover:text-batik-brown/80 line-clamp-2 font-medium transition-colors">
                                {product.name}
                            </h3>
                            <p className="text-batik-indigo mt-1 font-semibold">{formatRupiah(product.price)}</p>
                        </div>
                        <Button
                            onClick={handleAddToCart}
                            size="icon"
                            className="bg-batik-brown hover:bg-batik-brown/90 ml-4 rounded-full transition-transform duration-300 hover:scale-110 flex-shrink-0"
                            disabled={isLoading}
                        >
                            <ShoppingCart className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </Link>
        </div>
    );
};

export default ProductCard;
