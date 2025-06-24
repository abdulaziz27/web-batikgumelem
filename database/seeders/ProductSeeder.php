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
        // Produk berdasarkan file gambar yang disediakan user
        $userProducts = [
            [
                'name' => 'Sida luhur',
                'slug' => Str::slug('Sida luhur'),
                'images' => ['sida_luhur.jpeg', 'sida_luhur_2.jpeg', 'sida_luhur_3.jpeg'],
            ],
            [
                'name' => 'Sida mukti',
                'slug' => Str::slug('Sida mukti'),
                'images' => ['sida_mukti.jpeg', 'sida_mukti_2.jpeg', 'sida_mukti_3.jpeg'],
            ],
            [
                'name' => 'Parang angkrik',
                'slug' => Str::slug('Parang angkrik'),
                'images' => ['parang_angkrik.jpeg', 'parang_angkrik_2.jpeg', 'parang_angkrik_3.jpeg'],
            ],
            [
                'name' => 'Waljinahan',
                'slug' => Str::slug('Waljinahan'),
                'images' => ['waljinahan.jpeg', 'waljinahan_2.jpeg', 'waljinahan_3.jpeg'],
            ],
            [
                'name' => 'Borobudur',
                'slug' => Str::slug('Borobudur'),
                'images' => ['borobudur.jpeg', 'borobudur_2.jpeg', 'borobudur_3.jpeg'],
            ],
            [
                'name' => 'Buntalan',
                'slug' => Str::slug('Buntalan'),
                'images' => ['buntalan.jpeg', 'buntalan_2.jpeg', 'buntalan_3.jpeg'],
            ],
            [
                'name' => 'Gajah uling',
                'slug' => Str::slug('Gajah uling'),
                'images' => ['gajah_uling.jpeg', 'gajah_uling_2.jpeg', 'gajah_uling_3.jpeg'],
            ],
            [
                'name' => 'Ganda suling',
                'slug' => Str::slug('Ganda suling'),
                'images' => ['ganda_suling.jpeg', 'ganda_suling_2.jpeg', 'ganda_suling_3.jpeg'],
            ],
            [
                'name' => 'Kembang asem',
                'slug' => Str::slug('Kembang asem'),
                'images' => ['kembang_asem.jpeg', 'kembang_asem_2.jpeg', 'kembang_asem_3.jpeg'],
            ],
            [
                'name' => 'Pasir luhur',
                'slug' => Str::slug('Pasir luhur'),
                'images' => ['pasir_luhur.jpeg', 'pasir_luhur_2.jpeg', 'pasir_luhur_3.jpeg'],
            ],
            [
                'name' => 'Pring sedapur',
                'slug' => Str::slug('Pring sedapur'),
                'images' => ['pring_sedapur.jpeg', 'pring_sedapur_2.jpeg', 'pring_sedapur_3.jpeg'],
            ],
            [
                'name' => 'Rujak senthe',
                'slug' => Str::slug('Rujak senthe'),
                'images' => ['rujak_senthe.jpeg', 'rujak_senthe_2.jpeg', 'rujak_senthe_3.jpeg'],
            ],
            [
                'name' => 'Udan liris',
                'slug' => Str::slug('Udan liris'),
                'images' => ['udan_liris.jpeg', 'udan_liris_2.jpeg', 'udan_liris_3.jpeg'],
            ],
        ];
        // Ukuran kain batik tulis (panjang x lebar)
        $fabricSizes = ['150cmx150cm'];
        foreach ($userProducts as $prod) {
            $mainImage = 'products/' . $prod['images'][0];
            $additionalImages = [
                'products/' . $prod['images'][1],
                'products/' . $prod['images'][2],
            ];
            $product = Product::create([
                'name' => $prod['name'],
                'slug' => $prod['slug'],
                'description' => 'Batik Gumelem motif ' . $prod['name'] . '. Kain batik tulis asli Gumelem.',
                'price' => rand(150000, 500000),
                'image' => $mainImage,
            ]);
            ProductImage::create([
                'product_id' => $product->id,
                'image' => $mainImage,
                'is_primary' => true
            ]);
            foreach ($additionalImages as $img) {
                ProductImage::create([
                    'product_id' => $product->id,
                    'image' => $img,
                    'is_primary' => false
                ]);
            }
            foreach ($fabricSizes as $size) {
                ProductSize::create([
                    'product_id' => $product->id,
                    'size' => $size,
                    'stock' => rand(3, 10)
                ]);
            }
        }
    }
}