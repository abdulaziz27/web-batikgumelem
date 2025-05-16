<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\ShippingAddress;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserDashboardController extends Controller
{
    /**
     * Display the user dashboard
     */
    public function index(Request $request)
    {
        $user = auth()->user();
        
        // Get recent orders
        $recentOrders = Order::where('user_id', $user->id)
            ->latest()
            ->take(2)
            ->get()
            ->map(function ($order) {
                return [
                    'id' => $order->id,
                    'order_number' => $order->order_number,
                    'total_amount' => $order->total_amount,
                    'status' => $order->status,
                    'payment_status' => $order->payment_status,
                    'created_at' => $order->created_at,
                ];
            });
            
        // Get order statistics
        $orderStats = [
            'pending' => Order::where('user_id', $user->id)->where('status', 'pending')->count(),
            'processing' => Order::where('user_id', $user->id)->where('status', 'processing')->count(),
            'shipped' => Order::where('user_id', $user->id)->where('status', 'shipped')->count(),
            'completed' => Order::where('user_id', $user->id)->where('status', 'completed')->count(),
        ];
        
        // Get shipping addresses
        $shippingAddresses = ShippingAddress::where('user_id', $user->id)
            ->latest()
            ->get()
            ->map(function ($address) {
                return [
                    'id' => $address->id,
                    'name' => $address->name,
                    'address' => $address->address,
                    'city' => $address->city,
                    'province' => $address->province,
                ];
            });
            
        // Calculate total spent amount (for completed and shipped orders)
        $totalSpent = Order::where('user_id', $user->id)
            ->whereIn('status', ['completed', 'shipped'])
            ->where('payment_status', 'paid')
            ->sum('total_amount');
            
        return Inertia::render('User/Dashboard', [
            'recentOrders' => $recentOrders,
            'orderStats' => $orderStats,
            'shippingAddresses' => $shippingAddresses,
            'totalSpent' => $totalSpent,
        ]);
    }
} 