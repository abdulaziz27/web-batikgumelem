import Layout from '@/components/layout/Layout';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Link, usePage } from '@inertiajs/react';
import { Calendar, Tag, User } from 'lucide-react';

// Define the Blog interface
interface Blog {
    id: number;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    image: string;
    created_at: string;
    author: string;
    category: string;
}

// Define the props interface
interface BlogDetailProps {
    blog: Blog;
    relatedBlogs: Blog[];
}

const BlogDetail = () => {
    // Get the blog and related blogs from the page props
    const { blog, relatedBlogs } = usePage().props as unknown as BlogDetailProps;

    return (
        <Layout>
            <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
                {/* Breadcrumbs navigation */}
                <Breadcrumb className="mb-8">
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/">Beranda</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/blog">Blog</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>{blog.title}</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>

                {/* Article header */}
                <article className="mx-auto max-w-4xl">
                    <div className="mb-8 text-center">
                        <h1 className="text-batik-brown animate-fade-in mb-4 text-3xl font-bold md:text-4xl">{blog.title}</h1>

                        <div
                            className="animate-fade-in flex flex-wrap items-center justify-center gap-4 text-sm text-gray-600"
                            style={{ animationDelay: '100ms' }}
                        >
                            <div className="flex items-center">
                                <Calendar className="mr-1 h-4 w-4" />
                                <span>{new Date(blog.created_at).toLocaleDateString('id-ID')}</span>
                            </div>
                            <div className="flex items-center">
                                <User className="mr-1 h-4 w-4" />
                                <span>{blog.author}</span>
                            </div>
                            <div className="flex items-center">
                                <Tag className="mr-1 h-4 w-4" />
                                <span>{blog.category}</span>
                            </div>
                        </div>
                    </div>

                    {/* Featured image */}
                    <div className="animate-fade-in mb-10 overflow-hidden rounded-xl" style={{ animationDelay: '200ms' }}>
                        <div className="aspect-[16/9] max-h-[600px] overflow-hidden">
                            <img 
                                src={blog.image} 
                                alt={blog.title} 
                                className="h-full w-full object-cover" 
                            />
                        </div>
                    </div>

                    {/* Article content */}
                    <div
                        className="prose prose-lg animate-fade-in max-w-none text-gray-700"
                        style={{ animationDelay: '300ms' }}
                        dangerouslySetInnerHTML={{ __html: blog.content }}
                    />

                    {/* Related posts */}
                    {relatedBlogs.length > 0 && (
                        <div className="animate-fade-in mt-16 border-t border-gray-200 pt-8" style={{ animationDelay: '400ms' }}>
                            <h2 className="text-batik-brown mb-6 text-2xl font-bold">Artikel Terkait</h2>
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                                {relatedBlogs.map((related) => (
                                    <Link key={related.id} href={`/blog/${related.slug}`} className="group product-card hover-lift animate-fade-in overflow-hidden">
                                        <div className="aspect-video overflow-hidden">
                                            <img
                                                src={related.image}
                                                alt={related.title}
                                                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                            />
                                        </div>
                                        <div className="p-4">
                                            <div className="mb-2 flex items-center justify-between">
                                                <span className="text-batik-indigo bg-batik-indigo/10 rounded-full px-3 py-1 text-xs font-medium">
                                                    {related.category}
                                                </span>
                                                <span className="text-sm text-gray-500">
                                                    {new Date(related.created_at).toLocaleDateString('id-ID')}
                                                </span>
                                            </div>
                                            <h3 className="text-batik-brown group-hover:text-batik-indigo text-lg font-semibold transition-colors duration-300">
                                                {related.title}
                                            </h3>
                                            <p className="mt-2 line-clamp-2 text-sm text-gray-600">{related.excerpt}</p>
                                            <div className="mt-3 text-xs text-gray-700">Oleh {related.author}</div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                </article>
            </div>
        </Layout>
    );
};

export default BlogDetail;
