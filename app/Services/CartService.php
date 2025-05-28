<?php

namespace App\Services;

use App\Models\Product;
use App\Models\ProductSize;
use App\Models\CartItem;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

class CartService
{
    public function getCart()
    {
        $user = Auth::user();
        Log::info('Getting cart', [
            'user_id' => $user ? $user->id : null,
            'is_authenticated' => Auth::check()
        ]);

        $items = CartItem::with('product')
            ->where('user_id', $user->id)
            ->get();

        Log::info('Cart items retrieved', [
            'items_count' => $items->count(),
            'user_id' => $user->id
        ]);

        $cartItems = [];
        $total = 0;
        foreach ($items as $item) {
            $cartItems[$item->getKeyString()] = [
                'id' => $item->product_id,
                'name' => $item->product->name,
                'price' => $item->product->price,
                'image' => $item->product->image,
                'quantity' => $item->quantity,
                'size' => $item->size,
                'slug' => $item->product->slug,
            ];
            $total += $item->product->price * $item->quantity;
        }

        Log::info('Cart data prepared', [
            'total_items' => count($cartItems),
            'total_price' => $total,
            'user_id' => $user->id
        ]);

        return [
            'items' => $cartItems,
            'total' => $total,
        ];
    }

    public function addToCart($productId, $quantity = 1, $size = null)
    {
        try {
            return DB::transaction(function () use ($productId, $quantity, $size) {
                $user = Auth::user();
                Log::info('Adding to cart - Start', [
                    'product_id' => $productId,
                    'quantity' => $quantity,
                    'size' => $size,
                    'user_id' => $user ? $user->id : null,
                    'is_authenticated' => Auth::check()
                ]);

                // Lock the product for update to prevent race conditions
                $product = Product::lockForUpdate()->findOrFail($productId);
                Log::info('Product found', [
                    'product_name' => $product->name,
                    'product_stock' => $product->stock,
                    'has_size' => !is_null($size)
                ]);

                if ($size) {
                    $productSize = ProductSize::lockForUpdate()
                        ->where('product_id', $productId)
                        ->where('size', $size)
                        ->first();

                    Log::info('Size check', [
                        'size_found' => !is_null($productSize),
                        'size_stock' => $productSize ? $productSize->stock : 0,
                        'requested_quantity' => $quantity
                    ]);

                    if (!$productSize || $productSize->stock < $quantity) {
                        Log::warning('Stock not available for size', [
                            'product_id' => $productId,
                            'size' => $size,
                            'requested_quantity' => $quantity,
                            'available_stock' => $productSize ? $productSize->stock : 0
                        ]);
                        return [
                            'success' => false,
                            'message' => 'Stok tidak tersedia untuk ukuran yang dipilih',
                        ];
                    }

                    // Check existing cart items to validate total quantity
                    $existingCartItem = CartItem::where('user_id', $user->id)
                        ->where('product_id', $productId)
                        ->where('size', $size)
                        ->first();

                    $totalQuantity = ($existingCartItem ? $existingCartItem->quantity : 0) + $quantity;

                    if ($totalQuantity > $productSize->stock) {
                        return [
                            'success' => false,
                            'message' => 'Total quantity melebihi stok yang tersedia',
                        ];
                    }
                } else {
                    // Check existing cart items to validate total quantity
                    $existingCartItem = CartItem::where('user_id', $user->id)
                        ->where('product_id', $productId)
                        ->where('size', null)
                        ->first();

                    $totalQuantity = ($existingCartItem ? $existingCartItem->quantity : 0) + $quantity;

                    if ($totalQuantity > $product->stock) {
                        Log::warning('Total quantity exceeds available stock', [
                            'product_id' => $productId,
                            'total_quantity' => $totalQuantity,
                            'available_stock' => $product->stock
                        ]);
                        return [
                            'success' => false,
                            'message' => 'Total quantity melebihi stok yang tersedia',
                        ];
                    }
                }

                $cartItem = CartItem::where('user_id', $user->id)
                    ->where('product_id', $productId)
                    ->where('size', $size)
                    ->first();

                Log::info('Existing cart item check', [
                    'item_exists' => !is_null($cartItem),
                    'current_quantity' => $cartItem ? $cartItem->quantity : 0,
                    'new_quantity' => $quantity
                ]);

                if ($cartItem) {
                    $cartItem->quantity += $quantity;
                    $cartItem->save();
                    Log::info('Updated existing cart item', [
                        'cart_item_id' => $cartItem->id,
                        'new_quantity' => $cartItem->quantity
                    ]);
                } else {
                    $cartItem = CartItem::create([
                        'user_id' => $user->id,
                        'product_id' => $productId,
                        'quantity' => $quantity,
                        'size' => $size,
                    ]);
                    Log::info('Created new cart item', [
                        'cart_item_id' => $cartItem->id,
                        'quantity' => $quantity
                    ]);
                }

                $cart = $this->getCart();
                Log::info('Cart updated successfully', [
                    'total_items' => count($cart['items']),
                    'total_price' => $cart['total']
                ]);

                return [
                    'success' => true,
                    'message' => 'Produk berhasil ditambahkan ke keranjang',
                    'cart' => $cart,
                ];
            });
        } catch (\Exception $e) {
            Log::error('Error adding to cart', [
                'error' => $e->getMessage(),
                'product_id' => $productId,
                'quantity' => $quantity,
                'size' => $size
            ]);

            return [
                'success' => false,
                'message' => 'Gagal menambahkan produk ke keranjang',
            ];
        }
    }

