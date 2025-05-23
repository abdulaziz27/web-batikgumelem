<?php

namespace App\Services;

use App\Models\Product;
use App\Models\ProductSize;
use App\Models\CartItem;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\Log;

class CartService
{
    public function getCart()
    {
        $user = Auth::user();
        $items = CartItem::with('product')
            ->where('user_id', $user->id)
            ->get();
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
        return [
            'items' => $cartItems,
            'total' => $total,
        ];
    }

    public function addToCart($productId, $quantity = 1, $size = null)
    {
        $user = Auth::user();
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
        $cartItem = CartItem::where('user_id', $user->id)
            ->where('product_id', $productId)
            ->where('size', $size)
            ->first();
        if ($cartItem) {
            $cartItem->quantity += $quantity;
            $cartItem->save();
        } else {
            CartItem::create([
                'user_id' => $user->id,
                'product_id' => $productId,
                'quantity' => $quantity,
                'size' => $size,
            ]);
        }
        return [
            'success' => true,
            'message' => 'Product added to cart',
            'cart' => $this->getCart(),
        ];
    }

    public function updateCartItem($itemKey, $quantity)
    {
        $user = Auth::user();
        [$productId, $size] = explode('-', $itemKey) + [null, null];
        $cartItem = CartItem::where('user_id', $user->id)
            ->where('product_id', $productId)
            ->where('size', $size)
            ->first();
        if (!$cartItem) {
            return [
                'success' => false,
                'message' => 'Item not found in cart',
            ];
        }
        $cartItem->quantity = $quantity;
        $cartItem->save();
        return [
            'success' => true,
            'message' => 'Cart updated',
            'cart' => $this->getCart(),
        ];
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
