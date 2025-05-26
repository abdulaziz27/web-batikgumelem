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
        $products = [
            [
                'name' => 'Batik Tulis Motif Semen Rama',
                'description' => 'Batik tulis premium dengan motif Semen Rama yang menggambarkan kesuburan dan kemakmuran. Dibuat oleh pengrajin batik berpengalaman menggunakan pewarna alami dan kain katun berkualitas tinggi.',
                'price' => 850000,
                'image' => 'https://images.unsplash.com/photo-1531402406710-52d0323bee69?q=80&w=1887',
                'additionalImages' => [
                    'https://images.unsplash.com/photo-1577155581964-fa2c1862e10a?q=80&w=1887',
                    'https://images.unsplash.com/photo-1607063523557-508730b30f11?q=80&w=1887'
                ]
            ],
            [
                'name' => 'Batik Tulis Motif Sekar Jagad',
                'description' => 'Batik tulis dengan motif Sekar Jagad yang melambangkan keberagaman dunia. Dibuat dengan teknik tradisional dan pewarna alami.',
                'price' => 950000,
                'image' => 'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?q=80&w=1887',
                'additionalImages' => [
                    'https://images.unsplash.com/photo-1615915016361-e4975a48f2db?q=80&w=1824',
                    'https://images.unsplash.com/photo-1559857184-403bece90315?q=80&w=2069'
                ]
            ],
            [
                'name' => 'Batik Cap Motif Parang',
                'description' => 'Batik cap dengan motif Parang klasik, simbol kekuatan dan ketangguhan. Menggunakan teknik cap tradisional dengan pewarna berkualitas.',
                'price' => 450000,
                'image' => 'https://images.unsplash.com/photo-1615915016361-e4975a48f2db?q=80&w=1824',
                'additionalImages' => [
                    'https://images.unsplash.com/photo-1607683814458-48abbdc84673?q=80&w=1887',
                    'https://images.unsplash.com/photo-1577155581964-fa2c1862e10a?q=80&w=1887'
                ]
            ],
            [
                'name' => 'Batik Tulis Motif Kawung',
                'description' => 'Batik tulis dengan motif Kawung yang melambangkan harapan dan kehidupan yang sempurna. Dibuat dengan ketelitian tinggi.',
                'price' => 750000,
                'image' => 'https://images.unsplash.com/photo-1559857184-403bece90315?q=80&w=2069',
                'additionalImages' => [
                    'https://images.unsplash.com/photo-1551542208-9e5cdca1a2dc?q=80&w=2070',
                    'https://images.unsplash.com/photo-1534687713463-aee8aaf6ccd2?q=80&w=1887'
                ]
            ],
            [
                'name' => 'Batik Kombinasi Motif Liris',
                'description' => 'Batik kombinasi tulis dan cap dengan motif Liris yang menggambarkan hujan rintik-rintik. Perpaduan teknik tradisional yang unik.',
                'price' => 550000,
                'image' => 'https://images.unsplash.com/photo-1551542208-9e5cdca1a2dc?q=80&w=2070',
                'additionalImages' => [
                    'https://images.unsplash.com/photo-1607063523557-508730b30f11?q=80&w=1887',
                    'https://images.unsplash.com/photo-1531402406710-52d0323bee69?q=80&w=1887'
                ]
            ],
            [
                'name' => 'Kemeja Batik Gumelem',
                'description' => 'Kemeja batik premium dengan motif khas Gumelem, cocok untuk acara formal dan kasual. Bahan berkualitas dan nyaman dipakai.',
                'price' => 350000,
                'image' => 'https://images.unsplash.com/photo-1607063523557-508730b30f11?q=80&w=1887',
                'additionalImages' => [
                    'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=1887',
                    'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?q=80&w=1887'
                ]
            ],
            [
                'name' => 'Batik Cap Motif Sidomukti',
                'description' => 'Batik cap dengan motif Sidomukti yang melambangkan kemakmuran dan kebahagiaan. Teknik cap tradisional dengan pewarna berkualitas.',
                'price' => 480000,
                'image' => 'https://images.unsplash.com/photo-1607683814458-48abbdc84673?q=80&w=1887',
                'additionalImages' => [
                    'https://images.unsplash.com/photo-1615915016361-e4975a48f2db?q=80&w=1824',
                    'https://images.unsplash.com/photo-1534687713463-aee8aaf6ccd2?q=80&w=1887'
                ]
            ],
            [
                'name' => 'Batik Kombinasi Motif Truntum',
                'description' => 'Batik kombinasi dengan motif Truntum yang melambangkan cinta yang tumbuh kembali. Perpaduan teknik tulis dan cap yang indah.',
                'price' => 600000,
                'image' => 'https://images.unsplash.com/photo-1577155581964-fa2c1862e10a?q=80&w=1887',
                'additionalImages' => [
                    'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?q=80&w=1887',
                    'https://images.unsplash.com/photo-1551542208-9e5cdca1a2dc?q=80&w=2070'
                ]
            ],
            [
                'name' => 'Dress Batik Modern',
                'description' => 'Dress modern dengan bahan batik Gumelem, cocok untuk acara formal maupun casual. Desain kontemporer dengan sentuhan tradisional.',
                'price' => 425000,
                'image' => 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=1887',
                'additionalImages' => [
                    'https://images.unsplash.com/photo-1607063523557-508730b30f11?q=80&w=1887',
                    'https://images.unsplash.com/photo-1607683814458-48abbdc84673?q=80&w=1887'
                ]
            ],
            [
                'name' => 'Batik Tulis Motif Parang Kusuma',
                'description' => 'Batik tulis dengan motif Parang Kusuma, menggambarkan kekuatan dan keteguhan. Dibuat dengan teknik tradisional tingkat tinggi.',
                'price' => 800000,
                'image' => 'https://images.unsplash.com/photo-1534687713463-aee8aaf6ccd2?q=80&w=1887',
                'additionalImages' => [
                    'https://images.unsplash.com/photo-1577155581964-fa2c1862e10a?q=80&w=1887',
                    'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?q=80&w=1887'
                ]
            ]
        ];

        $sizes = ['S', 'M', 'L', 'XL'];

        foreach ($products as $productData) {
            // Buat produk
            $product = Product::create([
                'name' => $productData['name'],
                'slug' => Str::slug($productData['name']),
                'description' => $productData['description'],
                'price' => $productData['price'],
                'stock' => rand(10, 50),
                'image' => $productData['image'],
            ]);

            // Tambahkan gambar utama
            ProductImage::create([
                'product_id' => $product->id,
                'image' => $productData['image'],
                'is_primary' => true
            ]);

            // Tambahkan gambar tambahan
            foreach ($productData['additionalImages'] as $additionalImage) {
                ProductImage::create([
                    'product_id' => $product->id,
                    'image' => $additionalImage,
                    'is_primary' => false
                ]);
            }

            // Tambahkan ukuran untuk produk
            foreach ($sizes as $size) {
                ProductSize::create([
                    'product_id' => $product->id,
                    'size' => $size,
                    'stock' => rand(5, 20)
                ]);
            }
        }
    }
}
