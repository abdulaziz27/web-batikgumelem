<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\ProductImage;
use App\Models\ProductSize;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        // Path gambar yang akan digunakan (berdasarkan definisi Anda)
        $imgPathA = 'products/product_image_2.png';
        $imgPathB = 'products/product_image_3.png';
        $imgPathC = 'products/product_image_1.png';

        // Untuk variasi, kita buat array untuk cycling
        $imageCycle = [$imgPathA, $imgPathB, $imgPathC];
        $numImageCycle = count($imageCycle);

        $products = [
            [
                'name' => 'Batik Gumelem - Motif Sido Luhur',
                'description' => 'Batik Tulis Gumelem premium dengan motif Sido Luhur yang memiliki pola geometris kompleks dan harmonis. Kata "Sido" berarti jadi atau tercapai, sedangkan "Luhur" berarti tinggi, mulia, atau terhormat. Motif ini melambangkan harapan agar pemakainya dapat mencapai kedudukan yang tinggi, kemuliaan, dan kehormatan dalam hidup. Seringkali dikaitkan dengan sifat sabar dan bijaksana. Dibuat oleh pengrajin batik Gumelem berpengalaman menggunakan pewarna berkualitas dan kain katun primisima.',
                'price' => 950000,
                'image' => $imageCycle[0 % $numImageCycle],
                'additionalImages' => [$imageCycle[1 % $numImageCycle], $imageCycle[2 % $numImageCycle]]
            ],
            [
                'name' => 'Batik Gumelem - Motif Kawung',
                'description' => 'Batik Tulis Gumelem dengan motif Kawung yang memiliki pola dasar berupa empat bulatan lonjong mengelilingi satu titik pusat, menyerupai buah kawung. Di Gumelem, variasi seperti Kawung Ceplokan juga dikenal. Motif Kawung melambangkan harapan akan kebijaksanaan, keadilan, dan kesempurnaan. Dibuat dengan teknik tradisional tulis oleh pembatik Gumelem.',
                'price' => 850000,
                'image' => $imageCycle[1 % $numImageCycle],
                'additionalImages' => [$imageCycle[2 % $numImageCycle], $imageCycle[0 % $numImageCycle]]
            ],
            [
                'name' => 'Batik Gumelem - Motif Sekar Jagad',
                'description' => 'Batik Tulis Gumelem dengan motif Sekar Jagad. "Sekar" berarti bunga dan "Jagad" berarti dunia, menampilkan ragam pola berbeda seolah peta dunia yang beragam. Motif ini melambangkan keindahan dan keberagaman yang harmonis. Dibuat dengan ketelitian tinggi oleh pengrajin Gumelem.',
                'price' => 1100000,
                'image' => $imageCycle[2 % $numImageCycle],
                'additionalImages' => [$imageCycle[0 % $numImageCycle], $imageCycle[1 % $numImageCycle]]
            ],
            [
                'name' => 'Batik Gumelem - Motif Lung-lungan',
                'description' => 'Batik Tulis Gumelem dengan motif Lung-lungan yang berarti sulur atau tumbuhan merambat. Didominasi gambar sulur tanaman dengan daun dan bunga. Motif Lung-lungan melambangkan kehidupan yang terus tumbuh, berkembang, subur, dan berkelanjutan. Dibuat secara tradisional di Gumelem.',
                'price' => 780000,
                'image' => $imageCycle[0 % $numImageCycle], // Mulai siklus lagi (produk ke-4, index 3)
                'additionalImages' => [$imageCycle[1 % $numImageCycle], $imageCycle[2 % $numImageCycle]]
            ],
            [
                'name' => 'Batik Gumelem - Motif Pring Sedapur',
                'description' => 'Batik Tulis Gumelem dengan motif Pring Sedapur, "Pring" berarti bambu dan "Sedapur" berarti serumpun. Menggambarkan serumpun pohon bambu yang kokoh. Motif ini melambangkan persatuan, kesatuan, kekuatan, dan kerukunan. Khas dari Gumelem.',
                'price' => 700000,
                'image' => $imageCycle[1 % $numImageCycle],
                'additionalImages' => [$imageCycle[2 % $numImageCycle], $imageCycle[0 % $numImageCycle]]
            ],
            [
                'name' => 'Batik Gumelem - Motif Udan Liris',
                'description' => 'Batik Tulis Gumelem dengan motif Udan Liris. "Udan" berarti hujan dan "Liris" berarti gerimis. Motif berupa garis-garis miring kecil teratur, menggambarkan tetesan air hujan. Melambangkan harapan kesuburan, kemakmuran, dan datangnya berkah. Batik asli Gumelem.',
                'price' => 820000,
                'image' => $imageCycle[2 % $numImageCycle],
                'additionalImages' => [$imageCycle[0 % $numImageCycle], $imageCycle[1 % $numImageCycle]]
            ],
            [
                'name' => 'Batik Gumelem - Motif Rujak Senthe',
                'description' => 'Batik Tulis Gumelem dengan motif khas Rujak Senthe. Terinspirasi dari tanaman senthe dan rujak dengan pola dinamis. Dapat menyimbolkan keberanian, kekuatan, dan daya tarik. Salah satu motif ciri khas Gumelem.',
                'price' => 760000,
                'image' => $imageCycle[0 % $numImageCycle],
                'additionalImages' => [$imageCycle[1 % $numImageCycle], $imageCycle[2 % $numImageCycle]]
            ],
            [
                'name' => 'Batik Gumelem - Motif Sungai Serayu',
                'description' => 'Batik Tulis Gumelem terinspirasi dari Sungai Serayu, ikon geografis Banjarnegara. Polanya menggambarkan aliran sungai dengan elemen alam sekitar. Melambangkan kehidupan yang terus mengalir dan keselarasan alam. Motif kontemporer Gumelem.',
                'price' => 900000,
                'image' => $imageCycle[1 % $numImageCycle],
                'additionalImages' => [$imageCycle[2 % $numImageCycle], $imageCycle[0 % $numImageCycle]]
            ],
            [
                'name' => 'Batik Gumelem - Motif Gabah Wutah',
                'description' => 'Batik Tulis Gumelem dengan motif Gabah Wutah (Beras Tumpah). "Gabah" adalah padi, "Wutah" berarti tumpah. Menggambarkan butiran gabah atau beras tumpah, simbol kemakmuran, kesuburan, dan kecukupan. Kain batik tulis asli Gumelem.',
                'price' => 880000,
                'image' => $imageCycle[2 % $numImageCycle],
                'additionalImages' => [$imageCycle[0 % $numImageCycle], $imageCycle[1 % $numImageCycle]]
            ],
            [
                'name' => 'Batik Gumelem - Motif Parang Angkrik',
                'description' => 'Batik Tulis Gumelem dengan motif Parang Angkrik. Garis diagonal sejajar melambangkan kekuatan, kekuasaan, dan kesinambungan. Pola tak terputus menggambarkan perjuangan dan semangat. Salah satu motif klasik yang diadaptasi di Gumelem.',
                'price' => 920000,
                'image' => $imageCycle[0 % $numImageCycle],
                'additionalImages' => [$imageCycle[1 % $numImageCycle], $imageCycle[2 % $numImageCycle]]
            ],
            [
                'name' => 'Batik Gumelem - Motif Jahe Serimpang',
                'description' => 'Batik Tulis Gumelem menggambarkan rimpang jahe yang saling terkait. Motif ini melambangkan pentingnya hubungan sosial yang erat, tolong-menolong, dan gotong royong dalam kehidupan bermasyarakat. Kualitas kain premium dari Gumelem.',
                'price' => 790000,
                'image' => $imageCycle[1 % $numImageCycle],
                'additionalImages' => [$imageCycle[2 % $numImageCycle], $imageCycle[0 % $numImageCycle]]
            ],
            [
                'name' => 'Batik Gumelem - Motif Sido Mukti',
                'description' => 'Batik Tulis Gumelem dengan motif Sido Mukti. "Sido" berarti jadi atau tercapai, dan "Mukti" berarti kebahagiaan atau kemuliaan. Pola motif ini biasanya rumit dan penuh, melambangkan harapan agar pemakainya mencapai kebahagiaan lahir dan batin. Karya pengrajin Gumelem.',
                'price' => 1050000,
                'image' => $imageCycle[2 % $numImageCycle],
                'additionalImages' => [$imageCycle[0 % $numImageCycle], $imageCycle[1 % $numImageCycle]]
            ],
            [
                'name' => 'Batik Gumelem - Motif Grinting',
                'description' => 'Batik Tulis Gumelem dengan motif Grinting. Merupakan salah satu motif klasik yang juga ditemukan di Gumelem, sering dikaitkan dengan harapan akan kemudahan dalam mencari rezeki dan kehidupan yang lancar. Dibuat dengan canting tulis tradisional.',
                'price' => 680000,
                'image' => $imageCycle[0 % $numImageCycle],
                'additionalImages' => [$imageCycle[1 % $numImageCycle], $imageCycle[2 % $numImageCycle]]
            ],
            [
                'name' => 'Batik Gumelem - Motif Kopi Pecah',
                'description' => 'Batik Tulis Gumelem terinspirasi dari biji kopi yang pecah. Dapat menyimbolkan proses menuju kematangan atau memiliki interpretasi lokal Gumelem terkait kehidupan. Kain batik tulis halus.',
                'price' => 720000,
                'image' => $imageCycle[1 % $numImageCycle], // produk ke-14, index 13
                'additionalImages' => [$imageCycle[2 % $numImageCycle], $imageCycle[0 % $numImageCycle]]
            ]
        ];

        // Ukuran kain batik tulis (panjang x lebar)
        $fabricSizes = ['200cmx100cm', '225cmx110cm', '250cmx115cm', '300cmx115cm'];

        // Index untuk cycling gambar, jika Anda ingin mengubah cara cycling di dalam loop
        // Namun, karena sudah di-set manual di array $products, ini tidak begitu diperlukan lagi
        // $imageIndex = 0;

        foreach ($products as $productData) {
            // Path gambar sudah langsung dari $productData
            $primaryImage = $productData['image'];

            // Buat produk
            $product = Product::create([
                'name' => $productData['name'],
                'slug' => Str::slug($productData['name']),
                'description' => $productData['description'],
                'price' => $productData['price'],
                'stock' => rand(1, 15),
                'image' => $primaryImage,
            ]);

            // Tambahkan gambar utama ke ProductImage
            ProductImage::create([
                'product_id' => $product->id,
                'image' => $primaryImage,
                'is_primary' => true
            ]);

            // Tambahkan gambar tambahan
            if (isset($productData['additionalImages']) && is_array($productData['additionalImages'])) {
                foreach ($productData['additionalImages'] as $additionalImageFile) {
                    ProductImage::create([
                        'product_id' => $product->id,
                        'image' => $additionalImageFile, // Path sudah langsung dari $productData
                        'is_primary' => false
                    ]);
                }
            }
            
            // Setiap produk (kain motif) akan tersedia dalam semua ukuran kain yang didefinisikan
            foreach ($fabricSizes as $size) {
                ProductSize::create([
                    'product_id' => $product->id,
                    'size' => $size,
                    'stock' => rand(3, 10) 
                ]);
            }
            // $imageIndex++; // Jika ingin cycling berbeda di dalam loop
        }
    }
}