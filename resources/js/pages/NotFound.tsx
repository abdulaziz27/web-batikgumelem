import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';
import { useEffect } from 'react';

const NotFound = () => {
    // You can't use useLocation from react-router here since you're using Inertia
    // Remove this or replace with Inertia's location handling
    useEffect(() => {
        console.error('404 Error: User attempted to access non-existent route:', window.location.pathname);
    }, []);

    return (
        <Layout>
            <div className="container mx-auto px-4 py-24 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-3xl text-center">
                    <h1 className="text-batik-indigo mb-4 text-4xl font-bold">404</h1>
                    <p className="mb-8 text-xl text-gray-600">Oops! Halaman yang Anda cari tidak ditemukan</p>
                    <div className="inline-flex items-center justify-center">
                        <Button asChild className="bg-batik-indigo hover:bg-batik-indigo/90">
                            <Link href="/">Kembali ke Beranda</Link>
                        </Button>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default NotFound;
