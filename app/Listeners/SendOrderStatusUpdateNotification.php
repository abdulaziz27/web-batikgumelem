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
        $email = $order->user_id ? $order->user->email : $order->guest_email;
        
        if ($email) {
            Mail::to($email)->send(new OrderStatusUpdate($order, $event->oldStatus, $event->newStatus));
        }
    }
}