    public function updateCartItem($itemKey, $quantity)
    {
        try {
            return DB::transaction(function () use ($itemKey, $quantity) {
                $user = Auth::user();
                [$productId, $size] = explode('-', $itemKey) + [null, null];

                // Lock the product for update
                $product = Product::lockForUpdate()->findOrFail($productId);

                if ($size) {
                    $productSize = ProductSize::lockForUpdate()
                        ->where('product_id', $productId)
                        ->where('size', $size)
                        ->first();

                    if (!$productSize || $productSize->stock < $quantity) {
                        return [
                            'success' => false,
                            'message' => 'Stok tidak tersedia untuk ukuran yang dipilih',
                        ];
                    }
                } else if ($product->stock < $quantity) {
                    return [
                        'success' => false,
                        'message' => 'Stok produk tidak mencukupi',
                    ];
                }

                $cartItem = CartItem::where('user_id', $user->id)
                    ->where('product_id', $productId)
                    ->where('size', $size)
                    ->first();

                if (!$cartItem) {
                    return [
                        'success' => false,
                        'message' => 'Item tidak ditemukan di keranjang',
                    ];
                }

                $cartItem->quantity = $quantity;
                $cartItem->save();

                return [
                    'success' => true,
                    'message' => 'Keranjang berhasil diperbarui',
                    'cart' => $this->getCart(),
                ];
            });
        } catch (\Exception $e) {
            Log::error('Error updating cart item', [
                'error' => $e->getMessage(),
                'item_key' => $itemKey,
                'quantity' => $quantity
            ]);

            return [
                'success' => false,
                'message' => 'Gagal memperbarui keranjang',
            ];
        }
    }

    public function removeCartItem($itemKey)
    {
        $user = Auth::user();
        [$productId, $size] = explode('-', $itemKey) + [null, null];
        $cartItem = CartItem::where('user_id', $user->id)
            ->where('product_id', $productId)
            ->where('size', $size)
            ->first();
        if ($cartItem) {
            $cartItem->delete();
            return [
                'success' => true,
                'message' => 'Item removed from cart',
                'cart' => $this->getCart(),
            ];
        }
        return [
            'success' => false,
            'message' => 'Item not found in cart',
        ];
    }

    public function clearCart()
    {
        $user = Auth::user();
        CartItem::where('user_id', $user->id)->delete();
        return [
            'success' => true,
            'message' => 'Cart cleared',
            'cart' => $this->getCart(),
        ];
    }

    public function applyCoupon($couponCode)
    {
        $coupon = \App\Models\Coupon::where('code', $couponCode)
            ->where('active', true)
            ->where('valid_from', '<=', now())
            ->where('valid_until', '>=', now())
            ->first();
        if (!$coupon) {
            return [
                'success' => false,
                'message' => 'Invalid coupon code',
            ];
        }
        Session::put('coupon', [
            'id' => $coupon->id,
            'code' => $coupon->code,
            'discount_percent' => $coupon->discount_percent,
        ]);
        return [
            'success' => true,
            'message' => 'Coupon applied',
            'coupon' => $coupon
        ];
    }

    public function removeCoupon()
    {
        Session::forget('coupon');
        return [
            'success' => true,
            'message' => 'Coupon removed',
        ];
    }
}
