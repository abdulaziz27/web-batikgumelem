<?php

namespace App\Http\Controllers;

use App\Models\Blog;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class HomeController extends Controller
{
    /**
     * Display the home page.
     */
    public function index()
    {
        // Get 3 featured products
        $featuredProducts = Product::with(['images'])
            ->inRandomOrder()
            ->take(3)
            ->get()
            ->map(function ($product) {
                // Transform the product to include proper image URL
                $product->image = $product->image ? asset('storage/' . $product->image) : null;
                
                // Transform product images if they exist
                if ($product->images) {
                    $product->images->transform(function ($image) {
                        $image->image = asset('storage/' . $image->image);
                        return $image;
                    });
                }
                
                return $product;
            });

        // Get 3 latest blog posts
        $latestBlogs = Blog::latest()
            ->take(3)
            ->get()
            ->map(function ($blog) {
                $blog->image = $blog->image ? asset('storage/' . $blog->image) : null;
                return $blog;
            });

        return Inertia::render('Index', [
            'featuredProducts' => $featuredProducts,
            'latestBlogs' => $latestBlogs,
        ]);
    }
}
