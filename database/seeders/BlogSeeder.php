<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class BlogSeeder extends Seeder
{
    public function run(): void
    {
        // Path gambar untuk blog (menggunakan prefix 'blogs/')
        $blogImg1 = 'blogs/dashboard_banner_image.png';
        $blogImg2 = 'blogs/dashboard_banner_image_2.png';
        $blogImg3 = 'blogs/dashboard_banner_image_3.png';
        $blogImg4 = 'blogs/dashboard_banner_image_4.png';

        $blogImageCycle = [$blogImg1, $blogImg2, $blogImg3, $blogImg4];
        $numBlogImageCycle = count($blogImageCycle);

        $blogs = [
            [
                'title' => 'Sejarah Motif Batik Gumelem yang Kaya akan Filosofi',
                'slug' => Str::slug('Sejarah Motif Batik Gumelem yang Kaya akan Filosofi'),
                'excerpt' => 'Mengenal lebih dalam berbagai motif batik Gumelem Banjarnegara dan makna filosofis di balik setiap motifnya.',
                'content' => 'Batik Gumelem adalah salah satu warisan budaya Indonesia yang berasal dari Desa Gumelem, Kabupaten Banjarnegara, Jawa Tengah. Batik ini memiliki keunikan dan keindahan yang khas, dengan motif-motif yang sarat akan makna filosofis.

Sejarah batik Gumelem tidak lepas dari keberadaan Kadipaten Gumelem yang merupakan wilayah bawahan Kerajaan Mataram. Konon, batik Gumelem sudah ada sejak abad ke-17, pada masa pemerintahan Sultan Agung Hanyokrokusumo.',
                'image' => $blogImageCycle[0 % $numBlogImageCycle],
                'category' => 'Sejarah',
                'author' => 'Abdul Aziz',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'title' => 'Proses Pembuatan Batik Tulis Gumelem',
                'slug' => Str::slug('Proses Pembuatan Batik Tulis Gumelem'),
                'excerpt' => 'Tahapan lengkap cara pembuatan batik tulis Gumelem secara tradisional yang memakan waktu berhari-hari.',
                'content' => 'Batik tulis Gumelem merupakan salah satu warisan budaya yang memiliki proses pembuatan sangat rumit dan membutuhkan ketelatenan. Proses dimulai dari pemilihan kain, membuat pola, mencanting, hingga pewarnaan.',
                'image' => $blogImageCycle[1 % $numBlogImageCycle],
                'category' => 'Teknik',
                'author' => 'Abdul Aziz',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'title' => 'Pelestarian Batik Gumelem di Era Modern',
                'slug' => Str::slug('Pelestarian Batik Gumelem di Era Modern'),
                'excerpt' => 'Upaya yang dilakukan komunitas dan pemerintah untuk melestarikan warisan budaya batik Gumelem.',
                'content' => 'Di era modern ini, pelestarian batik Gumelem menjadi tantangan tersendiri. Berbagai upaya dilakukan untuk mempertahankan keberadaan dan kearifan lokal batik tradisional ini.',
                'image' => $blogImageCycle[2 % $numBlogImageCycle],
                'category' => 'Budaya',
                'author' => 'Abdul Aziz',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'title' => 'Pewarna Alami dalam Batik Gumelem',
                'slug' => Str::slug('Pewarna Alami dalam Batik Gumelem'),
                'excerpt' => 'Mengenal jenis-jenis pewarna alami yang digunakan dalam pembuatan batik Gumelem.',
                'content' => 'Pewarna alami merupakan salah satu ciri khas batik Gumelem. Beragam tumbuhan dan bahan alam digunakan untuk menghasilkan warna-warna indah dan alami.',
                'image' => $blogImageCycle[3 % $numBlogImageCycle],
                'category' => 'Teknik',
                'author' => 'Abdul Aziz',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'title' => 'Motif Kontemporer Batik Gumelem',
                'slug' => Str::slug('Motif Kontemporer Batik Gumelem'),
                'excerpt' => 'Inovasi motif batik Gumelem yang dipadukan dengan unsur modern.',
                'content' => 'Batik Gumelem terus berkembang dengan menciptakan motif-motif kontemporer yang menarik, namun tetap mempertahankan filosofi dan ciri khas tradisionalnya.',
                'image' => $blogImageCycle[0 % $numBlogImageCycle], // (4 % 4 = 0)
                'category' => 'Inovasi',
                'author' => 'Abdul Aziz',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'title' => 'Komunitas Pengrajin Batik Gumelem',
                'slug' => Str::slug('Komunitas Pengrajin Batik Gumelem'),
                'excerpt' => 'Mengenal lebih dekat kehidupan para pengrajin batik Gumelem.',
                'content' => 'Komunitas pengrajin batik Gumelem memiliki peran penting dalam melestarikan dan mengembangkan seni batik tradisional ini.',
                'image' => $blogImageCycle[1 % $numBlogImageCycle], // (5 % 4 = 1)
                'category' => 'Komunitas',
                'author' => 'Abdul Aziz',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'title' => 'Filosofi Warna dalam Batik Gumelem',
                'slug' => Str::slug('Filosofi Warna dalam Batik Gumelem'),
                'excerpt' => 'Makna mendalam di balik setiap warna yang digunakan dalam batik Gumelem.',
                'content' => 'Setiap warna dalam batik Gumelem memiliki filosofi dan makna tersendiri, mencerminkan kearifan lokal masyarakat Banjarnegara.',
                'image' => $blogImageCycle[2 % $numBlogImageCycle], // (6 % 4 = 2)
                'category' => 'Sejarah',
                'author' => 'Abdul Aziz',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'title' => 'Batik Gumelem dalam Perspektif Global',
                'slug' => Str::slug('Batik Gumelem dalam Perspektif Global'),
                'excerpt' => 'Bagaimana batik Gumelem dikenal dan diapresiasi di kancah internasional.',
                'content' => 'Batik Gumelem tidak hanya menjadi warisan budaya lokal, namun telah mendapatkan pengakuan dan apresiasi di tingkat internasional.',
                'image' => $blogImageCycle[3 % $numBlogImageCycle], // (7 % 4 = 3)
                'category' => 'Inovasi',
                'author' => 'Abdul Aziz',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
        ];

        DB::table('blogs')->insert($blogs);
    }
}