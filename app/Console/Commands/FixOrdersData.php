<?php

namespace App\Console\Commands;

use App\Models\Order;
use App\Models\ShippingAddress;
use Illuminate\Console\Command;

class FixOrdersData extends Command
{
    /**
     * Nama dan signature dari perintah konsol ini.
     * Digunakan untuk menjalankan perintah via artisan.
     * Contoh: php artisan app:fix-orders-data
     *
     * @var string
     */
    protected $signature = 'app:fix-orders-data';

    /**
     * Deskripsi perintah konsol ini.
     * Akan muncul saat menjalankan php artisan list
     *
     * @var string
     */
    protected $description = 'Fix orders data including order numbers and shipping address relationships';

    /**
     * Fungsi utama yang akan dijalankan saat perintah dipanggil.
     */
    public function handle()
    {
        // Menampilkan pesan awal di terminal
        $this->info('Starting to fix orders data...');
        
        // Mengambil semua data order
        $orders = Order::all();
        
        $this->info('Found ' . $orders->count() . ' orders to process.');
        
        $ordersFixed = 0;
        $addressesFixed = 0;
        
        // Loop setiap order
        foreach ($orders as $order) {
            $changes = [];
            
            // Perbaiki order_number jika kosong
            if (empty($order->order_number)) {
                $orderDate = $order->created_at->format('Ymd');
                $orderCount = Order::whereDate('created_at', $order->created_at->toDateString())
                    ->where('id', '<=', $order->id)
                    ->count();
                
                // Format order_number: ORD-YYYYMMDD-XXXX
                $orderNumber = 'ORD-' . $orderDate . '-' . sprintf('%04d', $orderCount);
                $order->order_number = $orderNumber;
                $changes[] = 'order_number';
            }
            
            // Perbaiki total_amount jika kosong dan total_price ada
            if (empty($order->total_amount) && !empty($order->total_price)) {
                $order->total_amount = $order->total_price;
                $changes[] = 'total_amount';
            }
            
            // Simpan order jika ada perubahan
            if (count($changes) > 0) {
                $order->save();
                $ordersFixed++;
                $this->info("Fixed order #{$order->id}: " . implode(', ', $changes));
            }
            
            // Cek dan perbaiki relasi shipping address jika perlu
            if ($order->shipping_address_id) {
                $shippingAddress = ShippingAddress::find($order->shipping_address_id);
                // Di sini bisa ditambahkan logika untuk memperbaiki relasi jika diperlukan
            }
        }
        
        // Tampilkan ringkasan hasil
        $this->info("Completed processing orders.");
        $this->info("Fixed $ordersFixed orders and $addressesFixed shipping addresses.");
    }
}
