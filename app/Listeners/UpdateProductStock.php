<?php

namespace App\Listeners;

use App\Events\OrderStatusChanged;
use App\Models\Product;
use App\Models\ProductSize;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class UpdateProductStock
{
    public function handle(OrderStatusChanged $event): void
    {
        // Only reduce stock when order status changes to 'processing' (paid)
        if ($event->newStatus !== 'processing') {
            return;
        }

        try {
            DB::transaction(function () use ($event) {
                foreach ($event->order->items as $item) {
                    if ($item->size) {
                        // Update stock for specific size
                        $productSize = ProductSize::where('product_id', $item->product_id)
                            ->where('size', $item->size)
                            ->first();

                        if ($productSize) {
                            $productSize->decrement('stock', $item->quantity);
                        }
                    } else {
                        // Update general product stock
                        $product = Product::find($item->product_id);
                        if ($product) {
                            $product->decrement('stock', $item->quantity);
                        }
                    }
                }
            });
        } catch (\Exception $e) {
            Log::error('Failed to update product stock', [
                'order_id' => $event->order->id,
                'error' => $e->getMessage()
            ]);
        }
    }
}
