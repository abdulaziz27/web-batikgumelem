<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class OrderController extends Controller
{
    // Menampilkan daftar pesanan beserta data user dan alamat pengiriman
    public function index(Request $request)
    {
        // Mengambil semua pesanan beserta relasi user dan shipping address
        $orders = Order::with(['user', 'shippingAddress'])->latest()->get();

        // Menghitung jumlah pesanan berdasarkan status
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

    // Menampilkan detail pesanan
    public function show($id)
    {
        $order = Order::with([
            'items.product',
            'shippingAddress',
            'user',
            'coupon'
        ])->findOrFail($id);

        // Membuat data timeline tracking pesanan
        $timeline = $this->generateOrderTimeline($order);

        return Inertia::render('Admin/Orders/Show', [
            'order' => $order,
            'timeline' => $timeline
        ]);
    }
    
    // Edit pesanan (redirect ke halaman detail)
    public function edit($id)
    {
        // Redirect ke halaman show agar lebih sederhana
        return redirect()->route('admin.orders.show', $id);
    }

    // Update data pesanan
    public function update(Request $request, $id)
    {
        $order = Order::findOrFail($id);
        
        // Validasi perubahan status dan data tracking
        $request->validate([
            'status' => 'required|in:pending,processing,shipped,completed,cancelled',
            'tracking_number' => 'nullable|string',
            'tracking_url' => 'nullable|url',
            'notes' => 'nullable|string'
        ]);

        // Cek logika status: pesanan yang sudah dibayar tidak bisa dibatalkan
        if ($request->status === 'cancelled' && $order->payment_status === 'paid') {
            return back()->with('error', 'Pesanan yang sudah dibayar tidak dapat dibatalkan');
        }

        // Update data pesanan
        $order->update([
            'status' => $request->status,
            'tracking_number' => $request->tracking_number ?: null,
            'tracking_url' => $request->tracking_url ?: null,
            'admin_notes' => $request->notes ?: null
        ]);

        return back()->with('success', 'Pesanan berhasil diupdate');
    }

    // Menghapus pesanan (hanya jika status cancelled)
    public function destroy($id)
    {
        $order = Order::findOrFail($id);

        // Hanya pesanan yang dibatalkan yang boleh dihapus
        if ($order->status !== 'cancelled') {
            return redirect()->back()->with('error', 'Hanya pesanan yang dibatalkan yang dapat dihapus');
        }

        $order->delete();

        return redirect()->route('admin.orders.index')
            ->with('success', 'Pesanan berhasil dihapus');
    }
    
    /**
     * Membuat data timeline untuk tracking pesanan
     */
    private function generateOrderTimeline($order)
    {
        $timeline = [];
        
        // Event pesanan dibuat
        $timeline[] = [
            'date' => $order->created_at->format('Y-m-d H:i:s'),
            'status' => 'Pesanan Dibuat',
            'description' => 'Pesanan berhasil dibuat',
            'icon' => 'ShoppingCart'
        ];
        
        // Event pembayaran jika sudah dibayar
        if ($order->payment_status === 'paid') {
            $timeline[] = [
                'date' => $order->updated_at->format('Y-m-d H:i:s'),
                'status' => 'Pembayaran Dikonfirmasi',
                'description' => 'Pembayaran telah dikonfirmasi',
                'icon' => 'Receipt'
            ];
        }
        
        // Event perubahan status jika bukan pending
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
        
        // Urutkan timeline berdasarkan tanggal
        usort($timeline, function ($a, $b) {
            return strtotime($a['date']) - strtotime($b['date']);
        });
        
        return $timeline;
    }
}
