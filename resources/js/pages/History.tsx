import Layout from '@/components/layout/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';

const History = () => {
    return (
        <Layout>
            <div className="bg-batik-cream/30 batik-pattern py-10">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h1 className="text-batik-brown text-3xl font-bold tracking-tight sm:text-4xl">
                            Sejarah Batik <span className="text-batik-indigo">Gumelem</span>
                        </h1>
                        <p className="mx-auto mt-4 max-w-xl text-base text-gray-600">Telusuri perjalanan panjang batik Gumelem dari masa ke masa</p>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
                <div className="mb-20 grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="order-2 lg:order-1"
                    >
                        <h2 className="text-batik-brown mb-6 text-2xl font-bold md:text-3xl">Warisan Budaya dari Masa Kerajaan</h2>
                        <p className="mb-4 text-gray-600">
                            Sejarah batik Gumelem tidak lepas dari keberadaan Kadipaten Gumelem yang merupakan wilayah bawahan Kerajaan Mataram.
                            Konon, batik Gumelem sudah ada sejak abad ke-17, pada masa pemerintahan Sultan Agung Hanyokrokusumo.
                        </p>
                        <p className="mb-4 text-gray-600">
                            Pada masa itu, batik hanya dibuat oleh keluarga bangsawan atau raja, dan motif-motifnya sangat eksklusif. Motif-motif
                            tersebut memiliki makna filosofis yang mendalam dan mencerminkan status sosial pemakainya.
                        </p>
                        <p className="text-gray-600">
                            Seiring berjalannya waktu, batik mulai menyebar ke masyarakat umum dan berkembang menjadi industri rakyat seperti yang
                            kita kenal sekarang. Meski demikian, keunikan dan kekhasan motif batik Gumelem tetap terjaga hingga kini.
                        </p>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="order-1 lg:order-2"
                    >
                        <div className="relative aspect-video">
                            <div className="group absolute inset-0 flex cursor-pointer items-center justify-center overflow-hidden rounded-xl bg-black/20">
                                <iframe
                                    className="absolute inset-0 h-full w-full rounded-xl"
                                    src="https://www.youtube.com/embed/dQw4w9WgXcQ?controls=0"
                                    title="Sejarah Batik Gumelem"
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                ></iframe>
                                <div className="absolute inset-0 flex items-center justify-center bg-black/40 transition-colors group-hover:bg-black/20">
                                    <div className="bg-batik-indigo flex h-16 w-16 items-center justify-center rounded-full transition-transform group-hover:scale-110">
                                        <Play className="ml-1 h-8 w-8 text-white" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                <div className="mb-20 grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                    >
                        <div className="relative">
                            <div className="bg-batik-brown absolute -top-4 -left-4 hidden h-24 w-24 rounded-full md:block"></div>
                            <img
                                src="images/product_image_3.png"
                                alt="Proses pembuatan batik Gumelem"
                                className="hero-image-shadow w-full rounded-xl shadow-lg"
                            />
                        </div>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-batik-brown mb-6 text-2xl font-bold md:text-3xl">Teknik Pembuatan yang Diwariskan</h2>
                        <p className="mb-4 text-gray-600">
                            Teknik pembuatan batik Gumelem masih sangat tradisional dan memakan waktu yang lama. Proses pembuatan dimulai dari tahap
                            persiapan kain, pembuatan pola, pencantingan, pewarnaan, hingga pelorodan (menghilangkan lilin).
                        </p>
                        <p className="mb-4 text-gray-600">
                            Batik Gumelem dibuat dengan dua teknik utama, yaitu batik tulis dan batik cap. Batik tulis dibuat dengan menggambar motif
                            menggunakan canting yang diisi dengan lilin (malam) panas, sementara batik cap menggunakan stempel dari tembaga untuk
                            membuat pola.
                        </p>
                        <p className="text-gray-600">
                            Pewarnaan batik Gumelem tradisional menggunakan bahan-bahan alami seperti kulit kayu, daun, dan akar tumbuhan. Proses ini
                            membutuhkan ketelitian dan kesabaran, karena untuk mendapatkan warna yang sempurna, kain harus dicelup berulang kali.
                        </p>
                    </motion.div>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="mb-20"
                >
                    <div className="mb-12 text-center">
                        <h2 className="text-batik-brown text-2xl font-bold md:text-3xl">Filosofi Motif Batik Gumelem</h2>
                        <p className="mx-auto mt-4 max-w-3xl text-gray-600">
                            Setiap motif batik Gumelem mengandung makna filosofis mendalam yang mencerminkan pandangan hidup dan nilai-nilai
                            masyarakat Banjarnegara
                        </p>
                    </div>

                    <Tabs defaultValue="pring-sedapur" className="w-full">
                        <TabsList className="mb-8 grid w-full grid-cols-2 md:grid-cols-5">
                            <TabsTrigger value="pring-sedapur">Pring Sedapur</TabsTrigger>
                            <TabsTrigger value="sekar-jagad">Sekar Jagad</TabsTrigger>
                            <TabsTrigger value="semen-rama">Semen Rama</TabsTrigger>
                            <TabsTrigger value="parang-kusuma">Parang Kusuma</TabsTrigger>
                            <TabsTrigger value="gilar-gilar">Gilar-gilar</TabsTrigger>
                        </TabsList>

                        <div className="overflow-hidden rounded-xl bg-white shadow-sm">
                            <TabsContent value="pring-sedapur">
                                <div className="grid grid-cols-1 md:grid-cols-2">
                                    <div className="aspect-square overflow-hidden">
                                        <img src="images/product_image_1.png" alt="Motif Pring Sedapur" className="h-full w-full object-cover" />
                                    </div>
                                    <div className="p-8">
                                        <h3 className="text-batik-indigo mb-4 text-xl font-bold">Motif Pring Sedapur</h3>
                                        <p className="mb-4 text-gray-600">
                                            Motif yang menggambarkan rumpun bambu (pring) dalam satu kebun (sedapur). Bambu dipilih sebagai motif
                                            karena memiliki filosofi yang mendalam dalam kehidupan masyarakat Jawa.
                                        </p>
                                        <p className="mb-4 text-gray-600">
                                            Filosofi dari motif ini adalah semakin tinggi ilmu seseorang, semakin rendah hati dia. Seperti bambu yang
                                            semakin tinggi semakin merunduk. Bambu juga melambangkan kemanfaatan yang tinggi, karena hampir seluruh
                                            bagian bambu dapat dimanfaatkan.
                                        </p>
                                        <p className="text-gray-600">
                                            Selain itu, rumpun bambu juga melambangkan kebersamaan dan gotong royong, karena bambu selalu tumbuh
                                            berumpun, tidak pernah sendiri.
                                        </p>
                                    </div>
                                </div>
                            </TabsContent>

                            <TabsContent value="sekar-jagad">
                                <div className="grid grid-cols-1 md:grid-cols-2">
                                    <div className="aspect-square overflow-hidden">
                                        <img src="images/product_image_2.png" alt="Motif Sekar Jagad" className="h-full w-full object-cover" />
                                    </div>
                                    <div className="p-8">
                                        <h3 className="text-batik-indigo mb-4 text-xl font-bold">Motif Sekar Jagad</h3>
                                        <p className="mb-4 text-gray-600">
                                            Sekar Jagad berarti "bunga dunia" atau "bunga semesta". Motif ini terdiri dari berbagai macam bentuk yang
                                            menyerupai pulau-pulau yang dikelilingi ol h lautan, mewakili keberagaman dunia.
                                        </p>
                                        <p className="mb-4 text-gray-600">
                                            Filosofi dari motif Sekar Jagad adalah keindahan dalam keberagaman. Motif ini melambangkan kesatuan dalam
                                            perbedaan, seperti semboyan "Bhinneka Tunggal Ika" yang berarti berbeda-beda tetapi tetap satu.
                                        </p>
                                        <p className="text-gray-600">
                                            Motif ini juga mengajarkan bahwa segala sesuatu di dunia ini saling terhubung dan saling melengkapi,
                                            seperti keseimbangan alam semesta.
                                        </p>
                                    </div>
                                </div>
                            </TabsContent>

                            <TabsContent value="semen-rama">
                                <div className="grid grid-cols-1 md:grid-cols-2">
                                    <div className="aspect-square overflow-hidden">
                                        <img src="images/product_image_2.png" alt="Motif Semen Rama" className="h-full w-full object-cover" />
                                    </div>
                                    <div className="p-8">
                                        <h3 className="text-batik-indigo mb-4 text-xl font-bold">Motif Semen Rama</h3>
                                        <p className="mb-4 text-gray-600">
                                            Kata "semen" berasal dari kata "semi" yang berarti tumbuh atau berkembang. Motif Semen Rama terinspirasi
                                            dari kisah Ramawijaya dalam Epos Ramayana, seorang raja yang bijaksana dan adil.
                                        </p>
                                        <p className="mb-4 text-gray-600">
                                            Filosofi dari motif ini melambangkan kesuburan dan kemakmuran. Motif ini juga mengandung ajaran tentang
                                            kepemimpinan yang adil dan bijaksana, seperti yang dicontohkan oleh Raja Rama.
                                        </p>
                                        <p className="text-gray-600">
                                            Motif Semen Rama biasanya terdiri dari ornamen gunung, tumbuhan, burung, dan hewan lainnya, yang
                                            melambangkan harmoni antara manusia, alam, dan kosmos.
                                        </p>
                                    </div>
                                </div>
                            </TabsContent>

                            <TabsContent value="parang-kusuma">
                                <div className="grid grid-cols-1 md:grid-cols-2">
                                    <div className="aspect-square overflow-hidden">
                                        <img src="images/product_image_3.png" alt="Motif Parang Kusuma" className="h-full w-full object-cover" />
                                    </div>
                                    <div className="p-8">
                                        <h3 className="text-batik-indigo mb-4 text-xl font-bold">Motif Parang Kusuma</h3>
                                        <p className="mb-4 text-gray-600">
                                            Parang berarti pisau atau senjata, sedangkan kusuma berarti bunga atau keindahan. Motif ini terdiri dari
                                            bentuk-bentuk diagonal menyerupai pisau yang disusun berderet.
                                        </p>
                                        <p className="mb-4 text-gray-600">
                                            Filosofi dari motif Parang Kusuma menggambarkan kebijaksanaan dan keteguhan dalam menghadapi berbagai
                                            rintangan kehidupan. Motif ini juga melambangkan kekuatan dan kegigihan, seperti ombak laut yang tidak
                                            pernah berhenti bergerak.
                                        </p>
                                        <p className="text-gray-600">
                                            Dalam tradisi Jawa, motif parang merupakan salah satu motif tertua dan paling dihormati, yang pada masa
                                            lalu hanya boleh dikenakan oleh kalangan bangsawan.
                                        </p>
                                    </div>
                                </div>
                            </TabsContent>

                            <TabsContent value="gilar-gilar">
                                <div className="grid grid-cols-1 md:grid-cols-2">
                                    <div className="aspect-square overflow-hidden">
                                        <img src="images/product_image_4.png" alt="Motif Gilar-gilar" className="h-full w-full object-cover" />
                                    </div>
                                    <div className="p-8">
                                        <h3 className="text-batik-indigo mb-4 text-xl font-bold">Motif Gilar-gilar</h3>
                                        <p className="mb-4 text-gray-600">
                                            Gilar-gilar berarti "bersinar" atau "gemerlap". Motif ini terinspirasi dari gelang emas milik Kadipaten
                                            Gumelem yang memancarkan cahaya gemerlap.
                                        </p>
                                        <p className="mb-4 text-gray-600">
                                            Filosofi dari motif ini melambangkan kemakmuran, kemuliaan, dan harapan akan kehidupan yang lebih baik.
                                            Motif ini juga mengandung makna keindahan dan keagungan.
                                        </p>
                                        <p className="text-gray-600">
                                            Motif Gilar-gilar merupakan salah satu motif khas Gumelem yang tidak ditemukan di daerah penghasil batik
                                            lainnya, sehingga menjadi identitas tersendiri bagi batik Gumelem.
                                        </p>
                                    </div>
                                </div>
                            </TabsContent>
                        </div>
                    </Tabs>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                >
                    <div className="mb-12 text-center">
                        <h2 className="text-batik-brown text-2xl font-bold md:text-3xl">Pelestarian Batik Gumelem</h2>
                        <p className="mx-auto mt-4 max-w-3xl text-gray-600">
                            Upaya yang dilakukan berbagai pihak untuk melestarikan dan mengembangkan batik Gumelem sebagai warisan budaya
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                        <div className="hover-lift overflow-hidden rounded-xl bg-white shadow-sm">
                            <div className="aspect-video overflow-hidden">
                                <img
                                    src="https://images.unsplash.com/photo-1585944707493-4069f0a5ae05?q=80&w=1887"
                                    alt="Pelatihan batik"
                                    className="h-full w-full object-cover"
                                />
                            </div>
                            <div className="p-6">
                                <h3 className="text-batik-indigo mb-2 text-lg font-semibold">Pelatihan dan Pendidikan</h3>
                                <p className="text-gray-600">
                                    Berbagai program pelatihan dan pendidikan diadakan untuk mengajarkan teknik pembuatan batik Gumelem kepada
                                    generasi muda, terutama di sekolah-sekolah dan komunitas lokal.
                                </p>
                            </div>
                        </div>

                        <div className="hover-lift overflow-hidden rounded-xl bg-white shadow-sm">
                            <div className="aspect-video overflow-hidden">
                                <img
                                    src="https://images.unsplash.com/photo-1585944682150-e5b4f9156787?q=80&w=1887"
                                    alt="Festival batik"
                                    className="h-full w-full object-cover"
                                />
                            </div>
                            <div className="p-6">
                                <h3 className="text-batik-indigo mb-2 text-lg font-semibold">Festival dan Pameran</h3>
                                <p className="text-gray-600">
                                    Festival Batik Gumelem diadakan secara rutin untuk mempromosikan dan memperkenalkan batik Gumelem kepada
                                    masyarakat luas, baik dalam skala nasional maupun internasional.
                                </p>
                            </div>
                        </div>

                        <div className="hover-lift overflow-hidden rounded-xl bg-white shadow-sm">
                            <div className="aspect-video overflow-hidden">
                                <img
                                    src="https://images.unsplash.com/photo-1585944684602-f0195998a211?q=80&w=1887"
                                    alt="Inovasi batik"
                                    className="h-full w-full object-cover"
                                />
                            </div>
                            <div className="p-6">
                                <h3 className="text-batik-indigo mb-2 text-lg font-semibold">Inovasi dan Pengembangan</h3>
                                <p className="text-gray-600">
                                    Para pengrajin batik Gumelem terus berinovasi dengan menciptakan motif-motif baru dan aplikasi batik pada berbagai
                                    produk, sambil tetap menjaga kekhasan dan nilai-nilai tradisional.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-12 text-center">
                        <a
                            href="/about"
                            className="bg-batik-brown hover-lift hover:bg-batik-brown/90 inline-flex items-center justify-center rounded-lg px-6 py-3 text-white"
                        >
                            Pelajari Lebih Lanjut tentang Komunitas Kami
                        </a>
                    </div>
                </motion.div>
            </div>
        </Layout>
    );
};

export default History;
