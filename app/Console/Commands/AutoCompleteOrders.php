<?php

namespace App\Console\Commands;

use App\Models\Order;
use Carbon\Carbon;
use Illuminate\Console\Command;

class AutoCompleteOrders extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:auto-complete-orders';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Otomatis menandai pesanan sebagai selesai setelah 7 hari pengiriman';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Memulai proses auto-complete pesanan...');
        
        // Cari semua pesanan dengan status 'shipped' yang diupdate lebih dari 7 hari yang lalu
        $orders = Order::where('status', 'shipped')
            ->where('updated_at', '<=', Carbon::now()->subDays(7))
            ->get();
            
        $count = 0;
        
        foreach ($orders as $order) {
            $order->status = 'completed';
            $order->save();
            $count++;
            
            $this->line("Pesanan #{$order->order_number} ditandai selesai otomatis setelah 7 hari pengiriman.");
        }
        
        $this->info("Proses selesai. {$count} pesanan ditandai sebagai selesai.");
    }
}
