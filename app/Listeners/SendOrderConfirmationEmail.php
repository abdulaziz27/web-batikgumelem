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
     * Handle the event.
     */
    public function handle(OrderCreated $event): void
    {
        $order = $event->order;
        $email = $order->user_id ? $order->user->email : $order->guest_email;
        
        if ($email) {
            // Kirim email konfirmasi
            Mail::to($email)->send(new OrderConfirmation($order));
            
            // Kirim instruksi pembayaran
            Mail::to($email)->send(new PaymentInstructions($order));
        }
    }
}
