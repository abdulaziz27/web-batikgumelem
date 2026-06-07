<?php

namespace App\Listeners;

use App\Events\OrderCreated;
use App\Mail\OrderConfirmation;
use App\Mail\PaymentInstructions;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Support\Facades\Mail;

class SendOrderConfirmationEmail implements ShouldQueue
{
    /**
     * Menangani event OrderCreated untuk mengirim email konfirmasi dan instruksi pembayaran ke user.
     */
    public function handle(OrderCreated $event): void
    {
        $order = $event->order;
        if ($order->user && $order->user->email) {
            // Kirim email konfirmasi order
            Mail::to($order->user->email)->send(new OrderConfirmation($order));
            // Kirim email instruksi pembayaran
            Mail::to($order->user->email)->send(new PaymentInstructions($order));
        }
    }
}
