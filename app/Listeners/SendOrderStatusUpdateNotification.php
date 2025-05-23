<?php

namespace App\Listeners;

use App\Events\OrderStatusChanged;
use App\Mail\OrderStatusUpdate;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Support\Facades\Mail;

class SendOrderStatusUpdateNotification implements ShouldQueue
{
    /**
     * Handle the event.
     */
    public function handle(OrderStatusChanged $event): void
    {
        $order = $event->order;
        if ($order->user && $order->user->email) {
            Mail::to($order->user->email)->send(new OrderStatusUpdate($order, $event->oldStatus, $event->newStatus));
        }
    }
}