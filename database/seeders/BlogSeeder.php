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
        $blogs = [
            [
                'title' => 'Sejarah Motif Batik Gumelem yang Kaya akan Filosofi',
                'slug' => Str::slug('Sejarah Motif Batik Gumelem yang Kaya akan Filosofi'),
                'excerpt' => 'Mengenal lebih dalam berbagai motif batik Gumelem Banjarnegara dan makna filosofis di balik setiap motifnya.',
                'content' => 'Batik Gumelem adalah salah satu warisan budaya Indonesia yang berasal dari Desa Gumelem, Kabupaten Banjarnegara, Jawa Tengah. Batik ini memiliki keunikan dan keindahan yang khas, dengan motif-motif yang sarat akan makna filosofis.

Sejarah batik Gumelem tidak lepas dari keberadaan Kadipaten Gumelem yang merupakan wilayah bawahan Kerajaan Mataram. Konon, batik Gumelem sudah ada sejak abad ke-17, pada masa pemerintahan Sultan Agung Hanyokrokusumo.',
                'image' => 'https://images.unsplash.com/photo-1534687713463-aee8aaf6ccd2?q=80&w=1887',
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
                'image' => 'https://images.unsplash.com/photo-1607063523557-508730b30f11?q=80&w=1887',
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
                'image' => 'https://images.unsplash.com/photo-1568289489713-d4397e1c01ce?q=80&w=1887',
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
                'image' => 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=1887',
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
                'image' => 'https://images.unsplash.com/photo-1577155581964-fa2c1862e10a?q=80&w=1887',
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
                'image' => 'https://images.unsplash.com/photo-1559857184-403bece90315?q=80&w=2069',
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
                'image' => 'https://images.unsplash.com/photo-1585944684602-f0195998a211?q=80&w=1887',
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
                'image' => 'https://images.unsplash.com/photo-1585944693766-3df48865ff15?q=80&w=1887',
                'category' => 'Inovasi',
                'author' => 'Abdul Aziz',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
        ];

        DB::table('blogs')->insert($blogs);
    }
}
