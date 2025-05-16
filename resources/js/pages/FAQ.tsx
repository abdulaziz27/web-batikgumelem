import Layout from '@/components/layout/Layout';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const faqItems = [
    {
        question: 'Apa itu Batik Gumelem?',
        answer: 'Batik Gumelem adalah batik tradisional yang berasal dari Desa Gumelem, Kabupaten Banjarnegara, Jawa Tengah. Batik ini memiliki ciri khas motif yang terinspirasi dari alam sekitar dan kehidupan masyarakat Gumelem. Batik ini sudah ada sejak abad ke-17 dan merupakan salah satu warisan budaya Indonesia.',
    },
    {
        question: 'Apa perbedaan antara Batik Tulis dan Batik Cap?',
        answer: 'Batik Tulis dibuat dengan cara menggambar motif langsung di atas kain menggunakan canting dan lilin (malam) secara manual. Proses ini memakan waktu lama dan membutuhkan ketelitian tinggi. Sedangkan Batik Cap dibuat dengan menggunakan stempel dari tembaga yang sudah memiliki pola tertentu. Proses ini lebih cepat dari batik tulis, namun tetap mempertahankan kualitas dan keindahan motif. Di BatikGumelem.com, kami menawarkan kedua jenis batik ini.',
    },
    {
        question: 'Bagaimana cara merawat batik agar tetap awet?',
        answer: 'Untuk merawat batik agar tetap awet, sebaiknya cuci dengan tangan menggunakan air dingin dan deterjen lembut. Hindari penggunaan pemutih dan jangan merendam batik terlalu lama. Keringkan di tempat teduh dengan cara digantung dan setrika pada suhu sedang. Untuk penyimpanan, lipat batik dengan rapi dan simpan di tempat yang kering dan terhindar dari sinar matahari langsung.',
    },
    {
        question: 'Apakah batik yang dijual di BatikGumelem.com menggunakan pewarna alami?',
        answer: 'Ya, sebagian besar batik yang kami jual menggunakan pewarna alami yang berasal dari tumbuhan seperti kulit kayu, daun, dan akar. Namun, kami juga menawarkan batik dengan pewarna sintetis untuk beberapa koleksi tertentu. Informasi tentang jenis pewarna yang digunakan selalu kami cantumkan pada deskripsi setiap produk.',
    },
    {
        question: 'Berapa lama waktu pengiriman pesanan?',
        answer: 'Waktu pengiriman tergantung pada alamat tujuan pengiriman. Untuk wilayah Jawa, biasanya membutuhkan waktu 2-3 hari kerja. Sedangkan untuk luar Jawa, bisa memakan waktu 3-7 hari kerja. Untuk luar Indonesia, pengiriman membutuhkan waktu 1-3 minggu, tergantung pada negara tujuan dan metode pengiriman yang dipilih.',
    },
    {
        question: 'Apakah BatikGumelem.com menerima pesanan khusus?',
        answer: 'Ya, kami menerima pesanan khusus atau custom order. Anda dapat menghubungi tim Customer Service kami untuk mendiskusikan kebutuhan Anda. Mohon diingat bahwa pesanan khusus membutuhkan waktu produksi yang lebih lama dan mungkin dikenakan biaya tambahan tergantung pada tingkat kesulitan dan jumlah pesanan.',
    },
    {
        question: 'Bagaimana kebijakan pengembalian barang di BatikGumelem.com?',
        answer: 'Kami menerima pengembalian barang dalam waktu 7 hari setelah barang diterima, dengan syarat barang belum dipakai, belum dicuci, masih dalam kondisi baru, dan masih memiliki label asli. Biaya pengiriman untuk pengembalian barang ditanggung oleh pembeli. Untuk informasi lebih lanjut, silakan kunjungi halaman Kebijakan Pengembalian di website kami.',
    },
    {
        question: 'Apakah BatikGumelem.com melayani pengiriman internasional?',
        answer: 'Ya, kami melayani pengiriman internasional ke berbagai negara. Biaya pengiriman internasional bervariasi tergantung pada berat paket dan negara tujuan. Untuk estimasi biaya pengiriman, silakan tambahkan produk ke keranjang belanja dan masukkan alamat pengiriman Anda pada halaman checkout.',
    },
    {
        question: 'Bagaimana cara mengetahui ukuran yang tepat untuk produk pakaian jadi?',
        answer: 'Setiap produk pakaian jadi di website kami memiliki panduan ukuran yang tertera pada halaman produk. Kami sangat menyarankan untuk mengukur badan Anda sebelum memilih ukuran. Jika Anda masih ragu, silakan hubungi Customer Service kami untuk bantuan lebih lanjut dalam memilih ukuran yang tepat.',
    },
    {
        question: 'Apakah ada diskon untuk pembelian dalam jumlah banyak?',
        answer: 'Ya, kami memberikan diskon khusus untuk pembelian dalam jumlah banyak atau grosir. Besaran diskon disesuaikan dengan jumlah pembelian. Untuk informasi lebih lanjut mengenai harga grosir, silakan hubungi tim Sales kami melalui email atau WhatsApp yang tertera di halaman Kontak.',
    },
];

const FAQ = () => {
    return (
        <Layout>
            <div className="bg-batik-cream/30 batik-pattern py-10">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h1 className="text-batik-brown text-3xl font-bold tracking-tight sm:text-4xl">Pertanyaan yang Sering Diajukan</h1>
                        <p className="mx-auto mt-4 max-w-xl text-base text-gray-600">
                            Temukan jawaban untuk pertanyaan umum tentang produk dan layanan kami
                        </p>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-3xl">
                    <Accordion type="single" collapsible className="space-y-4">
                        {faqItems.map((item, index) => (
                            <AccordionItem
                                key={index}
                                value={`item-${index}`}
                                className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md"
                            >
                                <AccordionTrigger className="text-batik-brown hover:text-batik-indigo px-6 py-4 text-left font-medium">
                                    {item.question}
                                </AccordionTrigger>
                                <AccordionContent className="px-6 pb-4 text-gray-600">{item.answer}</AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>

                    <div className="mt-12 rounded-xl bg-white p-6 text-center shadow-sm">
                        <h2 className="text-batik-brown mb-4 text-xl font-semibold">Masih Ada Pertanyaan?</h2>
                        <p className="mb-6 text-gray-600">
                            Jika Anda memiliki pertanyaan lain yang belum terjawab, jangan ragu untuk menghubungi tim kami.
                        </p>
                        <div className="flex flex-col justify-center gap-4 sm:flex-row">
                            <a
                                href="mailto:info@batikgumelem.com"
                                className="bg-batik-brown hover-lift hover:bg-batik-brown/90 inline-flex items-center justify-center rounded-lg px-6 py-3 text-white"
                            >
                                Email Kami
                            </a>
                            <a
                                href="https://wa.me/6281234567890"
                                className="border-batik-brown text-batik-brown hover-lift hover:bg-batik-brown/10 inline-flex items-center justify-center rounded-lg border px-6 py-3"
                            >
                                WhatsApp
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default FAQ;
