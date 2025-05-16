<?php

namespace App\Mail;

use App\Models\Order;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class PaymentInstructions extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public $order;
    
    public function __construct(Order $order)
    {
        $this->order = $order;
    }

    public function envelope()
    {
        return new Envelope(
            subject: 'Instruksi Pembayaran - Batik Gumelem #' . $this->order->id,
        );
    }

    public function content()
    {
        return new Content(
            view: 'emails.payment-instructions',
        );
    }

    public function attachments()
    {
        return [];
    }
}