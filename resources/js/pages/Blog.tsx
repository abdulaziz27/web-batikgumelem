import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Pagination, PaginationContent, PaginationItem, PaginationLink } from '@/components/ui/pagination';
import { Link, useForm } from '@inertiajs/react';
import { Search } from 'lucide-react';
import { useEffect, useState } from 'react';

// Define the Blog interface
interface Blog {
    id: number;
    title: string;
    slug: string;
    excerpt: string;
    image: string;
    created_at: string;
    author: string;
    category: string;
}

// Define the props interface
interface BlogProps {
    blogs: {
        data: Blog[];
        links: any;
        current_page: number;
        last_page: number;
    };
    filters: {
        search?: string;
        category?: string;
    };
}

const Blog = ({ blogs, filters }: BlogProps) => {
    // Use the search filter from the backend if available
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [isMobile, setIsMobile] = useState(false);

    // Check if we're on a mobile device
    useEffect(() => {
        const checkIfMobile = () => {
            setIsMobile(window.innerWidth < 640);
        };

        checkIfMobile();
        window.addEventListener('resize', checkIfMobile);

        return () => {
            window.removeEventListener('resize', checkIfMobile);
        };
    }, []);

    // Use the Inertia form hook for searching
    const { data, setData, get, processing } = useForm({
        search: filters.search || '',
    });

    // Apply the search filter
    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        get('/blog', {
            preserveState: true,
            replace: true,
        });
    };

    // Update the form data when the search term changes
    useEffect(() => {
        setData('search', searchTerm);
    }, [searchTerm]);

    return (
        <Layout>
            <div className="bg-batik-cream/30 batik-pattern py-10">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h1 className="text-batik-brown text-3xl font-bold tracking-tight sm:text-4xl">
                            Blog Batik <span className="text-batik-indigo">Gumelem</span>
                        </h1>
                        <p className="mx-auto mt-4 max-w-xl text-base text-gray-600">
                            Temukan artikel menarik tentang sejarah, teknik pembuatan, dan filosofi batik Gumelem
                        </p>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
                {/* Search */}
                <form onSubmit={handleSearch} className="mx-auto mb-8 max-w-md">
                    <div className="relative">
                        <Search className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-500" />
                        <Input
                            placeholder="Cari artikel..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="py-6 pl-10"
                        />
                    </div>
                </form>

                {/* Blog posts */}
                {blogs.data.length > 0 ? (
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {blogs.data.map((post) => (
                            <Link key={post.id} href={`/blog/${post.slug}`} className="group product-card hover-lift animate-fade-in overflow-hidden">
                                <div className="aspect-video overflow-hidden">
                                    <img
                                        src={post.image}
                                        alt={post.title}
                                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                    />
                                </div>
                                <div className="p-4">
                                    <div className="mb-2 flex items-center justify-between">
                                        <span className="text-batik-indigo bg-batik-indigo/10 rounded-full px-3 py-1 text-xs font-medium">
                                            {post.category}
                                        </span>
                                        <span className="text-sm text-gray-500">{new Date(post.created_at).toLocaleDateString('id-ID')}</span>
                                    </div>
                                    <h3 className="text-batik-brown group-hover:text-batik-indigo text-lg font-semibold transition-colors duration-300">
                                        {post.title}
                                    </h3>
                                    <p className="mt-2 line-clamp-2 text-sm text-gray-600">{post.excerpt}</p>
                                    <div className="mt-3 text-xs text-gray-700">Oleh {post.author}</div>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="py-12 text-center">
                        <p className="text-lg text-gray-600">Tidak ada artikel yang sesuai dengan pencarian Anda.</p>
                        <Button
                            className="bg-batik-brown hover:bg-batik-brown/90 mt-4"
                            onClick={() => {
                                setSearchTerm('');
                                setData('search', '');
                                get('/blog');
                            }}
                        >
                            Lihat Semua Artikel
                        </Button>
                    </div>
                )}

                {/* Pagination */}
                {blogs.last_page > 1 && (
                    <Pagination className="mt-10">
                        <PaginationContent>
                            {Array.from({ length: blogs.last_page }).map((_, i) => (
                                <PaginationItem key={i}>
                                    <PaginationLink
                                        href={`/blog?page=${i + 1}${searchTerm ? `&search=${searchTerm}` : ''}`}
                                        isActive={blogs.current_page === i + 1}
                                        size="icon"
                                    >
                                        {i + 1}
                                    </PaginationLink>
                                </PaginationItem>
                            ))}
                        </PaginationContent>
                    </Pagination>
                )}
            </div>
        </Layout>
    );
};

export default Blog;
