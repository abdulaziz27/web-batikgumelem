import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useCart } from '@/hooks/useCart';
import { formatRupiah } from '@/utils/formatters';
import { Link, router } from '@inertiajs/react';
import { ArrowRight, ShoppingBag, Trash2 } from 'lucide-react';
import React, { useState } from 'react';

class CartErrorBoundary extends React.Component<{ children: React.ReactNode }, { error: any; errorInfo: any }> {
    constructor(props: { children: React.ReactNode }) {
        super(props);
        this.state = { error: null, errorInfo: null };
    }
    static getDerivedStateFromError(error: any) {
        return { error, errorInfo: null };
    }
    componentDidCatch(error: any, errorInfo: any) {
        this.setState({ error, errorInfo });
    }
    render() {
        if (this.state.error) {
            return (
                <Layout>
                    <div style={{ color: 'red', padding: 24 }}>
                        <h2>Terjadi error di Cart:</h2>
                        <pre>{this.state.error?.toString()}</pre>
                        <pre>{this.state.errorInfo?.componentStack}</pre>
                        <pre>{this.state.error?.stack}</pre>
                    </div>
                </Layout>
            );
        }
        return this.props.children;
    }
}

// Wrapper component yang menangkap error useCart
const CartContent = () => {
    const [error, setError] = useState<Error | null>(null);

    // Render empty cart jika terjadi error
    if (error) {
        return (
            <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
                <div className="text-center">
                    <ShoppingBag className="mx-auto h-16 w-16 text-gray-400" />
                    <h2 className="mt-2 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">Keranjang Belanja Kosong</h2>
                    <p className="mt-4 text-gray-500">Anda belum menambahkan produk apapun ke keranjang belanja.</p>
                    <div className="mt-6">
                        <Button asChild className="bg-batik-indigo hover:bg-batik-indigo/90">
                            <Link href="/products">Lihat Produk</Link>
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    try {
        const { cartItems, removeFromCart, updateQuantity, clearCart, totalPrice, isLoading } = useCart();

        if (cartItems.length === 0) {
            return (
                <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <ShoppingBag className="mx-auto h-16 w-16 text-gray-400" />
                        <h2 className="mt-2 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">Keranjang Belanja Kosong</h2>
                        <p className="mt-4 text-gray-500">Anda belum menambahkan produk apapun ke keranjang belanja.</p>
                        <div className="mt-6">
                            <Button asChild className="bg-batik-indigo hover:bg-batik-indigo/90">
                                <Link href="/products">Lihat Produk</Link>
                            </Button>
                        </div>
                    </div>
                </div>
            );
        }

        return (
            <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
                {/* {isLoading && (
                    <div className="fixed inset-0 bg-black bg-opacity-20 flex items-center justify-center z-50">
                        <div className="bg-white p-4 rounded-md shadow-lg">
                            <p className="text-center">Memperbarui keranjang...</p>
                        </div>
                    </div>
                )} */}

                <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-3">
                    <div className="lg:col-span-2">
                        <h1 className="text-batik-brown mb-8 text-2xl font-bold tracking-tight">Keranjang Belanja</h1>

                        <div className="rounded-lg border shadow-sm">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[120px]">Produk</TableHead>
                                        <TableHead className="hidden sm:table-cell">Detail</TableHead>
                                        <TableHead className="w-[120px] text-right">Harga</TableHead>
                                        <TableHead className="w-[120px] text-right">Jumlah</TableHead>
                                        <TableHead className="w-[120px] text-right">Total</TableHead>
                                        <TableHead className="w-[70px]"></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {cartItems.map((item, index) => (
                                        <TableRow key={`${item.id}-${item.size || ''}-${index}`}>
                                            <TableCell>
                                                <Link href={`/products/${item.slug || item.id}`}>
                                                    <img
                                                        src={`/storage/${item.image}`}
                                                        alt={item.name}
                                                        className="h-24 w-24 rounded-md object-cover object-center"
                                                    />
                                                </Link>
                                            </TableCell>
                                            <TableCell className="hidden font-medium sm:table-cell">
                                                <div>
                                                    <Link
                                                        href={`/products/${item.slug || item.id}`}
                                                        className="hover:text-batik-indigo hover:underline"
                                                    >
                                                        {item.name}
                                                    </Link>
                                                </div>
                                                {item.size && <div className="mt-1 text-xs text-gray-500">Variasi: {item.size}</div>}
                                            </TableCell>
                                            <TableCell className="text-right">Rp {formatRupiah(item.price || 0)}</TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex items-center justify-end">
                                                    <Button
                                                        variant="outline"
                                                        size="icon"
                                                        className="h-8 w-8"
                                                        onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1), item.size)}
                                                    >
                                                        -
                                                    </Button>
                                                    <span className="w-10 text-center">{item.quantity}</span>
                                                    <Button
                                                        variant="outline"
                                                        size="icon"
                                                        className="h-8 w-8"
                                                        onClick={() => updateQuantity(item.id, item.quantity + 1, item.size)}
                                                    >
                                                        +
                                                    </Button>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right font-semibold">
                                                Rp {formatRupiah((item.price || 0) * item.quantity)}
                                            </TableCell>
                                            <TableCell>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => removeFromCart(item.id, item.size)}
                                                    className="text-red-500 hover:bg-red-50 hover:text-red-700"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>

                        <div className="mt-6 flex justify-end">
                            <Button variant="outline" onClick={clearCart} className="border-red-300 text-red-500 hover:bg-red-50">
                                Kosongkan Keranjang
                            </Button>
                        </div>
                    </div>

                    <div className="lg:col-span-1">
                        <div className="bg-card rounded-lg border p-6 shadow-sm">
                            <h2 className="mb-4 text-lg font-semibold">Ringkasan Pesanan</h2>

                            <div className="space-y-1.5">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Subtotal</span>
                                    <span>Rp {(totalPrice || 0).toLocaleString('id-ID')}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Pengiriman</span>
                                    <span>Dihitung saat checkout</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Diskon</span>
                                    <span>-</span>
                                </div>
                            </div>

                            <div className="my-4 border-t pt-4">
                                <div className="flex justify-between font-medium">
                                    <span>Total</span>
                                    <span>{formatRupiah(totalPrice || 0)}</span>
                                </div>
                                <p className="text-muted-foreground mt-1 text-xs">*Belum termasuk biaya pengiriman</p>
                            </div>

                            <Button
                                onClick={() => {
                                    router.visit('/checkout');
                                }}
                                className="bg-batik-indigo hover:bg-batik-indigo/90 mt-4 flex w-full items-center justify-center"
                                disabled={isLoading}
                            >
                                {isLoading ? 'Memproses...' : 'Lanjut ke Checkout'}
                                {!isLoading && <ArrowRight className="ml-2 h-4 w-4" />}
                            </Button>

                            <div className="mt-6">
                                <Button asChild variant="outline" className="w-full">
                                    <Link href="/products">Lanjut Belanja</Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    } catch (err) {
        console.error('Error in CartContent:', err);
        // Set error untuk trigger render empty cart
        setError(err as Error);
        return null;
    }
};

const Cart = () => {
    return (
        <Layout>
            <CartContent />
        </Layout>
    );
};

export default function CartWithBoundary() {
    return (
        <CartErrorBoundary>
            <Cart />
        </CartErrorBoundary>
    );
}
