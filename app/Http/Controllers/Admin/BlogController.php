<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Blog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

class BlogController extends Controller
{
    // Menampilkan daftar blog
    public function index(Request $request)
    {
        $blogs = Blog::query()->latest()->get();

        // Mengambil kategori unik untuk filter
        $categories = Blog::select('category')->distinct()->pluck('category');

        return Inertia::render('Admin/Blogs/Index', [
            'blogs' => $blogs,
            'categories' => $categories,
        ]);
    }

    // Menampilkan form tambah blog
    public function create()
    {
        return Inertia::render('Admin/Blogs/Create');
    }

    // Menyimpan blog baru ke database
    public function store(Request $request)
    {
        // Validasi input
        $request->validate([
            'title' => 'required|string|max:255',
            'excerpt' => 'required|string|max:500',
            'content' => 'required|string',
            'category' => 'required|string|max:100',
            'author' => 'required|string|max:100',
            'image' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        // Membuat slug unik dari judul
        $slug = Str::slug($request->title);
        $originalSlug = $slug;
        $count = 1;

        // Pastikan slug unik
        while (Blog::where('slug', $slug)->exists()) {
            $slug = $originalSlug . '-' . $count++;
        }

        // Simpan gambar
        $imagePath = null;
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('blogs', 'public');
        }

        // Simpan data blog
        Blog::create([
            'title' => $request->title,
            'slug' => $slug,
            'excerpt' => $request->excerpt,
            'content' => $request->content,
            'category' => $request->category,
            'author' => $request->author,
            'image' => $imagePath,
        ]);

        return redirect()->route('admin.blogs.index')
            ->with('success', 'Blog post created successfully');
    }

    // Menampilkan detail blog
    public function show($id)
    {
        $blog = Blog::findOrFail($id);

        return Inertia::render('Admin/Blogs/Show', [
            'blog' => $blog,
        ]);
    }

    // Menampilkan form edit blog
    public function edit($id)
    {
        $blog = Blog::findOrFail($id);

        return Inertia::render('Admin/Blogs/Edit', [
            'blog' => $blog,
        ]);
    }

    // Update data blog
    public function update(Request $request, $id)
    {
        // Validasi input
        $request->validate([
            'title' => 'required|string|max:255',
            'excerpt' => 'required|string|max:500',
            'content' => 'required|string',
            'category' => 'required|string|max:100',
            'author' => 'required|string|max:100',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $blog = Blog::findOrFail($id);

        // Update slug jika judul berubah
        if ($blog->title !== $request->title) {
            $slug = Str::slug($request->title);
            $originalSlug = $slug;
            $count = 1;

            // Pastikan slug unik
            while (Blog::where('slug', $slug)->where('id', '!=', $id)->exists()) {
                $slug = $originalSlug . '-' . $count++;
            }
            
            $blog->slug = $slug;
        }

        // Update gambar jika ada
        if ($request->hasFile('image')) {
            // Hapus gambar lama
            if ($blog->image && Storage::disk('public')->exists($blog->image)) {
                Storage::disk('public')->delete($blog->image);
            }

            $imagePath = $request->file('image')->store('blogs', 'public');
            $blog->image = $imagePath;
        }

        // Update data blog
        $blog->title = $request->title;
        $blog->excerpt = $request->excerpt;
        $blog->content = $request->content;
        $blog->category = $request->category;
        $blog->author = $request->author;
        $blog->save();

        return redirect()->route('admin.blogs.index')
            ->with('success', 'Blog post updated successfully');
    }

    // Menghapus blog
    public function destroy($id)
    {
        $blog = Blog::findOrFail($id);

        // Hapus gambar jika ada
        if ($blog->image && Storage::disk('public')->exists($blog->image)) {
            Storage::disk('public')->delete($blog->image);
        }

        $blog->delete();

        return redirect()->route('admin.blogs.index')
            ->with('success', 'Blog post deleted successfully');
    }
}
