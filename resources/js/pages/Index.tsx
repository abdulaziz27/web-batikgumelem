// resources/js/Pages/Index.tsx
import Layout from '@/components/layout/Layout';
import ProductCard from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import WhyBuySection from '@/components/WhyBuySection';
import { Link, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle } from 'lucide-react';

// Define types for our props from backend
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
    price: number;
    image: string;
    description: string;
    sizes?: ProductSize[];
}

interface Blog {
    id: number;
    title: string;
    excerpt: string;
    image: string;
    created_at: string; // Format date on backend or frontend as needed
    category: string;
    slug: string;
}

interface PageProps {
    featuredProducts: Product[];
    latestBlogs: Blog[];
}

const features = [
    'Dibuat dengan metode tradisional tulis dan cap',
    'Menggunakan pewarna alami dari tumbuhan',
    'Motif yang kaya akan filosofi dan sejarah',
    'Hasil karya pengrajin yang berpengalaman',
    'Bahan berkualitas tinggi untuk kenyamanan pemakai',
];

const testimonials = [
    {
        name: 'Abdul Aziz',
        location: 'Bogor',
        quote: 'Kualitas batik yang sangat bagus dengan motif yang detil. Saya sangat puas dengan pembelian saya.',
        image: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?q=80&w=2070',
    },
    {
        name: 'Budi Santoso',
        location: 'Surabaya',
        quote: 'Batik Gumelem memiliki keunikan tersendiri. Warnanya yang natural dan motifnya sangat khas.',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1887',
    },
    {
        name: 'Siti Rahayu',
        location: 'Bandung',
        quote: 'Pengiriman cepat dan produk sesuai dengan yang di foto. Akan belanja lagi disini.',
        image: 'https://images.unsplash.com/photo-1499887142886-791eca5918cd?q=80&w=2080',
    },
];

