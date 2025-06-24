<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Product::query()->with(['images', 'sizes']);

        // Handle search
        if ($request->has('search')) {
            $search = $request->input('search');
            $query->where('name', 'like', "%{$search}%")
                ->orWhere('description', 'like', "%{$search}%");
        }

        // Handle price filtering
        if ($request->has('min_price') && $request->has('max_price')) {
            $query->whereBetween('price', [$request->input('min_price'), $request->input('max_price')]);
        }

        // Handle sorting
        if ($request->has('sort')) {
            switch ($request->input('sort')) {
                case 'price_asc':
                    $query->orderBy('price', 'asc');
                    break;
                case 'price_desc':
                    $query->orderBy('price', 'desc');
                    break;
                case 'name_asc':
                    $query->orderBy('name', 'asc');
                    break;
                case 'name_desc':
                    $query->orderBy('name', 'desc');
                    break;
                default:
                    $query->orderBy('created_at', 'desc');
            }
        } else {
            $query->orderBy('created_at', 'desc');
        }

        $products = $query->paginate(15)->through(function ($product) {
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
        })->withQueryString();

        return Inertia::render('Products', [
            'products' => $products,
            'filters' => $request->only(['search', 'min_price', 'max_price', 'sort']),
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
     * Display the specified resource.
     */
    public function show($slug)
    {
        $product = Product::where('slug', $slug)
            ->with(['images', 'sizes'])
            ->firstOrFail();

        // Add image_url to main product
        $product->image = $product->image ? asset('storage/' . $product->image) : null;
        
        // Add image_url to all images
        $product->images->transform(function ($image) {
            $image->image = asset('storage/' . $image->image);
            return $image;
        });

        $relatedProducts = Product::where('id', '!=', $product->id)
            ->with('sizes')
            ->inRandomOrder()
            ->take(3)
            ->get()
            ->transform(function ($product) {
                $product->image = asset('storage/' . $product->image);
                return $product;
            });

        return Inertia::render('ProductDetail', [
            'product' => $product,
            'relatedProducts' => $relatedProducts
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Product $product)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Product $product)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Product $product)
    {
        //
    }
}
