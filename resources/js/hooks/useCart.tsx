import { router } from '@inertiajs/react';
import axios from 'axios';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { toast } from 'sonner';

export interface CartItem {
    id: number;
    name: string;
    price: number;
    image: string;
    quantity: number;
    size?: string;
    slug?: string;
}

// Add cart data interface
interface CartData {
    items: Record<string, CartItem>;
    total: number;
}

interface CartContextType {
    cartItems: CartItem[];
    addToCart: (product: Omit<CartItem, 'quantity'> & { quantity?: number }) => void;
    removeFromCart: (id: number, size?: string) => void;
    updateQuantity: (id: number, quantity: number, size?: string) => void;
    clearCart: () => void;
    totalPrice: number;
    isLoading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
    const [cartItems, setCartItems] = useState<CartItem[]>(() => {
        const savedCart = localStorage.getItem('cart');
        return savedCart ? JSON.parse(savedCart) : [];
    });

    const [isLoading, setIsLoading] = useState(false);

    // Sync with server on mount
    useEffect(() => {
        // Get fresh cart data from server without navigation
        setIsLoading(true);
        axios
            .get('/cart/data')
            .then((response) => {
                const cartData = response.data.cart as CartData | undefined;
                if (cartData?.items) {
                    const serverCartItems = Object.values(cartData.items);
                    if (serverCartItems.length > 0) {
                        setCartItems(serverCartItems);
                        localStorage.setItem('cart', JSON.stringify(serverCartItems));
                    }
                }
            })
            .catch((error) => {
                console.error('Failed to fetch cart data:', error);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, []);

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cartItems));
    }, [cartItems]);

    const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

    const addToCart = (product: Omit<CartItem, 'quantity'> & { quantity?: number }) => {
        const quantity = product.quantity || 1;
        setIsLoading(true);

        // Optimistic UI update
        setCartItems((prevItems) => {
            const existingItemIndex = prevItems.findIndex(
                (item) => item.id === product.id && (product.size ? item.size === product.size : !item.size),
            );

            if (existingItemIndex >= 0) {
                toast('Produk ditambahkan', {
                    description: `${prevItems[existingItemIndex].name} jumlahnya ditambahkan ke keranjang`,
                });
                return prevItems.map((item, index) => (index === existingItemIndex ? { ...item, quantity: item.quantity + quantity } : item));
            } else {
                toast('Produk ditambahkan', {
                    description: `${product.name} ditambahkan ke keranjang`,
                });
                return [...prevItems, { ...product, quantity }];
            }
        });

        // Send data to the server using Inertia visit
        router.visit('/cart', {
            method: 'post',
            data: {
                product_id: product.id,
                quantity: quantity,
                size: product.size || null,
            },
            preserveState: true,
            onFinish: () => setIsLoading(false),
        });
    };

    const removeFromCart = (id: number, size?: string) => {
        setIsLoading(true);

        setCartItems((prevItems) => prevItems.filter((item) => !(item.id === id && (size ? item.size === size : !item.size))));

        toast('Produk dihapus', { description: 'Item telah dihapus dari keranjang' });

        const itemKey = size ? `${id}-${size}` : `${id}`;

        router.visit('/cart', {
            method: 'delete',
            data: { item_key: itemKey },
            preserveState: true,
            onFinish: () => setIsLoading(false),
        });
    };

    const updateQuantity = (id: number, quantity: number, size?: string) => {
        if (quantity < 1) return;

        setIsLoading(true);

        // Optimistic UI update
        setCartItems((prevItems) =>
            prevItems.map((item) => (item.id === id && (size ? item.size === size : !item.size) ? { ...item, quantity } : item)),
        );

        toast('Jumlah produk diperbarui', { description: `Jumlah produk telah diperbarui menjadi ${quantity}` });

        const itemKey = size ? `${id}-${size}` : `${id}`;

        router.visit('/cart', {
            method: 'put',
            data: { item_key: itemKey, quantity },
            preserveState: true,
            onFinish: () => setIsLoading(false),
        });
    };

    const clearCart = () => {
        setIsLoading(true);
        setCartItems([]);

        toast('Keranjang dikosongkan', { description: 'Semua item telah dihapus dari keranjang' });

        router.post('/cart/clear', {
            preserveState: true,
            preserveScroll: true,
            // onSuccess: (page) => { ...update state jika perlu... }
            // Tidak perlu onFinish navigasi
        });
    };

    return (
        <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart, totalPrice, isLoading }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};
