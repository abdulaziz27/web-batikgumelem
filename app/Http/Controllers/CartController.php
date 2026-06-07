<?php

namespace App\Http\Controllers;

use App\Services\CartService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CartController extends Controller
{
    protected $cartService;

    // Konstruktor untuk dependency injection CartService
    public function __construct(CartService $cartService)
    {
        $this->cartService = $cartService;
    }

    /**
     * Menampilkan halaman keranjang belanja.
     */
    public function index()
    {
        $cart = $this->cartService->getCart();
        return Inertia::render('Cart', [
            'cart' => $cart,
        ]);
    }

    /**
     * Mengambil data keranjang dalam format JSON (tanpa navigasi halaman).
     */
    public function getData()
    {
        $cart = $this->cartService->getCart();
        return response()->json(['cart' => $cart]);
    }

    /**
     * Menambah produk ke keranjang belanja.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer|min:1',
            'size' => 'nullable|string',
        ]);
        
        $result = $this->cartService->addToCart($validated['product_id'], $validated['quantity'], $validated['size'] ?? null);
        
        if ($result['success']) {
            return back()->with('success', $result['message']);
        } else {
            return back()->with('error', $result['message']);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Mengupdate jumlah item di keranjang.
     */
    public function update(Request $request)
    {
        $request->validate([
            'item_key' => 'required|string',
            'quantity' => 'required|integer|min:1',
        ]);
        
        $result = $this->cartService->updateCartItem($request->item_key, $request->quantity);
        
        if ($result['success']) {
            return Inertia::render('Cart', [
                'cart' => $result['cart'],
                'success' => $result['message'],
            ]);
        } else {
            return Inertia::render('Cart', [
                'cart' => $result['cart'],
                'error' => $result['message'],
            ]);
        }
    }

    /**
     * Menghapus item dari keranjang.
     */
    public function destroy(Request $request)
    {
        $request->validate([
            'item_key' => 'required|string',
        ]);
        
        $result = $this->cartService->removeCartItem($request->item_key);
        
        if ($result['success']) {
            return Inertia::render('Cart', [
                'cart' => $result['cart'],
                'success' => $result['message'],
            ]);
        } else {
            return Inertia::render('Cart', [
                'cart' => $result['cart'],
                'error' => $result['message'],
            ]);
        }
    }

    /**
     * Mengosongkan seluruh keranjang belanja.
     */
    public function clear()
    {
        $result = $this->cartService->clearCart();
        return back()->with('message', 'Keranjang belanja berhasil dikosongkan.');
    }
}