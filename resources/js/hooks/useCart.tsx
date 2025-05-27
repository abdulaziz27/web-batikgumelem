import { router } from '@inertiajs/react';
import axios from 'axios';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

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

export const CartProvider = ({ children, user }: { children: ReactNode; user?: any }) => {
    // Tidak lagi menggunakan usePage
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    // Fetch cart setiap kali user berubah (login/logout)
    useEffect(() => {
        if (!user) {
            setCartItems([]);
            return;
        }
        setIsLoading(true);
        axios
            .get('/cart/data')
            .then((response) => {
                const cartData = response.data.cart as CartData | undefined;
                if (cartData?.items) {
                    setCartItems(Object.values(cartData.items));
                }
            })
            .catch((error) => {
                console.error('Failed to fetch cart data:', error);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [user]);

    const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

    const addToCart = (product: Omit<CartItem, 'quantity'> & { quantity?: number }) => {
        if (!user) {
            router.visit('/login');
            return;
        }
        const quantity = product.quantity || 1;
        setIsLoading(true);
        setCartItems((prevItems) => {
            const existingItemIndex = prevItems.findIndex(
                (item) => item.id === product.id && (product.size ? item.size === product.size : !item.size),
            );
            if (existingItemIndex >= 0) {
                return prevItems.map((item, index) => (index === existingItemIndex ? { ...item, quantity: item.quantity + quantity } : item));
            } else {
                return [...prevItems, { ...product, quantity }];
            }
        });
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
        if (!user) {
            router.visit('/login');
            return;
        }
        setIsLoading(true);
        setCartItems((prevItems) => prevItems.filter((item) => !(item.id === id && (size ? item.size === size : !item.size))));
        const itemKey = size ? `${id}-${size}` : `${id}`;
        router.visit('/cart', {
            method: 'delete',
            data: { item_key: itemKey },
            preserveState: true,
            onFinish: () => setIsLoading(false),
        });
    };

    const updateQuantity = (id: number, quantity: number, size?: string) => {
        if (!user) {
            router.visit('/login');
            return;
        }
        if (quantity < 1) return;
        setIsLoading(true);
        setCartItems((prevItems) =>
            prevItems.map((item) => (item.id === id && (size ? item.size === size : !item.size) ? { ...item, quantity } : item)),
        );
        const itemKey = size ? `${id}-${size}` : `${id}`;
        router.visit('/cart', {
            method: 'put',
            data: { item_key: itemKey, quantity },
            preserveState: true,
            onFinish: () => setIsLoading(false),
        });
    };

    const clearCart = () => {
        if (!user) {
            router.visit('/login');
            return;
        }
        setIsLoading(true);
        setCartItems([]);
        router.post('/cart/clear', {
            preserveState: true,
            preserveScroll: true,
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
