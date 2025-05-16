import { Award, CircleDollarSign, HeartHandshake, Leaf, ShieldCheck, Truck } from 'lucide-react';

const reasons = [
    {
        icon: Award,
        title: 'Kualitas Premium',
        description:
            'Setiap produk batik Gumelem kami dibuat dengan standar kualitas tertinggi untuk memastikan ketahanan dan keindahan yang tahan lama.',
    },
    {
        icon: HeartHandshake,
        title: 'Mendukung Pengrajin Lokal',
        description:
            'Dengan membeli dari kami, Anda secara langsung mendukung komunitas pengrajin batik Gumelem dan membantu melestarikan warisan budaya Indonesia.',
    },
    {
        icon: Leaf,
        title: 'Pewarna Alami',
        description: 'Sebagian besar produk kami menggunakan pewarna alami yang ramah lingkungan, diambil dari tumbuhan dan mineral alami.',
    },
    {
        icon: ShieldCheck,
        title: 'Produk Asli & Bergaransi',
        description: 'Kami menjamin keaslian setiap produk batik Gumelem dan memberikan garansi untuk setiap pembelian.',
    },
    {
        icon: Truck,
        title: 'Pengiriman Ke Seluruh Indonesia',
        description: 'Kami melayani pengiriman ke seluruh wilayah Indonesia dengan berbagai pilihan jasa pengiriman terpercaya.',
    },
    {
        icon: CircleDollarSign,
        title: 'Harga Terjangkau',
        description: 'Kami menawarkan produk berkualitas dengan harga terjangkau karena langsung dari pengrajin tanpa perantara.',
    },
];

const WhyBuySection = () => {
    return (
        <section className="bg-batik-cream/40 batik-pattern py-16">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-12 text-center">
                    <h2 className="text-batik-brown text-3xl font-bold">
                        Mengapa Memilih Batik <span className="text-batik-indigo">Gumelem</span>?
                    </h2>
                    <p className="mx-auto mt-4 max-w-3xl text-lg text-gray-600">
                        Temukan alasan mengapa batik Gumelem dari kami menjadi pilihan utama para pencinta batik berkualitas
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {reasons.map((reason, index) => (
                        <div
                            key={index}
                            className="hover-lift animate-fade-in rounded-xl bg-white p-6 shadow-sm"
                            style={{ animationDelay: `${index * 100}ms` }}
                        >
                            <div className="mb-4 flex items-center">
                                <div className="bg-batik-brown/10 mr-4 flex h-12 w-12 items-center justify-center rounded-full">
                                    <reason.icon className="text-batik-brown h-6 w-6" />
                                </div>
                                <h3 className="text-batik-brown text-xl font-semibold">{reason.title}</h3>
                            </div>
                            <p className="text-gray-600">{reason.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default WhyBuySection;