const Index = () => {
    // Get data from Inertia props
    const { featuredProducts, latestBlogs } = usePage().props as unknown as PageProps;

    // Format date for blog posts
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
    };

    return (
        <Layout>
            {/* Hero Section */}
            <section className="bg-batik-cream/30 batik-pattern relative">
                <div className="container mx-auto px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
                    <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
                        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                            <h1 className="text-batik-brown text-4xl leading-tight font-bold tracking-tight sm:text-5xl md:text-6xl">
                                Keindahan Batik <span className="text-batik-brown">Gumelem</span> Dari Banjarnegara
                            </h1>
                            <p className="mt-6 max-w-md text-lg text-gray-600">
                                Temukan keindahan batik tradisional Gumelem dengan motif dan filosofi mendalam yang telah diwariskan dari generasi ke
                                generasi.
                            </p>
                            <div className="mt-8 flex flex-wrap gap-x-4 gap-y-4">
                                <Button asChild className="bg-batik-brown hover:bg-batik-brown/90 hover-lift">
                                    <Link href="/products">Lihat Produk</Link>
                                </Button>
                                <Button asChild variant="outline" className="border-batik-brown text-batik-brown hover:bg-batik-brown/10 hover-lift">
                                    <Link href="/history">Tentang Batik Gumelem</Link>
                                </Button>
                            </div>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="relative"
                        >
                            <div className="hero-image-shadow aspect-[5/4] overflow-hidden rounded-2xl">
                                <img src="/images/dashboard_banner_image.png" alt="Batik Gumelem" className="h-full w-full object-cover" />
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Featured Products */}
            <section className="py-16 sm:py-24">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h2 className="text-batik-brown text-3xl font-bold tracking-tight sm:text-4xl">Produk Unggulan</h2>
                        <p className="mx-auto mt-4 max-w-2xl text-gray-600">
                            Karya terbaik dari pengrajin batik Gumelem dengan kualitas premium dan motif yang khas.
                        </p>
                    </div>

                    <div className="mt-12 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
                        {featuredProducts.map((product, index) => (
                            <motion.div
                                key={product.id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                viewport={{ once: true }}
                            >
                                <ProductCard product={product} />
                            </motion.div>
                        ))}
                    </div>

                    <div className="mt-12 text-center">
                        <Button asChild variant="outline" className="border-batik-brown text-batik-brown hover:bg-batik-brown/10 hover-lift">
                            <Link href="/products" className="flex items-center">
                                Lihat Semua Produk
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                    </div>
                </div>
            </section>

            {/* Why Buy Section */}
            <WhyBuySection />

            {/* About Batik Section */}
            <section className="bg-batik-cream/50 batik-pattern py-16 sm:py-24">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            viewport={{ once: true }}
                            className="relative"
                        >
                            <div className="hero-image-shadow aspect-[1/1] overflow-hidden rounded-2xl">
                                <img
                                    src="/images/dashboard_banner_image_3.png"
                                    alt="Proses pembuatan batik Gumelem"
                                    className="h-full w-full object-cover"
                                />
                            </div>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="text-batik-brown text-3xl font-bold tracking-tight sm:text-4xl">Warisan Budaya yang Berharga</h2>
                            <p className="mt-4 text-lg text-gray-600">
                                Batik Gumelem adalah warisan budaya dari Desa Gumelem, Banjarnegara, Jawa Tengah yang telah ada sejak zaman Kerajaan
                                Mataram.
                            </p>
                            <p className="mt-4 text-lg text-gray-600">
                                Keunikan Batik Gumelem terletak pada motif yang terinspirasi dari lingkungan alam sekitar dan filosofi kehidupan
                                masyarakat setempat.
                            </p>
                            <div className="mt-8">
                                <ul className="space-y-4">
                                    {features.map((feature, index) => (
                                        <motion.li
                                            key={index}
                                            className="flex items-start"
                                            initial={{ opacity: 0, x: 20 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            transition={{ duration: 0.5, delay: index * 0.1 }}
                                            viewport={{ once: true }}
                                        >
                                            <div className="flex-shrink-0">
                                                <CheckCircle className="text-batik-brown h-6 w-6" />
                                            </div>
                                            <p className="ml-3 text-base text-gray-600">{feature}</p>
                                        </motion.li>
                                    ))}
                                </ul>
                            </div>
                            <div className="mt-8">
                                <Button asChild className="bg-batik-brown hover:bg-batik-brown/90 hover-lift">
                                    <Link href="/history">Pelajari Lebih Lanjut</Link>
                                </Button>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Blog Section */}
            <section className="py-16 sm:py-24">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h2 className="text-batik-brown text-3xl font-bold tracking-tight sm:text-4xl">Artikel Terbaru</h2>
                        <p className="mx-auto mt-4 max-w-2xl text-gray-600">
                            Jelajahi artikel menarik tentang batik Gumelem, teknik pembuatan, dan filosofi di baliknya
                        </p>
                    </div>

                    <div className="mt-12 grid grid-cols-1 gap-x-6 gap-y-8 md:grid-cols-2 lg:grid-cols-3">
                        {latestBlogs.map((blog, index) => (
                            <motion.div
                                key={blog.id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                viewport={{ once: true }}
                            >
                                <Link href={`/blog/${blog.slug}`} className="group hover-lift block">
                                    <div className="aspect-video overflow-hidden rounded-t-xl">
                                        <img
                                            src={blog.image}
                                            alt={blog.title}
                                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                        />
                                    </div>
                                    <div className="rounded-b-xl bg-white p-6 shadow-sm">
                                        <div className="mb-3 flex items-center justify-between">
                                            <span className="text-batik-indigo bg-batik-indigo/10 rounded-full px-3 py-1 text-xs font-medium">
                                                {blog.category}
                                            </span>
                                            <span className="text-sm text-gray-500">{formatDate(blog.created_at)}</span>
                                        </div>
                                        <h3 className="text-batik-brown group-hover:text-batik-indigo font-semibold transition-colors duration-300">
                                            {blog.title}
                                        </h3>
                                        <p className="mt-2 line-clamp-2 text-sm text-gray-600">{blog.excerpt}</p>
                                        <div className="text-batik-indigo mt-4 flex items-center text-sm font-medium">
                                            Baca selengkapnya
                                            <ArrowRight className="ml-1 h-4 w-4" />
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>

                    <div className="mt-12 text-center">
                        <Button asChild variant="outline" className="border-batik-brown text-batik-brown hover:bg-batik-brown/10 hover-lift">
                            <Link href="/blog" className="flex items-center">
                                Lihat Semua Artikel
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            {/* <section className="bg-batik-cream/30 batik-pattern py-16 sm:py-24">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h2 className="text-batik-brown text-3xl font-bold tracking-tight sm:text-4xl">Apa Kata Mereka</h2>
                        <p className="mx-auto mt-4 max-w-2xl text-gray-600">Pendapat pelanggan kami tentang produk Batik Gumelem</p>
                    </div>
                    <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {testimonials.map((testimonial, index) => (
                            <motion.div
                                key={index}
                                className="hover-lift rounded-xl bg-white p-6 shadow-md"
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                viewport={{ once: true }}
                            >
                                <div className="flex items-center">
                                    <img className="h-12 w-12 rounded-full object-cover" src={testimonial.image} alt={testimonial.name} />
                                    <div className="ml-4">
                                        <h4 className="text-batik-brown text-lg font-medium">{testimonial.name}</h4>
                                        <p className="text-sm text-gray-500">{testimonial.location}</p>
                                    </div>
                                </div>
                                <p className="mt-4 text-gray-600 italic">"{testimonial.quote}"</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section> */}

            {/* CTA */}
            <section className="bg-batik-brown py-16">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="lg:flex lg:items-center lg:justify-between">
                        <motion.h2
                            className="text-3xl font-bold tracking-tight text-white sm:text-4xl"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            viewport={{ once: true }}
                        >
                            <span className="block">Siap untuk memiliki Batik Gumelem?</span>
                            <span className="text-batik-cream block">Jelajahi koleksi eksklusif kami sekarang.</span>
                        </motion.h2>
                        <motion.div
                            className="mt-8 flex lg:mt-0 lg:flex-shrink-0"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            viewport={{ once: true }}
                        >
                            <div className="inline-flex rounded-md shadow">
                                <Button asChild className="text-batik-brown hover-lift bg-white hover:bg-gray-100">
                                    <Link href="/products">Belanja Sekarang</Link>
                                </Button>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>
        </Layout>
    );
};

export default Index;
