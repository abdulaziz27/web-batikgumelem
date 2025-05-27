<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Barryvdh\DomPDF\Facade\Pdf;
use App\Models\Order;
use Inertia\Inertia;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;

class ReportController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Reports/Index');
    }

    public function sales(Request $request)
    {
        try {
            // Validasi input
            $request->validate([
                'start_date' => 'required|date',
                'end_date' => 'required|date|after_or_equal:start_date',
                'type' => 'required|in:daily,weekly,monthly',
                'format' => 'required|in:pdf'
            ]);

            // Query data
            $query = Order::with(['items.product', 'user'])
                ->whereBetween('created_at', [
                    Carbon::parse($request->start_date)->startOfDay(),
                    Carbon::parse($request->end_date)->endOfDay()
                ])
                ->where('status', '!=', 'cancelled');

            // Group by berdasarkan tipe laporan
            switch($request->type) {
                case 'daily':
                    $data = $query->get()->groupBy(function($order) {
                        return $order->created_at->format('Y-m-d');
                    })->map(function($orders) {
                        return [
                            'date' => $orders->first()->created_at->format('Y-m-d'),
                            'orders' => $orders->map(function($order) {
                                return [
                                    'id' => $order->id,
                                    'order_number' => $order->order_number,
                                    'status' => $order->status,
                                    'total_amount' => $order->total_amount,
                                    'created_at' => $order->created_at->format('d/m/Y H:i')
                                ];
                            }),
                            'total_orders' => $orders->count(),
                            'total_sales' => $orders->sum('total_amount'),
                            'completed_sales' => $orders->where('status', 'completed')->sum('total_amount')
                        ];
                    })->values();
                    break;
                case 'weekly':
                    $data = $query->get()->groupBy(function($order) {
                        return $order->created_at->format('W');
                    })->map(function($orders) {
                        return [
                            'week' => $orders->first()->created_at->format('W'),
                            'orders' => $orders->map(function($order) {
                                return [
                                    'id' => $order->id,
                                    'order_number' => $order->order_number,
                                    'status' => $order->status,
                                    'total_amount' => $order->total_amount,
                                    'created_at' => $order->created_at->format('d/m/Y H:i')
                                ];
                            }),
                            'total_orders' => $orders->count(),
                            'total_sales' => $orders->sum('total_amount'),
                            'completed_sales' => $orders->where('status', 'completed')->sum('total_amount')
                        ];
                    })->values();
                    break;
                case 'monthly':
                    $data = $query->get()->groupBy(function($order) {
                        return $order->created_at->format('Y-m');
                    })->map(function($orders) {
                        return [
                            'month' => $orders->first()->created_at->format('Y-m'),
                            'orders' => $orders->map(function($order) {
                                return [
                                    'id' => $order->id,
                                    'order_number' => $order->order_number,
                                    'status' => $order->status,
                                    'total_amount' => $order->total_amount,
                                    'created_at' => $order->created_at->format('d/m/Y H:i')
                                ];
                            }),
                            'total_orders' => $orders->count(),
                            'total_sales' => $orders->sum('total_amount'),
                            'completed_sales' => $orders->where('status', 'completed')->sum('total_amount')
                        ];
                    })->values();
                    break;
                default:
                    throw new \Exception('Invalid report type');
            }

            if ($data->isEmpty()) {
                return back()->with('error', 'Tidak ada data penjualan untuk periode yang dipilih');
            }

            // Generate PDF menggunakan DomPDF
            $pdf = PDF::loadView('admin.reports.sales', [
                'data' => $data,
                'type' => $request->type,
                'start_date' => $request->start_date,
                'end_date' => $request->end_date
            ]);

            return $pdf->download('sales-report.pdf');

        } catch (\Exception $e) {
            Log::error('Error generating sales report: ' . $e->getMessage());
            return back()->with('error', 'Terjadi kesalahan saat membuat laporan: ' . $e->getMessage());
        }
    }
}
