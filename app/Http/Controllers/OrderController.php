<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OrderController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user = auth()->user();
        
        $orders = Order::where('user_id', $user->id)
            ->with(['items.product.images'])
            ->latest()
            ->paginate(10);

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
        $user = auth()->user();
        
        $order = Order::where('user_id', $user->id)
            ->with(['items.product.images', 'shippingAddress'])
            ->findOrFail($id);

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
        $user = auth()->user();
        
        $order = Order::where('user_id', $user->id)
            ->findOrFail($id);

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
        $user = auth()->user();
        
        $order = Order::where('user_id', $user->id)
            ->findOrFail($id);

        // Only allow cancellation of pending or processing orders
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
}
