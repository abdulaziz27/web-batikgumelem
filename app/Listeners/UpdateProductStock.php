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
                    // All products should now have sizes, so only update size-specific stock
                    if ($item->size) {
                        $productSize = ProductSize::where('product_id', $item->product_id)
                            ->where('size', $item->size)
                            ->first();

                        if ($productSize) {
                            $productSize->decrement('stock', $item->quantity);
                        }
                    } else {
                        // Log warning if item doesn't have size (this shouldn't happen in new system)
                        Log::warning('Order item without size found - this should not happen in the new system', [
                            'order_id' => $event->order->id,
                            'order_item_id' => $item->id,
                            'product_id' => $item->product_id
                        ]);
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
