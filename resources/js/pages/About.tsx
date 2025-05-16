import Layout from '@/components/layout/Layout';
import { Clock, Mail, MapPin, Phone } from 'lucide-react';

// Mock data for team members
const teamMembers = [
    {
        name: 'Siti Rohana',
        role: 'Pendiri & Pengrajin Senior',
        image: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?q=80&w=1887',
        bio: 'Memiliki pengalaman lebih dari 30 tahun dalam pembuatan batik Gumelem dan menjadi pelopor komunitas Batik Amorista.',
    },
    {
        name: 'Bambang Wibowo',
        role: 'Koordinator Produksi',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1887',
        bio: 'Spesialis teknik pewarnaan alami dan pengembangan motif batik kontemporer berbasis motif tradisional.',
    },
    {
        name: 'Ratna Dewi',
        role: 'Desainer Motif',
        image: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?q=80&w=2070',
        bio: 'Lulusan seni rupa yang fokus pada pengembangan motif batik yang menggabungkan unsur tradisional dan modern.',
    },
    {
        name: 'Hendra Kusuma',
        role: 'Manajer Pemasaran',
        image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1887',
        bio: 'Bertanggung jawab dalam pemasaran produk batik Gumelem ke pasar nasional dan internasional.',
    },
];

const About = () => {
    return (
        <Layout>
            <div className="bg-batik-cream/30 batik-pattern py-10">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h1 className="text-batik-brown text-3xl font-bold tracking-tight sm:text-4xl">Tentang Kami</h1>
                        <p className="mx-auto mt-4 max-w-xl text-base text-gray-600">
                            Mengenal lebih dekat Komunitas Batik Amorista dan perjalanan kami melestarikan warisan budaya batik Gumelem
                        </p>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
                {/* Our Story */}
                <div className="mb-20">
                    <div className="mx-auto max-w-4xl text-center">
                        <h2 className="text-batik-brown mb-6 text-3xl font-bold">Perjalanan Kami</h2>
                        <p className="mb-8 text-lg text-gray-600">
                            Komunitas Batik Amorista didirikan pada tahun 2010 oleh sekelompok pengrajin batik Gumelem yang memiliki visi untuk
                            melestarikan dan mengembangkan batik tradisional Gumelem. Nama "Amorista" diambil dari kata "Amor" yang berarti cinta dan
                            "Ista" yang berarti keinginan, mencerminkan kecintaan dan dedikasi kami terhadap seni batik.
                        </p>
                    </div>

                    <div className="mt-12 grid grid-cols-1 items-center gap-12 md:grid-cols-2">
                        <div className="animate-fade-in">
                            <img src="images/dashboard_banner_image_4.png" alt="Proses pembuatan batik" className="rounded-xl shadow-lg" />
                        </div>
                        <div className="animate-fade-in" style={{ animationDelay: '200ms' }}>
                            <h3 className="text-batik-indigo mb-4 text-2xl font-bold">Misi Kami</h3>
                            <p className="mb-6 text-gray-600">
                                Misi kami adalah melestarikan warisan budaya batik Gumelem dengan tetap membuka diri pada inovasi dan perkembangan
                                zaman. Kami berkomitmen untuk:
                            </p>
                            <ul className="space-y-3">
                                <li className="flex items-start">
                                    <div className="bg-batik-brown flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full font-bold text-white">
                                        1
                                    </div>
                                    <span className="ml-3 text-gray-600">Menjaga keaslian teknik dan motif tradisional batik Gumelem</span>
                                </li>
                                <li className="flex items-start">
                                    <div className="bg-batik-brown flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full font-bold text-white">
                                        2
                                    </div>
                                    <span className="ml-3 text-gray-600">
                                        Memberdayakan pengrajin lokal dengan memberikan pelatihan dan lapangan kerja
                                    </span>
                                </li>
                                <li className="flex items-start">
                                    <div className="bg-batik-brown flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full font-bold text-white">
                                        3
                                    </div>
                                    <span className="ml-3 text-gray-600">
                                        Mengembangkan motif-motif baru yang tetap menghormati nilai-nilai filosofis batik Gumelem
                                    </span>
                                </li>
                                <li className="flex items-start">
                                    <div className="bg-batik-brown flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full font-bold text-white">
                                        4
                                    </div>
                                    <span className="ml-3 text-gray-600">Memperkenalkan batik Gumelem ke pasar nasional dan internasional</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Workshop Gallery */}
                <div className="mb-20">
                    <div className="mb-12 text-center">
                        <h2 className="text-batik-brown mb-4 text-3xl font-bold">Workshop Kami</h2>
                        <p className="mx-auto max-w-3xl text-lg text-gray-600">
                            Sekilas foto workshop tempat kami membuat batik Gumelem dengan teknik tradisional.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                        <div className="grid gap-4">
                            <div className="animate-fade-in overflow-hidden rounded-lg">
                                <img
                                    className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                                    src="images/product_image_1.png"
                                    alt="Workshop"
                                />
                            </div>
                            <div className="animate-fade-in overflow-hidden rounded-lg" style={{ animationDelay: '100ms' }}>
                                <img
                                    className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                                    src="images/product_image_2.png"
                                    alt="Batik process"
                                />
                            </div>
                        </div>
                        <div className="grid gap-4">
                            <div className="animate-fade-in overflow-hidden rounded-lg" style={{ animationDelay: '200ms' }}>
                                <img
                                    className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                                    src="images/product_image_3.png"
                                    alt="Batik drying"
                                />
                            </div>
                            <div className="animate-fade-in overflow-hidden rounded-lg" style={{ animationDelay: '300ms' }}>
                                <img
                                    className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                                    src="images/product_image_4.png"
                                    alt="Batik coloring"
                                />
                            </div>
                        </div>
                        <div className="grid gap-4">
                            <div className="animate-fade-in overflow-hidden rounded-lg" style={{ animationDelay: '400ms' }}>
                                <img
                                    className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                                    src="images/product_image_1.png"
                                    alt="Batik design"
                                />
                            </div>
                            <div className="animate-fade-in overflow-hidden rounded-lg" style={{ animationDelay: '500ms' }}>
                                <img
                                    className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                                    src="images/product_image_2.png"
                                    alt="Batik patterns"
                                />
                            </div>
                        </div>
                        <div className="grid gap-4">
                            <div className="animate-fade-in overflow-hidden rounded-lg" style={{ animationDelay: '600ms' }}>
                                <img
                                    className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                                    src="images/dashboard_banner_image_2.png"
                                    alt="Finished batik"
                                />
                            </div>
                            <div className="animate-fade-in overflow-hidden rounded-lg" style={{ animationDelay: '700ms' }}>
                                <img
                                    className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                                    src="images/dashboard_banner_image_3.png"
                                    alt="Workshop area"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Location and Contact */}
                <div>
                    <div className="mb-12 text-center">
                        <h2 className="text-batik-brown mb-4 text-3xl font-bold">Lokasi & Kontak</h2>
                        <p className="mx-auto max-w-3xl text-lg text-gray-600">
                            Kami mengundang Anda untuk mengunjungi workshop batik kami dan menyaksikan langsung proses pembuatan batik Gumelem.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
                        <div className="animate-fade-in overflow-hidden rounded-xl bg-white shadow-sm">
                            <iframe
                                title="Google Maps Location"
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d31642.288870029946!2d109.63935393798298!3d-7.412517588335306!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e7aa0b9bc1e3f97%3A0xd781175c07507599!2sGumelem%20Wetan%2C%20Kec.%20Susukan%2C%20Kabupaten%20Banjarnegara%2C%20Jawa%20Tengah!5e0!3m2!1sid!2sid!4v1714667824781!5m2!1sid!2sid"
                                width="100%"
                                height="450"
                                style={{ border: 0 }}
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                            ></iframe>
                        </div>

                        <div className="animate-fade-in" style={{ animationDelay: '200ms' }}>
                            <div className="h-full rounded-xl bg-white p-8 shadow-sm">
                                <h3 className="text-batik-brown mb-6 text-2xl font-bold">Informasi Kontak</h3>

                                <div className="space-y-6">
                                    <div className="flex">
                                        <div className="flex-shrink-0">
                                            <div className="bg-batik-cream flex h-12 w-12 items-center justify-center rounded-full">
                                                <MapPin className="text-batik-brown h-6 w-6" />
                                            </div>
                                        </div>
                                        <div className="ml-4">
                                            <h4 className="text-batik-indigo text-lg font-semibold">Alamat</h4>
                                            <p className="mt-1 text-gray-600">
                                                Desa Gumelem Kulon, Kecamatan Susukan
                                                <br />
                                                Kabupaten Banjarnegara, Jawa Tengah
                                                <br />
                                                Indonesia 53475
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex">
                                        <div className="flex-shrink-0">
                                            <div className="bg-batik-cream flex h-12 w-12 items-center justify-center rounded-full">
                                                <Phone className="text-batik-brown h-6 w-6" />
                                            </div>
                                        </div>
                                        <div className="ml-4">
                                            <h4 className="text-batik-indigo text-lg font-semibold">Telepon</h4>
                                            <p className="mt-1 text-gray-600">
                                                +62 852 1155 3430
                                                <br />
                                                +62 876 5432 1098
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex">
                                        <div className="flex-shrink-0">
                                            <div className="bg-batik-cream flex h-12 w-12 items-center justify-center rounded-full">
                                                <Mail className="text-batik-brown h-6 w-6" />
                                            </div>
                                        </div>
                                        <div className="ml-4">
                                            <h4 className="text-batik-indigo text-lg font-semibold">Email</h4>
                                            <p className="mt-1 text-gray-600">
                                                info@batikgumelem.com
                                                <br />
                                                batikgumelem13@gmail.com
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex">
                                        <div className="flex-shrink-0">
                                            <div className="bg-batik-cream flex h-12 w-12 items-center justify-center rounded-full">
                                                <Clock className="text-batik-brown h-6 w-6" />
                                            </div>
                                        </div>
                                        <div className="ml-4">
                                            <h4 className="text-batik-indigo text-lg font-semibold">Jam Operasional</h4>
                                            <p className="mt-1 text-gray-600">
                                                Senin - Jumat: 09.00 - 17.00 WIB
                                                <br />
                                                Sabtu: 09.00 - 15.00 WIB
                                                <br />
                                                Minggu: Tutup
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-8 border-t border-gray-200 pt-6">
                                    <h4 className="text-batik-brown mb-3 font-medium">Media Sosial</h4>
                                    <div className="flex space-x-4">
                                        <a href="#" className="hover:text-batik-indigo text-gray-600 transition-colors">
                                            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                                <path
                                                    fillRule="evenodd"
                                                    d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                                                    clipRule="evenodd"
                                                ></path>
                                            </svg>
                                        </a>
                                        <a href="#" className="hover:text-batik-indigo text-gray-600 transition-colors">
                                            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                                <path
                                                    fillRule="evenodd"
                                                    d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                                                    clipRule="evenodd"
                                                ></path>
                                            </svg>
                                        </a>
                                        <a href="#" className="hover:text-batik-indigo text-gray-600 transition-colors">
                                            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                                            </svg>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default About;
