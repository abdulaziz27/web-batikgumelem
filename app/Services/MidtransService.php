<?php

namespace App\Services;

use App\Models\Order;
use Midtrans\Config;
use Midtrans\Snap;
use Midtrans\Transaction;

class MidtransService
{
    public function __construct()
    {
        // Set Midtrans configuration
        Config::$serverKey = config('services.midtrans.server_key');
        Config::$isProduction = config('services.midtrans.is_production', false);
        Config::$isSanitized = true;
        Config::$is3ds = true;
    }

    public function createTransaction(Order $order)
    {
        try {
            if (!$order->user) {
                throw new \Exception('Order must have a user for payment.');
            }

            $items = [];

            foreach ($order->items as $item) {
                $items[] = [
                    'id' => $item->product_id,
                    'price' => (int) round($item->price),
                    'quantity' => $item->quantity,
                    'name' => $item->product->name . ($item->size ? " (Size: {$item->size})" : ''),
                ];
            }

            // Add shipping cost as an item
            if ($order->shipping_cost > 0) {
                $items[] = [
                    'id' => 'shipping',
                    'price' => (int) round($order->shipping_cost),
                    'quantity' => 1,
                    'name' => 'Shipping Cost',
                ];
            }

            // Apply discount if exists
            if ($order->discount > 0) {
                $items[] = [
                    'id' => 'discount',
                    'price' => -(int) round($order->discount),
                    'quantity' => 1,
                    'name' => 'Discount',
                ];
            }

            // Create consistent order_id and store it for future reference
            $timestamp = time();
            $orderId = 'ORD-' . $order->id . '-' . $timestamp;
            $grossAmount = (int) round($order->total_amount ?? $order->total_price);
            $transactionData = [
                'transaction_details' => [
                    'order_id' => $orderId,
                    'gross_amount' => $grossAmount,
                ],
                'customer_details' => [
                    'first_name' => $order->user->name,
                    'email' => $order->user->email,
                    'phone' => $order->shippingAddress->phone,
                    'shipping_address' => [
                        'first_name' => $order->shippingAddress->full_name,
                        'phone' => $order->shippingAddress->phone,
                        'address' => $order->shippingAddress->address,
                        'city' => $order->shippingAddress->city,
                        'postal_code' => $order->shippingAddress->postal_code,
                        'country_code' => 'IDN',
                    ],
                ],
                'item_details' => $items,
                'callbacks' => [
                    'finish' => route('checkout.success') . '?order_number=' . $order->order_number,
                    'pending' => route('checkout.pending') . '?order_number=' . $order->order_number,
                    'error' => route('checkout.failed') . '?order_number=' . $order->order_number,
                    'cancel' => route('checkout.cancel') . '?order_number=' . $order->order_number,
                ],
            ];

            \Log::info('Creating Midtrans transaction', [
                'order_id' => $order->id,
                'amount' => $grossAmount,
                'items' => $items
            ]);
            
            try {
                $snapToken = Snap::getSnapToken($transactionData);
                \Log::info('Snap token generated successfully', [
                    'order_id' => $order->id,
                    'token' => $snapToken
                ]);
            } catch (\Exception $e) {
                \Log::error('Failed to generate Snap token', [
                    'order_id' => $order->id,
                    'error' => $e->getMessage(),
                    'trace' => $e->getTraceAsString(),
                    'transaction_data' => $transactionData
                ]);
                throw $e;
            }

            $snapUrl = config('services.midtrans.is_production')
                ? 'https://app.midtrans.com/snap/v1/transactions/'
                : 'https://app.sandbox.midtrans.com/snap/v1/transactions/';

            $order->update([
                'payment_token' => $snapToken,
                'payment_url' => $snapUrl . $snapToken,
                // 'admin_notes' => 'Midtrans Order ID: ' . $orderId,
            ]);
    
            \Log::info('Payment token generated', [
                'order_id' => $order->id,
                'token' => $snapToken,
                'url' => $snapUrl . $snapToken
            ]);
    
            return [
                'success' => true,
                'token' => $snapToken,
                'redirect_url' => $snapUrl . $snapToken,
                'order_id' => $order->id,
            ];
        } catch (\Exception $e) {
            \Log::error('Midtrans payment error', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return [
                'success' => false,
                'message' => 'Payment initialization failed: ' . $e->getMessage(),
            ];
        }
    }

    public function getStatus($orderId)
    {
        try {
            \Log::info('Checking transaction status', ['order_id' => $orderId]);
            
            $status = Transaction::status($orderId);
            // Konversi ke array
            $statusArray = json_decode(json_encode($status), true);
            
            \Log::info('Transaction status response', ['response' => $statusArray]);

            return [
                'success' => true,
                'data' => $statusArray, // Mengembalikan array
            ];
        } catch (\Exception $e) {
            \Log::error('Failed to get transaction status', [
                'order_id' => $orderId,
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return [
                'success' => false,
                'message' => 'Failed to get transaction status: ' . $e->getMessage(),
            ];
        }
    }

    public function checkAndUpdateOrderStatus(Order $order)
    {
        try {
            // Use the same pattern as createTransaction - get the actual order_id used when creating transaction
            // We need to find the real order_id used in Midtrans from the payment_url or recreate consistently
            $orderId = $this->getMidtransOrderId($order);
            \Log::info('Checking order status for automatic update', [
                'order_id' => $orderId,
                'order_db_id' => $order->id,
                'admin_notes' => $order->admin_notes,
                'created_at' => $order->created_at
            ]);
            
            $statusResponse = $this->getStatus($orderId);
            
            if (!$statusResponse['success']) {
                \Log::warning('Failed to get status from Midtrans', ['order_id' => $orderId]);
                return [
                    'success' => false,
                    'message' => $statusResponse['message']
                ];
            }
            
            $statusData = $statusResponse['data'];
            $transactionStatus = $statusData['transaction_status'] ?? null;
            $fraudStatus = $statusData['fraud_status'] ?? null;
            
            \Log::info('Processing order status update', [
                'order_id' => $order->id,
                'previous_status' => $order->status,
                'previous_payment_status' => $order->payment_status,
                'transaction_status' => $transactionStatus,
                'fraud_status' => $fraudStatus
            ]);
            
            $oldStatus = $order->status;
            $updated = false;
            
            // Update order status based on transaction_status
            switch ($transactionStatus) {
                case 'capture':
                    // For credit card payments, check fraud status
                    if ($fraudStatus == 'challenge') {
                        $order->update([
                            'payment_status' => 'challenge',
                            'status' => 'pending'
                        ]);
                    } else {
                        $order->update([
                            'payment_status' => 'paid',
                            'status' => 'processing'
                        ]);
                    }
                    $updated = true;
                    break;
                    
                case 'settlement':
                    $order->update([
                        'payment_status' => 'paid',
                        'status' => 'processing'
                    ]);
                    $updated = true;
                    break;
                    
                case 'pending':
                    $order->update([
                        'payment_status' => 'pending',
                        'status' => 'pending'
                    ]);
                    $updated = true;
                    break;
                    
                case 'deny':
                case 'cancel':
                case 'expire':
                    $order->update([
                        'payment_status' => 'failed',
                        'status' => 'cancelled'
                    ]);
                    $updated = true;
                    break;
            }
            
            // Trigger event if status changed
            if ($updated && $oldStatus !== $order->status) {
                event(new \App\Events\OrderStatusChanged($order, $oldStatus, $order->status));
            }
            
            return [
                'success' => true,
                'updated' => $updated,
                'status' => $order->status,
                'payment_status' => $order->payment_status
            ];
        } catch (\Exception $e) {
            \Log::error('Error updating order status', [
                'order_id' => $order->id,
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return [
                'success' => false,
                'message' => 'Error updating order status: ' . $e->getMessage()
            ];
        }
    }

    /**
     * Get consistent Midtrans order_id for an order
     */
    private function getMidtransOrderId(Order $order)
    {
        // Try to extract from admin_notes first
        if ($order->admin_notes && strpos($order->admin_notes, 'Midtrans Order ID: ') !== false) {
            $orderIdMatch = [];
            if (preg_match('/Midtrans Order ID: (ORD-\d+-\d+)/', $order->admin_notes, $orderIdMatch)) {
                return $orderIdMatch[1];
            }
        }
        
        // Fallback: reconstruct using created_at timestamp for older orders
        $timestamp = strtotime($order->created_at);
        return 'ORD-' . $order->id . '-' . $timestamp;
    }
}
