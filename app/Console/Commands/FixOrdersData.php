<?php

namespace App\Console\Commands;

use App\Models\Order;
use App\Models\ShippingAddress;
use Illuminate\Console\Command;

class FixOrdersData extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:fix-orders-data';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Fix orders data including order numbers and shipping address relationships';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Starting to fix orders data...');
        
        // Get all orders
        $orders = Order::all();
        
        $this->info('Found ' . $orders->count() . ' orders to process.');
        
        $ordersFixed = 0;
        $addressesFixed = 0;
        
        foreach ($orders as $order) {
            $changes = [];
            
            // Fix order_number if missing
            if (empty($order->order_number)) {
                $orderDate = $order->created_at->format('Ymd');
                $orderCount = Order::whereDate('created_at', $order->created_at->toDateString())
                    ->where('id', '<=', $order->id)
                    ->count();
                
                $orderNumber = 'ORD-' . $orderDate . '-' . sprintf('%04d', $orderCount);
                $order->order_number = $orderNumber;
                $changes[] = 'order_number';
            }
            
            // Fix total_amount if missing
            if (empty($order->total_amount) && !empty($order->total_price)) {
                $order->total_amount = $order->total_price;
                $changes[] = 'total_amount';
            }
            
            // Save order if any changes were made
            if (count($changes) > 0) {
                $order->save();
                $ordersFixed++;
                $this->info("Fixed order #{$order->id}: " . implode(', ', $changes));
            }
            
            // Fix shipping address relationship
            if ($order->shipping_address_id) {
                $shippingAddress = ShippingAddress::find($order->shipping_address_id);
                
                if ($shippingAddress && empty($shippingAddress->order_id)) {
                    $shippingAddress->order_id = $order->id;
                    $shippingAddress->save();
                    $addressesFixed++;
                    $this->info("Fixed shipping address #{$shippingAddress->id} for order #{$order->id}");
                }
            }
        }
        
        $this->info("Completed processing orders.");
        $this->info("Fixed $ordersFixed orders and $addressesFixed shipping addresses.");
    }
}
