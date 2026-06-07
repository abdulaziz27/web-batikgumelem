<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\ProductImage;
use App\Models\ProductSize;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

class ProductController extends Controller
{
    // Menampilkan daftar produk
    public function index()
    {
        $products = Product::with('sizes')
            ->select('id', 'name', 'slug', 'price', 'is_active', 'image')
            ->latest()
            ->get()
            ->map(function ($product) {
                return [
                    'id' => $product->id,
                    'name' => $product->name,
                    'slug' => $product->slug,
                    'price' => $product->price,
                    'total_stock' => $product->total_stock, // Menggunakan accessor dari model
                    'is_active' => $product->is_active,
                    'image_url' => $product->image ? asset('storage/' . $product->image) : null,
                ];
            });

        return Inertia::render('Admin/Products/Index', [
            'products' => $products,
        ]);
    }

    // Menampilkan form tambah produk
    public function create()
    {
        return Inertia::render('Admin/Products/Create');
    }

    // Menyimpan produk baru ke database
    public function store(Request $request)
    {
        // Validasi input
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:products',
            'description' => 'required|string',
            'price' => 'required|numeric|min:0',
            'is_active' => 'boolean',
            'new_images' => 'required|array|min:1|max:6',
            'new_images.*' => 'image|max:2048',
            'sizes' => 'required|array|min:1',
            'sizes.*.size' => 'required|string',
            'sizes.*.stock' => 'required|integer|min:0',
        ], [
            'new_images.max' => 'Maksimal 6 gambar yang boleh diunggah.'
        ]);

        // Simpan data produk dan relasi dalam transaksi database
        return DB::transaction(function () use ($request, $validated) {
            // Buat produk
            $product = Product::create([
                'name' => $validated['name'],
                'slug' => $validated['slug'],
                'description' => $validated['description'],
                'price' => $validated['price'],
                'is_active' => $validated['is_active'] ?? true,
            ]);

            // Proses gambar produk
            if ($request->hasFile('new_images')) {
                foreach ($request->file('new_images') as $index => $image) {
                    $path = $image->store('products', 'public');
                    
                    $isPrimary = $index === 0; // Gambar pertama jadi utama
                    
                    ProductImage::create([
                        'product_id' => $product->id,
                        'image' => $path,
                        'is_primary' => $isPrimary,
                    ]);

                    // Set gambar utama ke field image produk
                    if ($isPrimary) {
                        $product->update(['image' => $path]);
                    }
                }
            }

            // Proses ukuran produk
            foreach ($validated['sizes'] as $sizeData) {
                ProductSize::create([
                    'product_id' => $product->id,
                    'size' => $sizeData['size'],
                    'stock' => $sizeData['stock'],
                ]);
            }

            return redirect()->route('admin.products.index')
                ->with('success', 'Product created successfully');
        });
    }

    // Menampilkan detail produk
    public function show($id)
    {
        $product = Product::with(['images', 'sizes'])->findOrFail($id);
        
        // Tambahkan image_url ke produk utama
        $product->image_url = $product->image ? asset('storage/' . $product->image) : null;
        
        // Tambahkan image_url ke semua gambar
        $product->images->transform(function ($image) {
            $image->image_url = asset('storage/' . $image->image);
            return $image;
        });
            
        return Inertia::render('Admin/Products/Show', [
            'product' => $product,
        ]);
    }

    // Menampilkan form edit produk
    public function edit($id)
    {
        $product = Product::with(['images', 'sizes'])->findOrFail($id);
        
        // Tambahkan image_url ke produk utama
        $product->image_url = $product->image ? asset('storage/' . $product->image) : null;
        
        // Tambahkan image_url ke semua gambar
        $product->images->transform(function ($image) {
            $image->image_url = asset('storage/' . $image->image);
            return $image;
        });
        
        return Inertia::render('Admin/Products/Edit', [
            'product' => $product,
        ]);
    }

    // Update data produk
    public function update(Request $request, $id)
    {
        $product = Product::findOrFail($id);
        
        // Validasi input
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:products,slug,'.$id,
            'description' => 'required|string',
            'price' => 'required|numeric|min:0',
            'is_active' => 'sometimes|boolean',
            'new_images' => 'nullable|array|max:6',
            'new_images.*' => 'nullable|image|max:2048',
            'sizes' => 'required|array|min:1',
            'sizes.*.id' => 'nullable|integer|exists:product_sizes,id,product_id,'.$product->id,
            'sizes.*.size' => 'required|string',
            'sizes.*.stock' => 'required|integer|min:0',
            'deleted_image_ids' => 'nullable|array',
            'deleted_image_ids.*' => 'nullable|integer|exists:product_images,id,product_id,'.$product->id,
            'primary_image_id' => 'nullable|integer',
        ], [
            'new_images.max' => 'Maksimal 6 gambar yang boleh diunggah.'
        ]);

        // Simpan update produk dan relasi dalam transaksi database
        return DB::transaction(function () use ($request, $product, $validated) {
            // Update data produk
            $product->update([
                'name' => $validated['name'],
                'slug' => $validated['slug'],
                'description' => $validated['description'],
                'price' => $validated['price'],
                'is_active' => $validated['is_active'] ?? $product->is_active,
            ]);

            // Hapus gambar jika diminta
            if ($request->has('deleted_image_ids') && is_array($request->deleted_image_ids)) {
                foreach ($request->deleted_image_ids as $imageId) {
                    $image = ProductImage::where('product_id', $product->id)
                        ->where('id', $imageId)
                        ->first();

                    if ($image) {
                        if (Storage::disk('public')->exists($image->image)) {
                            Storage::disk('public')->delete($image->image);
                        }
                        $image->delete();
                    }
                }
            }

            // Proses gambar baru
            if ($request->hasFile('new_images')) {
                foreach ($request->file('new_images') as $image) {
                    $path = $image->store('products', 'public');
                    
                    ProductImage::create([
                        'product_id' => $product->id,
                        'image' => $path,
                        'is_primary' => false,
                    ]);
                }
            }

            // Handle primary image setting
            if ($request->has('primary_image_id')) {
                // First, remove primary status from all images
                ProductImage::where('product_id', $product->id)
                    ->update(['is_primary' => false]);

                $primaryImage = ProductImage::where('product_id', $product->id)
                    ->where('id', $request->primary_image_id)
                    ->first();

                if ($primaryImage) {
                    $primaryImage->update(['is_primary' => true]);
                    $product->update(['image' => $primaryImage->image]);
                }
            }

            // Update sizes
            if ($request->has('sizes') && is_array($request->sizes)) {
                // Get current size IDs to determine which ones were removed
                $currentSizeIds = $product->sizes->pluck('id')->toArray();
                $updatedSizeIds = [];

                foreach ($request->sizes as $sizeData) {
                    if (isset($sizeData['id'])) {
                        // Update existing size
                        $size = ProductSize::where('id', $sizeData['id'])
                            ->where('product_id', $product->id)
                            ->first();
                        
                        if ($size) {
                            $size->update([
                                'size' => $sizeData['size'],
                                'stock' => $sizeData['stock'],
                            ]);
                            $updatedSizeIds[] = $size->id;
                        }
                    } else {
                        // Create new size
                        $newSize = ProductSize::create([
                            'product_id' => $product->id,
                            'size' => $sizeData['size'],
                            'stock' => $sizeData['stock'],
                        ]);
                        $updatedSizeIds[] = $newSize->id;
                    }
                }

                // Delete sizes that were not included in the update
                $sizesToDelete = array_diff($currentSizeIds, $updatedSizeIds);
                ProductSize::whereIn('id', $sizesToDelete)->delete();
            }

            return redirect()->route('admin.products.index')
                ->with('success', 'Product updated successfully');
        });
    }

    public function destroy($id)
    {
        $product = Product::findOrFail($id);

        // Soft delete product only
        $product->delete();

        return redirect()->route('admin.products.index')
            ->with('success', 'Produk berhasil dihapus (soft delete).');
    }
}
