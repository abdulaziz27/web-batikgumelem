<?php

namespace App\Services;

use App\Models\Product;
use App\Models\ProductSize;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\Log;

class CartService
{
    public function getCart()
    {
        if (!Session::has('cart')) {
            // Inisialisasi cart kosong jika belum ada
            $cart = [
                'items' => [],
                'total' => 0,
            ];
            Session::put('cart', $cart);
            return $cart;
        }
        
        $cart = Session::get('cart');
        
        // Ensure all cart items have required properties
        $cart = $this->refreshCartItemsData($cart);
        
        return $cart;
    }
    
    /**
     * Ensure all items in the cart have all required properties including slug
     */
    private function refreshCartItemsData($cart)
    {
        if (empty($cart['items'])) {
            return $cart;
        }
        
        $needsUpdate = false;
        
        foreach ($cart['items'] as $itemKey => &$item) {
            if (!isset($item['slug'])) {
                $needsUpdate = true;
                try {
                    $product = Product::find($item['id']);
                    if ($product) {
                        $item['slug'] = $product->slug;
                    }
                } catch (\Exception $e) {
                    Log::error('Failed to refresh cart item data: ' . $e->getMessage(), ['item' => $item]);
                }
            }
        }
        
        if ($needsUpdate) {
            Session::put('cart', $cart);
        }
        
        return $cart;
    }

    public function addToCart($productId, $quantity = 1, $size = null)
    {
        $cart = $this->getCart();
        $product = Product::findOrFail($productId);

        if ($size) {
            $productSize = ProductSize::where('product_id', $productId)
                ->where('size', $size)
                ->first();
            if (!$productSize || $productSize->stock < $quantity) {
                return [
                    'success' => false,
                    'message' => 'Stock not available for selected size',
                ];
            }
        } elseif ($product->stock < $quantity) {
            return [
                'success' => false,
                'message' => 'Product stock not available',
            ];
        }

        $itemKey = $size ? "{$productId}-{$size}" : (string)$productId;

        if (isset($cart['items'][$itemKey])) {
            $cart['items'][$itemKey]['quantity'] += $quantity;
            // Ensure slug is present for existing items
            if (!isset($cart['items'][$itemKey]['slug'])) {
                $cart['items'][$itemKey]['slug'] = $product->slug;
            }
        } else {
            $cart['items'][$itemKey] = [
                'id' => $product->id,
                'name' => $product->name,
                'price' => $product->price,
                'image' => $product->image,
                'quantity' => $quantity,
                'size' => $size,
                'slug' => $product->slug,
            ];
        }

        $this->recalculateCart($cart);
        Session::put('cart', $cart);

        return [
            'success' => true,
            'message' => 'Product added to cart',
            'cart' => $cart
        ];
    }

    public function updateCartItem($itemKey, $quantity)
    {
        $cart = $this->getCart();

        if (!isset($cart['items'][$itemKey])) {
            return [
                'success' => false,
                'message' => 'Item not found in cart',
            ];
        }

        $cart['items'][$itemKey]['quantity'] = $quantity;
        $this->recalculateCart($cart);
        Session::put('cart', $cart);

        return [
            'success' => true,
            'message' => 'Cart updated',
            'cart' => $cart
        ];
    }

    public function removeCartItem($itemKey)
    {
        $cart = $this->getCart();

        if (isset($cart['items'][$itemKey])) {
            unset($cart['items'][$itemKey]);
            $this->recalculateCart($cart);
            Session::put('cart', $cart);

            return [
                'success' => true,
                'message' => 'Item removed from cart',
                'cart' => $cart
            ];
        }

        return [
            'success' => false,
            'message' => 'Item not found in cart',
        ];
    }

    public function clearCart()
    {
        $cart = [
            'items' => [],
            'total' => 0,
        ];

        Session::put('cart', $cart);

        return [
            'success' => true,
            'message' => 'Cart cleared',
            'cart' => $cart
        ];
    }

    private function recalculateCart(&$cart)
    {
        $total = 0;
        foreach ($cart['items'] as $item) {
            $total += $item['price'] * $item['quantity'];
        }
        $cart['total'] = $total;
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
