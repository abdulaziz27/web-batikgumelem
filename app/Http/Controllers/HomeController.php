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
            ->get();

        // Get 3 latest blog posts
        $latestBlogs = Blog::latest()
            ->take(3)
            ->get();

        return Inertia::render('Index', [
            'featuredProducts' => $featuredProducts,
            'latestBlogs' => $latestBlogs,
        ]);
    }
}
