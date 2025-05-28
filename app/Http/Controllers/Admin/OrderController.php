<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class OrderController extends Controller
{
    public function index(Request $request)
    {
        // Get all orders with user and shipping address data
        $orders = Order::with(['user', 'shippingAddress'])->latest()->get();

        // Get count by status for summary
        $statusCounts = [
            'all' => Order::count(),
            'pending' => Order::where('status', 'pending')->count(),
            'processing' => Order::where('status', 'processing')->count(),
            'shipped' => Order::where('status', 'shipped')->count(),
            'delivered' => Order::where('status', 'delivered')->count(),
            'cancelled' => Order::where('status', 'cancelled')->count(),
        ];

        return Inertia::render('Admin/Orders/Index', [
            'orders' => $orders,
            'statusCounts' => $statusCounts
        ]);
    }

    public function show($id)
    {
        $order = Order::with([
            'items.product',
            'shippingAddress',
            'user',
            'coupon'
        ])->findOrFail($id);

        // Generate tracking timeline
        $timeline = $this->generateOrderTimeline($order);

        return Inertia::render('Admin/Orders/Show', [
            'order' => $order,
            'timeline' => $timeline
        ]);
    }
    
    public function edit($id)
    {
        // Redirect to show page for simplicity
        return redirect()->route('admin.orders.show', $id);
    }

    public function update(Request $request, $id)
    {
        $order = Order::findOrFail($id);
        
        // Validasi perubahan status
        $request->validate([
            'status' => 'required|in:pending,processing,shipped,completed,cancelled',
            'tracking_number' => 'nullable|string',
            'tracking_url' => 'nullable|url',
            'notes' => 'nullable|string'
        ]);

        // Validasi logika status
        if ($request->status === 'cancelled' && $order->payment_status === 'paid') {
            return back()->with('error', 'Pesanan yang sudah dibayar tidak dapat dibatalkan');
        }

        // Update order
        $order->update([
            'status' => $request->status,
            'tracking_number' => $request->tracking_number ?: null,
            'tracking_url' => $request->tracking_url ?: null,
            'admin_notes' => $request->notes ?: null
        ]);

        return back()->with('success', 'Pesanan berhasil diupdate');
    }

    public function destroy($id)
    {
        $order = Order::findOrFail($id);

        // Only allow deletion of cancelled orders
        if ($order->status !== 'cancelled') {
            return redirect()->back()->with('error', 'Hanya pesanan yang dibatalkan yang dapat dihapus');
        }

        $order->delete();

        return redirect()->route('admin.orders.index')
            ->with('success', 'Pesanan berhasil dihapus');
    }
    
    /**
     * Generate timeline data for order tracking
     */
    private function generateOrderTimeline($order)
    {
        $timeline = [];
        
        // Add creation event
        $timeline[] = [
            'date' => $order->created_at->format('Y-m-d H:i:s'),
            'status' => 'Pesanan Dibuat',
            'description' => 'Pesanan berhasil dibuat',
            'icon' => 'ShoppingCart'
        ];
        
        // Add payment event if payment exists
        if ($order->payment_status === 'paid') {
            $timeline[] = [
                'date' => $order->updated_at->format('Y-m-d H:i:s'),
                'status' => 'Pembayaran Dikonfirmasi',
                'description' => 'Pembayaran telah dikonfirmasi',
                'icon' => 'Receipt'
            ];
        }
        
        // Add status update if status is not pending
        if ($order->status !== 'pending') {
            $icon = 'CircleCheck';
            $statusText = '';
            $description = '';
            
            if ($order->status === 'processing') {
                $icon = 'Package';
                $statusText = 'Diproses';
                $description = 'Status diperbarui menjadi Diproses';
            } elseif ($order->status === 'shipped') {
                $icon = 'Truck';
                $statusText = 'Dikirim';
                $description = 'Status diperbarui menjadi Dikirim';
            } elseif ($order->status === 'delivered' || $order->status === 'completed') {
                $icon = 'CheckCircle';
                $statusText = 'Selesai';
                $description = 'Status diperbarui menjadi Selesai';
            } elseif ($order->status === 'cancelled') {
                $icon = 'XCircle';
                $statusText = 'Dibatalkan';
                $description = 'Status diperbarui menjadi Dibatalkan';
            }
            
            $timeline[] = [
                'date' => $order->updated_at->format('Y-m-d H:i:s'),
                'status' => $statusText,
                'description' => $description,
                'icon' => $icon
            ];
        }
        
        // Sort timeline by date
        usort($timeline, function ($a, $b) {
            return strtotime($a['date']) - strtotime($b['date']);
        });
        
        return $timeline;
    }
}
