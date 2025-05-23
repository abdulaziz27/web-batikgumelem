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
                    $data = $query->groupBy(DB::raw('DATE(created_at)'))
                        ->select(
                            DB::raw('DATE(created_at) as date'),
                            DB::raw('COUNT(*) as total_orders'),
                            DB::raw('SUM(total_amount) as total_sales')
                        )
                        ->get();
                    break;
                case 'weekly':
                    $data = $query->groupBy(DB::raw('YEARWEEK(created_at)'))
                        ->select(
                            DB::raw('YEARWEEK(created_at) as week'),
                            DB::raw('COUNT(*) as total_orders'),
                            DB::raw('SUM(total_amount) as total_sales')
                        )
                        ->get();
                    break;
                case 'monthly':
                    $data = $query->groupBy(DB::raw('DATE_FORMAT(created_at, "%Y-%m")'))
                        ->select(
                            DB::raw('DATE_FORMAT(created_at, "%Y-%m") as month'),
                            DB::raw('COUNT(*) as total_orders'),
                            DB::raw('SUM(total_amount) as total_sales')
                        )
                        ->get();
                    break;
                default:
                    throw new \Exception('Invalid report type');
            }

            if ($data->isEmpty()) {
                return response()->json([
                    'message' => 'Tidak ada data penjualan untuk periode yang dipilih'
                ], 404);
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
            return response()->json([
                'message' => 'Terjadi kesalahan saat membuat laporan: ' . $e->getMessage()
            ], 500);
        }
    }
}
