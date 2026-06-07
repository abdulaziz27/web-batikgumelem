<?php

namespace App\Http\Controllers;

use App\Models\Blog;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BlogController extends Controller
{
    /**
     * Menampilkan daftar blog dengan fitur pencarian dan filter kategori.
     */
    public function index(Request $request)
    {
        $query = Blog::query();

        // Fitur pencarian blog
        if ($request->has('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('excerpt', 'like', "%{$search}%")
                    ->orWhere('content', 'like', "%{$search}%");
            });
        }

        // Fitur filter kategori
        if ($request->has('category')) {
            $query->where('category', $request->input('category'));
        }

        $blogs = $query->latest()->paginate(6);

        // Transformasi gambar blog agar URL bisa diakses frontend
        $blogs->through(function ($blog) {
            $blog->image = $blog->image ? asset('storage/' . $blog->image) : null;
            return $blog;
        });

        return Inertia::render('Blog', [
            'blogs' => $blogs,
            'filters' => $request->only(['search', 'category']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Menampilkan detail blog berdasarkan slug.
     */
    public function show($slug)
    {
        $blog = Blog::where('slug', $slug)->firstOrFail();
        
        // Tambahkan URL gambar yang benar
        $blog->image = $blog->image ? asset('storage/' . $blog->image) : null;

        // Ambil blog terkait berdasarkan kategori
        $relatedBlogs = Blog::where('id', '!=', $blog->id)
            ->where('category', $blog->category)
            ->latest()
            ->take(3)
            ->get()
            ->map(function ($blog) {
                $blog->image = $blog->image ? asset('storage/' . $blog->image) : null;
                return $blog;
            });

        return Inertia::render('BlogDetail', [
            'blog' => $blog,
            'relatedBlogs' => $relatedBlogs,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
