<?php

namespace App\Console\Commands;

use App\Models\Order;
use Carbon\Carbon;
use Illuminate\Console\Command;

class AutoCompleteOrders extends Command
{
    /**
     * Nama dan signature dari perintah konsol ini.
     * Digunakan untuk menjalankan perintah via artisan.
     * Contoh: php artisan app:auto-complete-orders
     *
     * @var string
     */
    protected $signature = 'app:auto-complete-orders';

    /**
     * Deskripsi perintah konsol ini.
     * Akan muncul saat menjalankan php artisan list
     *
     * @var string
     */
    protected $description = 'Otomatis menandai pesanan sebagai selesai setelah 7 hari pengiriman';

    /**
     * Fungsi utama yang akan dijalankan saat perintah dipanggil.
     */
    public function handle()
    {
        // Menampilkan pesan awal di terminal
        $this->info('Memulai proses auto-complete pesanan...');
        
        // Cari semua pesanan dengan status 'shipped' yang diupdate lebih dari 7 hari yang lalu
        $orders = Order::where('status', 'shipped')
            ->where('updated_at', '<=', Carbon::now()->subDays(7))
            ->get();
            
        $count = 0;
        
        // Loop setiap pesanan yang ditemukan
        foreach ($orders as $order) {
            // Ubah status menjadi 'completed'
            $order->status = 'completed';
            $order->save();
            $count++;
            
            // Tampilkan pesan untuk setiap pesanan yang diubah
            $this->line("Pesanan #{$order->order_number} ditandai selesai otomatis setelah 7 hari pengiriman.");
        }
        
        // Tampilkan jumlah pesanan yang diproses
        $this->info("Proses selesai. {$count} pesanan ditandai sebagai selesai.");
    }
}
