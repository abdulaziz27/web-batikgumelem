<?php

namespace App\Observers;

use App\Events\OrderCreated;
use App\Events\OrderStatusChanged;
use App\Models\Order;

class OrderObserver
{
    /**
     * Handle the Order "created" event.
     */
    public function created(Order $order): void
    {
        event(new OrderCreated($order)); // Memicu event ketika pesanan baru dibuat
    }

    /**
     * Handle the Order "updated" event.
     */
    public function updated(Order $order): void
    {
        // Cek apakah status berubah
        if ($order->isDirty('status')) {
            $oldStatus = $order->getOriginal('status');
            $newStatus = $order->status;
            
            event(new OrderStatusChanged($order, $oldStatus, $newStatus)); // Memicu event ketika status pesanan berubah
        }
    }
}
