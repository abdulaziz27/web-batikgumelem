<?php

namespace App\Events;

use App\Models\Order;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class OrderCreated
{
    // Trait untuk memudahkan event ini bisa didispatch dan diserialisasi
    use Dispatchable, SerializesModels;

    // Properti publik untuk menyimpan data order yang terkait dengan event
    public $order;

    /**
     * Konstruktor event
     * @param Order $order Order yang baru dibuat
     */
    public function __construct(Order $order)
    {
        // Simpan data order ke properti event
        $this->order = $order;
    }
}