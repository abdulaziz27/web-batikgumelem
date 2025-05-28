<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Blog;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        // Collect stats for dashboard
        $stats = [
            'products' => Product::count(),
            'orders' => Order::count(),
            'blogs' => Blog::count(),
            'users' => User::count(),
            'total_revenue' => Order::where('status', 'completed')
                ->where('payment_status', 'paid')
                ->sum('total_amount'),
            'pending_revenue' => Order::whereIn('status', ['pending', 'processing', 'shipped'])
                ->where('payment_status', 'paid')
                ->sum('total_amount'),
        ];

        return Inertia::render('Admin/Dashboard', [
            'stats' => $stats
        ]);
    }
} 