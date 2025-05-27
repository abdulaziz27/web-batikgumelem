import { Link } from '@inertiajs/react';
import { Mail, MapPin, Phone } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-batik-cream/50 batik-pattern">
            <div className="container mx-auto px-6 py-12">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
                    {/* BatikGumelem Section */}
                    <div>
                        <h2 className="text-batik-brown font-serif text-2xl font-bold">
                            Batik<span className="text-batik-indigo">Gumelem</span>
                        </h2>
                        <p className="mt-4 text-sm text-gray-600">
                            Melestarikan warisan budaya Batik Gumelem dari Banjarnegara, Jawa Tengah. Setiap kain batik kami dibuat dengan teknik
                            tradisional dan mengandung filosofi mendalam.
                        </p>
                    </div>

                    {/* Quick Links Section */}
                    <div>
                        <h3 className="text-batik-brown text-sm font-semibold tracking-wider uppercase">Quick Links</h3>
                        <div className="mt-4 space-y-2">
                            <Link href="/" className="hover:text-batik-indigo block text-sm text-gray-600">
                                Beranda
                            </Link>
                            <Link href="/history" className="hover:text-batik-indigo block text-sm text-gray-600">
                                Sejarah
                            </Link>
                            <Link href="/products" className="hover:text-batik-indigo block text-sm text-gray-600">
                                Produk
                            </Link>
                            <Link href="/blog" className="hover:text-batik-indigo block text-sm text-gray-600">
                                Blog
                            </Link>
                            <Link href="/faq" className="hover:text-batik-indigo block text-sm text-gray-600">
                                FAQ
                            </Link>
                            <Link href="/about" className="hover:text-batik-indigo block text-sm text-gray-600">
                                Tentang Kami
                            </Link>
                        </div>
                    </div>

                    {/* Customer Service Section */}
                    <div>
                        <h3 className="text-batik-brown text-sm font-semibold tracking-wider uppercase">Customer Service</h3>
                        <div className="mt-4 space-y-2">
                            <Link href="/faq" className="hover:text-batik-indigo block text-sm text-gray-600">
                                FAQ
                            </Link>
                            <Link href="/shipping" className="hover:text-batik-indigo block text-sm text-gray-600">
                                Shipping & Returns
                            </Link>
                            <Link href="/terms" className="hover:text-batik-indigo block text-sm text-gray-600">
                                Terms & Conditions
                            </Link>
                            <Link href="/privacy" className="hover:text-batik-indigo block text-sm text-gray-600">
                                Privacy Policy
                            </Link>
                        </div>
                    </div>

                    {/* Contact Us Section */}
                    <div>
                        <h3 className="text-batik-brown text-sm font-semibold tracking-wider uppercase">Contact Us</h3>
                        <div className="mt-4 space-y-4">
                            <div className="flex items-start">
                                <div className="flex-shrink-0">
                                    <MapPin className="text-batik-indigo mr-3 h-5 w-5" />
                                </div>
                                <p className="text-sm text-gray-600">Desa Gumelem Kulon, Kecamatan Susukan, Kabupaten Banjarnegara, Jawa Tengah</p>
                            </div>
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <Phone className="text-batik-indigo mr-3 h-5 w-5" />
                                </div>
                                <p className="text-sm text-gray-600">+62 852 1155 3430</p>
                            </div>
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <Mail className="text-batik-indigo mr-3 h-5 w-5" />
                                </div>
                                <p className="text-sm text-gray-600">info@batikgumelem.com</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="border-batik-brown/10 mt-8 border-t pt-8">
                    <p className="text-center text-xs text-gray-500">&copy; {new Date().getFullYear()} BatikGumelem. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
