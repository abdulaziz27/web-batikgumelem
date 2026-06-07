<?php

namespace App\Events;

use App\Models\Order;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class OrderStatusChanged
{
    // Trait untuk memudahkan event ini bisa didispatch dan diserialisasi
    use Dispatchable, SerializesModels;

    // Properti publik untuk menyimpan data order dan status lama/baru
    public $order;
    public $oldStatus;
    public $newStatus;

    /**
     * Konstruktor event
     * @param Order $order Order yang statusnya berubah
     * @param string $oldStatus Status lama
     * @param string $newStatus Status baru
     */
    public function __construct(Order $order, $oldStatus, $newStatus)
    {
        // Simpan data order dan status ke properti event
        $this->order = $order;
        $this->oldStatus = $oldStatus;
        $this->newStatus = $newStatus;
    }
}