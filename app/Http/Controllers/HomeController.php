<?php

namespace App\Http\Controllers;

use App\Models\Blog;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class HomeController extends Controller
{
    /**
     * Menampilkan halaman utama (beranda) website.
     */
    public function index()
    {
        // Ambil 3 produk unggulan secara acak
        $featuredProducts = Product::with(['images', 'sizes'])
            ->inRandomOrder()
            ->take(3)
            ->get()
            ->map(function ($product) {
                // Tambahkan URL gambar utama
                $product->image = $product->image ? asset('storage/' . $product->image) : null;
                // Transformasi gambar produk jika ada
                if ($product->images) {
                    $product->images->transform(function ($image) {
                        $image->image = asset('storage/' . $image->image);
                        return $image;
                    });
                }
                return $product;
            });

        // Ambil 3 blog terbaru
        $latestBlogs = Blog::latest()
            ->take(3)
            ->get()
            ->map(function ($blog) {
                $blog->image = $blog->image ? asset('storage/' . $blog->image) : null;
                return $blog;
            });

        // Kirim data ke halaman beranda
        return Inertia::render('Index', [
            'featuredProducts' => $featuredProducts,
            'latestBlogs' => $latestBlogs,
        ]);
    }
}
