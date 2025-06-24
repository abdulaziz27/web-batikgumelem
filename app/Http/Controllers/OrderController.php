<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Traits\ValidatesUserOwnership;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OrderController extends Controller
{
    use ValidatesUserOwnership;

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user = auth()->user();
        
        $orders = Order::where('user_id', $user->id)
            ->with(['items.product.images'])
            ->latest()
            ->paginate(5);

        // Transform to ensure proper data structure
        $orders->through(function ($order) {
            // Transform order items to include product images as array
            $order->items->transform(function ($item) {
                // Check if images is a collection before calling pluck
                $imageArray = collect($item->product->images)->pluck('image')->all();
                $item->product->images = $imageArray;
                return $item;
            });
            
            // Makes sure we send only necessary data
            $order->makeVisible(['payment_status', 'payment_url']);
            
            return $order;
        });

        return Inertia::render('User/Orders', [
            'orders' => $orders,
            'midtrans_client_key' => config('services.midtrans.client_key'),
            'is_production' => config('services.midtrans.is_production', false),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $order = Order::with(['items.product.images', 'shippingAddress'])
            ->findOrFail($id);

        // CRITICAL: Validate ownership to prevent unauthorized access
        $this->validateUserOwnership($order);

        // Transform product images to array format for frontend
        foreach ($order->items as $item) {
            // Check if images is a collection before calling pluck
            $item->product->images = collect($item->product->images)->pluck('image')->all();
        }

        return Inertia::render('User/OrderDetail', [
            'order' => $order,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }

    /**
     * Mark an order as completed by the user
     */
    public function markAsCompleted($id)
    {
        $order = Order::findOrFail($id);

        // Validate ownership
        $this->validateUserOwnership($order);

        // Only shipped orders can be marked as completed
        if ($order->status !== 'shipped') {
            return redirect()->back()->with('error', 'Hanya pesanan yang sudah dikirim yang dapat ditandai selesai');
        }

        $order->update(['status' => 'completed']);
        return redirect()->back()->with('success', 'Pesanan telah ditandai sebagai selesai');
    }

    /**
     * Cancel an order
     */
    public function cancel($id)
    {
        $order = Order::findOrFail($id);

        // Validate ownership
        $this->validateUserOwnership($order);

        // Validasi status pembayaran
        if ($order->payment_status === 'paid') {
            return redirect()->back()->with('error', 'Pesanan yang sudah dibayar tidak dapat dibatalkan');
        }

        // Validasi status pesanan
        if (!in_array($order->status, ['pending', 'processing'])) {
            return redirect()->back()->with('error', 'Hanya pesanan yang masih pending atau processing yang dapat dibatalkan');
        }

        // Update order status
        $order->update([
            'status' => 'cancelled',
            'payment_status' => 'failed'
        ]);

        // Trigger order status changed event
        event(new \App\Events\OrderStatusChanged($order, $order->status, 'cancelled'));

        return redirect()->back()->with('success', 'Pesanan berhasil dibatalkan');
    }

    /**
     * Display order by order number (more secure)
     */
    public function showByOrderNumber($orderNumber)
    {
        $order = Order::where('order_number', $orderNumber)
            ->with(['items.product.images', 'shippingAddress'])
            ->firstOrFail();

        // CRITICAL: Validate ownership to prevent unauthorized access
        $this->validateUserOwnership($order);

        // Transform product images to array format for frontend
        foreach ($order->items as $item) {
            $item->product->images = collect($item->product->images)->pluck('image')->all();
        }

        return Inertia::render('User/OrderDetail', [
            'order' => $order,
        ]);
    }

    /**
     * Cancel order by order number (more secure)
     */
    public function cancelByOrderNumber($orderNumber)
    {
        $order = Order::where('order_number', $orderNumber)->firstOrFail();

        // Validate ownership
        $this->validateUserOwnership($order);

        // Validasi status pembayaran
        if ($order->payment_status === 'paid') {
            return redirect()->back()->with('error', 'Pesanan yang sudah dibayar tidak dapat dibatalkan');
        }

        // Validasi status pesanan
        if (!in_array($order->status, ['pending', 'processing'])) {
            return redirect()->back()->with('error', 'Hanya pesanan yang masih pending atau processing yang dapat dibatalkan');
        }

        // Update order status
        $order->update([
            'status' => 'cancelled',
            'payment_status' => 'failed'
        ]);

        // Trigger order status changed event
        event(new \App\Events\OrderStatusChanged($order, $order->status, 'cancelled'));

        return redirect()->back()->with('success', 'Pesanan berhasil dibatalkan');
    }

    /**
     * Mark order as completed by order number (more secure)
     */
    public function markAsCompletedByOrderNumber($orderNumber)
    {
        $order = Order::where('order_number', $orderNumber)->firstOrFail();

        // Validate ownership
        $this->validateUserOwnership($order);

        // Only shipped orders can be marked as completed
        if ($order->status !== 'shipped') {
            return redirect()->back()->with('error', 'Hanya pesanan yang sudah dikirim yang dapat ditandai selesai');
        }

        $order->update(['status' => 'completed']);
        return redirect()->back()->with('success', 'Pesanan telah ditandai sebagai selesai');
    }
}
