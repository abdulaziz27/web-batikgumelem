import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/useCart';
import { formatRupiah } from '@/utils/formatters';
import { Link } from '@inertiajs/react';
import { ShoppingCart, Star } from 'lucide-react';
import { useState } from 'react';

interface ProductCardProps {
    product: {
        id: number;
        name: string;
        price: number;
        image: string;
        description?: string;
        rating?: number;
        slug: string;
    };
    className?: string;
}

const ProductCard = ({ product, className = '' }: ProductCardProps) => {
    const { addToCart, isLoading } = useCart();
    const [isHovering, setIsHovering] = useState(false);

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        addToCart({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
        });
    };

    const rating = product.rating || 4.5; // Default to 4.5 if no rating provided

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

                    <div
                        className={`absolute right-0 bottom-0 left-0 bg-gradient-to-t from-black/70 to-transparent p-4 transition-opacity duration-300 ${
                            isHovering ? 'opacity-100' : 'opacity-0'
                        }`}
                    >
                        <Button
                            onClick={handleAddToCart}
                            size="icon"
                            className="bg-batik-brown hover:bg-batik-brown/90 rounded-full transition-transform duration-300 hover:scale-110"
                            disabled={isLoading}
                        >
                            <ShoppingCart className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                <div className="p-4">
                    <div className="mb-1 flex items-center">
                        {[...Array(5)].map((_, i) => (
                            <Star
                                key={i}
                                className={`h-3 w-3 ${
                                    i < Math.floor(rating)
                                        ? 'fill-yellow-400 text-yellow-400'
                                        : i < rating
                                          ? 'fill-yellow-400/50 text-yellow-400'
                                          : 'text-gray-300'
                                }`}
                            />
                        ))}
                        <span className="ml-1 text-xs text-gray-500">({rating})</span>
                    </div>

                    <h3 className="text-batik-brown group-hover:text-batik-brown/80 line-clamp-2 font-medium transition-colors">{product.name}</h3>

                    <p className="text-batik-indigo mt-1 font-semibold">{formatRupiah(product.price)}</p>
                </div>
            </Link>
        </div>
    );
};

export default ProductCard;
