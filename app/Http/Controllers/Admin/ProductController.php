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
    public function index()
    {
        $products = Product::select('id', 'name', 'slug', 'price', 'stock', 'is_active', 'image')
            ->latest()
            ->get()
            ->map(function ($product) {
                return [
                    'id' => $product->id,
                    'name' => $product->name,
                    'slug' => $product->slug,
                    'price' => $product->price,
                    'stock' => $product->stock,
                    'is_active' => $product->is_active,
                    'image_url' => $product->image ? asset('storage/' . $product->image) : null,
                ];
            });

        return Inertia::render('Admin/Products/Index', [
            'products' => $products,
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Products/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:products',
            'description' => 'required|string',
            'price' => 'required|numeric|min:0',
            'stock' => 'required|integer|min:0',
            'is_active' => 'boolean',
            'new_images' => 'required|array|min:1',
            'new_images.*' => 'image|max:2048',
            'sizes' => 'nullable|array',
            'sizes.*.size' => 'required|string',
            'sizes.*.stock' => 'required|integer|min:0',
        ]);

        return DB::transaction(function () use ($request, $validated) {
            // Create product
            $product = Product::create([
                'name' => $validated['name'],
                'slug' => $validated['slug'],
                'description' => $validated['description'],
                'price' => $validated['price'],
                'stock' => $validated['stock'],
                'is_active' => $validated['is_active'] ?? true,
            ]);

            // Process images
            if ($request->hasFile('new_images')) {
                foreach ($request->file('new_images') as $index => $image) {
                    $path = $image->store('products', 'public');
                    
                    $isPrimary = $index === 0; // First image is primary by default
                    
                    ProductImage::create([
                        'product_id' => $product->id,
                        'image' => $path,
                        'is_primary' => $isPrimary,
                    ]);

                    // Set the primary image as the product's main image
                    if ($isPrimary) {
                        $product->update(['image' => $path]);
                    }
                }
            }

            // Process sizes if provided
            if ($request->has('sizes') && is_array($request->sizes)) {
                foreach ($request->sizes as $sizeData) {
                    ProductSize::create([
                        'product_id' => $product->id,
                        'size' => $sizeData['size'],
                        'stock' => $sizeData['stock'],
                    ]);
                }
            }

            return redirect()->route('admin.products.index')
                ->with('success', 'Product created successfully');
        });
    }

    public function show($id)
    {
        $product = Product::with(['images', 'sizes'])->findOrFail($id);
        
        // Add image_url to main product
        $product->image_url = $product->image ? asset('storage/' . $product->image) : null;
        
        // Add image_url to all images
        $product->images->transform(function ($image) {
            $image->image_url = asset('storage/' . $image->image);
            return $image;
        });
            
        return Inertia::render('Admin/Products/Show', [
            'product' => $product,
        ]);
    }

    public function edit($id)
    {
        $product = Product::with(['images', 'sizes'])->findOrFail($id);
        
        // Add image_url to main product
        $product->image_url = $product->image ? asset('storage/' . $product->image) : null;
        
        // Add image_url to all images
        $product->images->transform(function ($image) {
            $image->image_url = asset('storage/' . $image->image);
            return $image;
        });
        
        return Inertia::render('Admin/Products/Edit', [
            'product' => $product,
        ]);
    }

    public function update(Request $request, $id)
    {
        $product = Product::findOrFail($id);
        
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:products,slug,'.$id,
            'description' => 'required|string',
            'price' => 'required|numeric|min:0',
            'stock' => 'required|integer|min:0',
            'is_active' => 'sometimes|boolean',
            'new_images' => 'nullable|array',
            'new_images.*' => 'nullable|image|max:2048',
            'sizes' => 'nullable|array',
            'sizes.*.id' => 'nullable|integer|exists:product_sizes,id,product_id,'.$product->id,
            'sizes.*.size' => 'required|string',
            'sizes.*.stock' => 'required|integer|min:0',
            'deleted_image_ids' => 'nullable|array',
            'deleted_image_ids.*' => 'nullable|integer|exists:product_images,id,product_id,'.$product->id,
            'primary_image_id' => 'nullable|integer',
        ]);

        return DB::transaction(function () use ($request, $product, $validated) {
            // Update basic product info
            $product->update([
                'name' => $validated['name'],
                'slug' => $validated['slug'],
                'description' => $validated['description'],
                'price' => $validated['price'],
                'stock' => $validated['stock'],
                'is_active' => $validated['is_active'] ?? $product->is_active,
            ]);

            // Delete images if requested
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

            // Process new images
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

        // Delete associated images from storage
        foreach ($product->images as $image) {
            if (Storage::disk('public')->exists($image->image)) {
                Storage::disk('public')->delete($image->image);
            }
        }

        // Delete product (sizes and images will be deleted via cascade)
        $product->delete();

        return redirect()->route('admin.products.index')
            ->with('success', 'Product deleted successfully');
    }
}
