<?php

namespace App\Mail;

use App\Models\Order;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class OrderStatusUpdate extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public $order;
    public $oldStatus;
    public $newStatus;
    
    public function __construct(Order $order, $oldStatus, $newStatus)
    {
        $this->order = $order;
        
        // Jika $oldStatus adalah array, ambil nilai status-nya saja
        $this->oldStatus = is_array($oldStatus) ? $oldStatus['status'] : $oldStatus;
        
        // Jika $newStatus adalah array, ambil nilai status-nya saja
        $this->newStatus = is_array($newStatus) ? $newStatus['status'] : $newStatus;
    }

    public function envelope()
    {
        return new Envelope(
            subject: 'Update Status Pesanan - Batik Gumelem #' . $this->order->id,
        );
    }

    public function content()
    {
        return new Content(
            view: 'emails.order-status-update',
        );
    }

    public function attachments()
    {
        return [];
    }
}