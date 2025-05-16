import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useInitials } from '@/hooks/use-initials';
import { useCart } from '@/hooks/useCart';
import { type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { Menu, ShoppingCart, User, X } from 'lucide-react';
import { useState } from 'react';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { url } = usePage(); // Inertia way to get current URL
    const { cartItems } = useCart();
    const { auth } = usePage<SharedData>().props;
    const getInitials = useInitials();

    const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

    const navigation = [
        { name: 'Beranda', href: '/' },
        { name: 'Sejarah', href: '/history' },
        { name: 'Produk', href: '/products' },
        { name: 'Blog', href: '/blog' },
        { name: 'FAQ', href: '/faq' },
        { name: 'Tentang Kami', href: '/about' },
    ];

    const isActive = (path: string) => {
        return url === path;
    };

    return (
        <header className="bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full backdrop-blur">
            <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex h-20 items-center justify-between">
                    <div className="flex items-center">
                        <Link href="/" className="flex-shrink-0">
                            <h1 className="text-batik-brown font-serif text-2xl font-bold">
                                Batik<span className="text-batik-indigo">Gumelem</span>
                            </h1>
                        </Link>
                        <div className="hidden md:ml-10 md:block">
                            <div className="flex space-x-8">
                                {navigation.map((item) => (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className={`${
                                            isActive(item.href) ? 'text-batik-indigo font-semibold' : 'text-batik-brown hover:text-batik-indigo'
                                        } px-3 py-2 text-sm font-medium transition-colors`}
                                    >
                                        {item.name}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center">
                        {auth.user ? (
                            // <div className="flex items-center gap-4">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm" className="mr-4 hidden items-center md:flex">
                                        <Avatar className="h-8 w-8">
                                            <AvatarImage src={auth.user.avatar} alt={auth.user.name} />
                                            <AvatarFallback className="bg-batik-indigo text-white">{getInitials(auth.user.name)}</AvatarFallback>
                                        </Avatar>
                                        <span className="text-sm font-medium">{auth.user.name}</span>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-56" align="end" forceMount>
                                    <DropdownMenuLabel className="font-normal">
                                        <div className="flex flex-col space-y-1">
                                            <p className="text-sm leading-none font-medium">{auth.user?.name}</p>
                                            <p className="text-muted-foreground text-xs leading-none">{auth.user?.email}</p>
                                            <div className="mt-1.5 flex gap-1.5">
                                                {auth.user?.roles?.includes('admin') && (
                                                    <Badge variant="outline" className="border-red-200 bg-red-50 text-red-700">
                                                        Admin
                                                    </Badge>
                                                )}
                                                {auth.user?.roles?.includes('user') && (
                                                    <Badge variant="outline" className="border-blue-200 bg-blue-50 text-blue-700">
                                                        User
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuGroup>
                                        <DropdownMenuItem asChild>
                                            <Link href="settings/profile" className="flex w-full cursor-pointer items-center">
                                                <User className="mr-2 h-4 w-4" />
                                                <span>Profile</span>
                                            </Link>
                                        </DropdownMenuItem>
                                        {auth.user?.roles?.includes('admin') ? (
                                            <DropdownMenuItem asChild>
                                                <Link href="/admin/dashboard" className="flex w-full cursor-pointer items-center">
                                                    <ShoppingCart className="mr-2 h-4 w-4" />
                                                    <span>Dashboard Admin</span>
                                                </Link>
                                            </DropdownMenuItem>
                                        ) : (
                                            <DropdownMenuItem asChild>
                                                <Link href="/orders" className="flex w-full cursor-pointer items-center">
                                                    <ShoppingCart className="mr-2 h-4 w-4" />
                                                    <span>Pesanan Saya</span>
                                                </Link>
                                            </DropdownMenuItem>
                                        )}
                                    </DropdownMenuGroup>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem asChild>
                                        <Link
                                            href="/logout"
                                            method="post"
                                            as="button"
                                            className="flex w-full cursor-pointer items-center text-red-600 hover:text-red-700 focus:text-red-700"
                                        >
                                            <X className="mr-2 h-4 w-4" />
                                            <span>Keluar</span>
                                        </Link>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            // </div>
                            <Link href="/login" className="mr-4 hidden md:block">
                                <Button variant="ghost" size="sm" className="flex items-center">
                                    <User className="mr-2 h-4 w-4" />
                                    Masuk
                                </Button>
                            </Link>
                        )}
                        <Link href="/cart" className="relative mr-4">
                            <Button variant="ghost" size="icon">
                                <ShoppingCart className="h-5 w-5" />
                            </Button>
                            {cartItemCount > 0 && <Badge className="bg-batik-indigo absolute -top-1 -right-1 text-white">{cartItemCount}</Badge>}
                        </Link>
                        <div className="-mr-2 flex md:hidden">
                            <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                                <span className="sr-only">Open main menu</span>
                                {isMenuOpen ? (
                                    <X className="block h-6 w-6" aria-hidden="true" />
                                ) : (
                                    <Menu className="block h-6 w-6" aria-hidden="true" />
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Mobile menu, show/hide based on menu state. */}
            {isMenuOpen && (
                <div className="md:hidden">
                    <div className="space-y-1 px-2 pt-2 pb-3 sm:px-3">
                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`${
                                    isActive(item.href)
                                        ? 'bg-batik-cream text-batik-indigo'
                                        : 'text-batik-brown hover:bg-batik-cream hover:text-batik-indigo'
                                } block rounded-md px-3 py-2 text-base font-medium`}
                                onClick={() => setIsMenuOpen(false)}
                            >
                                {item.name}
                            </Link>
                        ))}
                        {auth.user ? (
                            <>
                                <Link
                                    href="/profile"
                                    className="text-batik-brown hover:bg-batik-cream hover:text-batik-indigo block rounded-md px-3 py-2 text-base font-medium"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Profil
                                </Link>
                                <Link
                                    href="/orders"
                                    className="text-batik-brown hover:bg-batik-cream hover:text-batik-indigo block rounded-md px-3 py-2 text-base font-medium"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Pesanan Saya
                                </Link>
                                <Link
                                    href={route('logout')}
                                    method="post"
                                    as="button"
                                    className="block w-full rounded-md px-3 py-2 text-left text-base font-medium text-red-600 hover:bg-red-50"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Keluar
                                </Link>
                            </>
                        ) : (
                            <Link
                                href="/login"
                                className="text-batik-brown hover:bg-batik-cream hover:text-batik-indigo block rounded-md px-3 py-2 text-base font-medium"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Masuk / Daftar
                            </Link>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
};

export default Navbar;
