import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, Package, RotateCcw, ShieldCheck, Truck } from 'lucide-react';

const Shipping = () => {
    return (
        <Layout>
            <div className="bg-batik-cream/30 batik-pattern py-10">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h1 className="text-batik-brown text-3xl font-bold tracking-tight sm:text-4xl">Pengiriman & Pengembalian</h1>
                        <p className="mx-auto mt-4 max-w-xl text-base text-gray-600">
                            Informasi lengkap mengenai pengiriman dan kebijakan pengembalian produk
                        </p>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
                    {/* Shipping Information */}
                    <div className="animate-fade-in">
                        <h2 className="text-batik-brown mb-6 text-2xl font-bold">Informasi Pengiriman</h2>

                        <div className="space-y-6">
                            <div className="rounded-xl bg-white p-6 shadow-sm">
                                <h3 className="text-batik-indigo mb-4 text-lg font-semibold">Metode Pengiriman</h3>
                                <p className="mb-4 text-gray-600">
                                    Kami bekerja sama dengan berbagai jasa pengiriman terpercaya untuk memastikan produk Anda sampai dengan aman dan
                                    tepat waktu:
                                </p>
                                <ul className="space-y-3">
                                    <li className="flex items-start">
                                        <span className="bg-batik-indigo/10 mt-1 mr-3 flex-shrink-0 rounded p-1">
                                            <Truck className="text-batik-indigo h-4 w-4" />
                                        </span>
                                        <div>
                                            <p className="font-medium">JNE</p>
                                            <p className="text-sm text-gray-500">Regular (2-3 hari), YES (1 hari)</p>
                                        </div>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="bg-batik-indigo/10 mt-1 mr-3 flex-shrink-0 rounded p-1">
                                            <Truck className="text-batik-indigo h-4 w-4" />
                                        </span>
                                        <div>
                                            <p className="font-medium">SiCepat</p>
                                            <p className="text-sm text-gray-500">Regular (2-3 hari), BEST (1 hari)</p>
                                        </div>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="bg-batik-indigo/10 mt-1 mr-3 flex-shrink-0 rounded p-1">
                                            <Truck className="text-batik-indigo h-4 w-4" />
                                        </span>
                                        <div>
                                            <p className="font-medium">AnterAja</p>
                                            <p className="text-sm text-gray-500">Standard (2-3 hari), Same Day (dalam kota)</p>
                                        </div>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="bg-batik-indigo/10 mt-1 mr-3 flex-shrink-0 rounded p-1">
                                            <Truck className="text-batik-indigo h-4 w-4" />
                                        </span>
                                        <div>
                                            <p className="font-medium">Pos Indonesia</p>
                                            <p className="text-sm text-gray-500">Standard (3-7 hari)</p>
                                        </div>
                                    </li>
                                </ul>
                            </div>

                            <div className="rounded-xl bg-white p-6 shadow-sm">
                                <h3 className="text-batik-indigo mb-4 text-lg font-semibold">Biaya Pengiriman</h3>
                                <p className="text-gray-600">
                                    Biaya pengiriman dihitung berdasarkan berat paket, dimensi, dan alamat tujuan. Anda dapat melihat estimasi biaya
                                    pengiriman pada halaman checkout setelah memasukkan alamat pengiriman.
                                </p>
                                <p className="mt-3 text-gray-600">
                                    Untuk wilayah tertentu seperti Indonesia Timur dan daerah terpencil, mungkin dikenakan biaya tambahan dan waktu
                                    pengiriman yang lebih lama.
                                </p>
                            </div>

                            <div className="rounded-xl bg-white p-6 shadow-sm">
                                <h3 className="text-batik-indigo mb-4 text-lg font-semibold">Pelacakan Pengiriman</h3>
                                <p className="text-gray-600">
                                    Setelah pesanan Anda dikirim, Anda akan menerima email konfirmasi pengiriman yang berisi nomor resi dan tautan
                                    untuk melacak status pengiriman Anda.
                                </p>
                                <p className="mt-3 text-gray-600">
                                    Anda juga dapat melacak pesanan Anda melalui halaman "Riwayat Pesanan" di akun Anda.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Returns Information */}
                    <div className="animate-fade-in" style={{ animationDelay: '200ms' }}>
                        <h2 className="text-batik-brown mb-6 text-2xl font-bold">Kebijakan Pengembalian</h2>

                        <div className="space-y-6">
                            <div className="rounded-xl bg-white p-6 shadow-sm">
                                <h3 className="text-batik-indigo mb-4 text-lg font-semibold">Syarat Pengembalian</h3>
                                <p className="mb-4 text-gray-600">Kami menerima pengembalian produk dengan ketentuan berikut:</p>
                                <ul className="space-y-3">
                                    <li className="flex items-start">
                                        <span className="bg-batik-indigo/10 mt-1 mr-3 flex-shrink-0 rounded p-1">
                                            <Clock className="text-batik-indigo h-4 w-4" />
                                        </span>
                                        <p className="text-gray-600">Pengembalian dilakukan dalam waktu 7 hari setelah produk diterima.</p>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="bg-batik-indigo/10 mt-1 mr-3 flex-shrink-0 rounded p-1">
                                            <Package className="text-batik-indigo h-4 w-4" />
                                        </span>
                                        <p className="text-gray-600">
                                            Produk belum dipakai, belum dicuci, masih dalam kondisi baru, dan masih memiliki label asli.
                                        </p>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="bg-batik-indigo/10 mt-1 mr-3 flex-shrink-0 rounded p-1">
                                            <ShieldCheck className="text-batik-indigo h-4 w-4" />
                                        </span>
                                        <p className="text-gray-600">Produk cacat, rusak saat pengiriman, atau tidak sesuai dengan deskripsi.</p>
                                    </li>
                                </ul>
                            </div>

                            <div className="rounded-xl bg-white p-6 shadow-sm">
                                <h3 className="text-batik-indigo mb-4 text-lg font-semibold">Proses Pengembalian</h3>
                                <p className="mb-4 text-gray-600">Untuk melakukan pengembalian produk, ikuti langkah-langkah berikut:</p>
                                <ol className="list-decimal space-y-3 pl-5">
                                    <li className="text-gray-600">
                                        Hubungi Customer Service kami melalui email <span className="text-batik-indigo">cs@batikgumelem.com</span>{' '}
                                        atau WhatsApp <span className="text-batik-indigo">081234567890</span> untuk mengajukan pengembalian.
                                    </li>
                                    <li className="text-gray-600">Sertakan nomor pesanan, foto produk, dan alasan pengembalian.</li>
                                    <li className="text-gray-600">
                                        Setelah pengajuan disetujui, kirimkan produk kembali ke alamat yang kami berikan.
                                    </li>
                                    <li className="text-gray-600">
                                        Setelah produk diterima dan diperiksa, kami akan memproses pengembalian dana atau penggantian produk sesuai
                                        permintaan Anda.
                                    </li>
                                </ol>
                            </div>

                            <div className="rounded-xl bg-white p-6 shadow-sm">
                                <h3 className="text-batik-indigo mb-4 text-lg font-semibold">Pengembalian Dana</h3>
                                <p className="text-gray-600">
                                    Pengembalian dana akan diproses dalam waktu 3-7 hari kerja setelah produk diterima dan diverifikasi oleh tim kami.
                                    Dana akan dikembalikan melalui metode pembayaran yang sama saat Anda melakukan pembelian.
                                </p>
                                <p className="mt-3 text-gray-600">
                                    Biaya pengiriman untuk pengembalian produk ditanggung oleh pembeli, kecuali jika produk cacat atau tidak sesuai
                                    dengan deskripsi.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Shipping Features */}
                <div className="animate-fade-in mt-16" style={{ animationDelay: '400ms' }}>
                    <h2 className="text-batik-brown mb-8 text-center text-2xl font-bold">Layanan Pengiriman Kami</h2>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                        <Card className="hover-lift">
                            <CardHeader className="pb-2">
                                <div className="bg-batik-indigo/10 mb-4 flex h-12 w-12 items-center justify-center rounded-full">
                                    <Truck className="text-batik-indigo h-6 w-6" />
                                </div>
                                <CardTitle className="text-lg">Pengiriman Nasional</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-gray-600">
                                    Melayani pengiriman ke seluruh wilayah Indonesia dengan berbagai pilihan jasa pengiriman.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="hover-lift">
                            <CardHeader className="pb-2">
                                <div className="bg-batik-indigo/10 mb-4 flex h-12 w-12 items-center justify-center rounded-full">
                                    <ShieldCheck className="text-batik-indigo h-6 w-6" />
                                </div>
                                <CardTitle className="text-lg">Kemasan Aman</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-gray-600">
                                    Produk dikemas dengan aman dan rapi untuk melindungi produk selama pengiriman.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="hover-lift">
                            <CardHeader className="pb-2">
                                <div className="bg-batik-indigo/10 mb-4 flex h-12 w-12 items-center justify-center rounded-full">
                                    <Clock className="text-batik-indigo h-6 w-6" />
                                </div>
                                <CardTitle className="text-lg">Pengiriman Cepat</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-gray-600">
                                    Opsi pengiriman cepat tersedia untuk pengiriman dalam kota dan antar kota besar.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="hover-lift">
                            <CardHeader className="pb-2">
                                <div className="bg-batik-indigo/10 mb-4 flex h-12 w-12 items-center justify-center rounded-full">
                                    <RotateCcw className="text-batik-indigo h-6 w-6" />
                                </div>
                                <CardTitle className="text-lg">Pengembalian Mudah</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-gray-600">Proses pengembalian yang mudah dan cepat jika terjadi masalah dengan produk.</p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Shipping;
