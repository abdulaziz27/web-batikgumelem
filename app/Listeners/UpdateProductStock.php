<?php

namespace App\Listeners;

use App\Events\OrderStatusChanged;
use App\Models\Product;
use App\Models\ProductSize;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class UpdateProductStock
{
    /**
     * Menangani event OrderStatusChanged untuk mengurangi stok produk ketika order diproses.
     * Hanya mengurangi stok jika status order berubah menjadi 'processing'.
     */
    public function handle(OrderStatusChanged $event): void
    {
        // Hanya kurangi stok jika status baru adalah 'processing'
        if ($event->newStatus !== 'processing') {
            return;
        }

        try {
            DB::transaction(function () use ($event) {
                foreach ($event->order->items as $item) {
                    // Semua produk sekarang harus punya size, update stok berdasarkan size
                    if ($item->size) {
                        $productSize = ProductSize::where('product_id', $item->product_id)
                            ->where('size', $item->size)
                            ->first();

                        if ($productSize) {
                            $productSize->decrement('stock', $item->quantity);
                        }
                    } else {
                        // Log warning jika item tidak punya size (seharusnya tidak terjadi di sistem baru)
                        Log::warning('Order item without size found - this should not happen in the new system', [
                            'order_id' => $event->order->id,
                            'order_item_id' => $item->id,
                            'product_id' => $item->product_id
                        ]);
                    }
                }
            });
        } catch (\Exception $e) {
            // Log error jika gagal update stok
            Log::error('Failed to update product stock', [
                'order_id' => $event->order->id,
                'error' => $e->getMessage()
            ]);
        }
    }
}
