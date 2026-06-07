<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Blog;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use App\Models\AIChatLog;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    // Menampilkan dashboard admin dengan statistik
    public function index()
    {
        // Mengumpulkan statistik untuk dashboard
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

        // AI Chat usage (last 30 days + month-to-date)
        $from30 = now()->subDays(30);
        $fromMonth = now()->startOfMonth();

        $aiMonth = AIChatLog::where('created_at', '>=', $fromMonth);
        $aiMonthTotal = (clone $aiMonth)->count();
        $aiMonthErrors = (clone $aiMonth)->where('success', false)->count();
        $aiMonthAvgLatency = (clone $aiMonth)->whereNotNull('latency_ms')->avg('latency_ms');
        $aiMonthTokens = (clone $aiMonth)->sum(DB::raw('COALESCE(total_tokens, 0)'));

        $aiDaily = AIChatLog::where('created_at', '>=', $from30)
            ->selectRaw('DATE(created_at) as day')
            ->selectRaw('COUNT(*) as requests')
            ->selectRaw('SUM(CASE WHEN success = 0 THEN 1 ELSE 0 END) as errors')
            ->selectRaw('AVG(latency_ms) as avg_latency_ms')
            ->selectRaw('SUM(COALESCE(total_tokens, 0)) as total_tokens')
            ->groupBy('day')
            ->orderBy('day', 'asc')
            ->get();

        $aiTopQuestions = AIChatLog::where('created_at', '>=', $from30)
            ->whereNotNull('question')
            ->selectRaw('question, COUNT(*) as cnt')
            ->groupBy('question')
            ->orderByDesc('cnt')
            ->limit(7)
            ->get()
            ->map(fn ($r) => ['question' => $r->question, 'count' => (int) $r->cnt]);

        $aiStats = [
            'month' => [
                'requests' => (int) $aiMonthTotal,
                'tokens' => (int) $aiMonthTokens,
                'error_rate' => $aiMonthTotal > 0 ? ($aiMonthErrors / $aiMonthTotal) : 0,
                'avg_latency_ms' => $aiMonthAvgLatency ? (float) $aiMonthAvgLatency : null,
            ],
            'daily' => $aiDaily->map(fn ($r) => [
                'day' => $r->day,
                'requests' => (int) $r->requests,
                'tokens' => (int) $r->total_tokens,
                'error_rate' => ((int) $r->requests) > 0 ? (((int) $r->errors) / ((int) $r->requests)) : 0,
                'avg_latency_ms' => $r->avg_latency_ms ? (float) $r->avg_latency_ms : null,
            ]),
            'top_questions' => $aiTopQuestions,
        ];

        return Inertia::render('Admin/Dashboard', [
            'stats' => $stats,
            'ai_stats' => $aiStats,
        ]);
    }
} 