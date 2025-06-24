<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use App\Models\Product;
use App\Models\Blog;
use App\Models\Coupon;
use Gemini\Laravel\Facades\Gemini;

class AIChatController extends Controller
{
    public function ask(Request $request)
    {
        $request->validate([
            'question' => 'required|string|max:1000',
        ]);

        $question = $request->input('question');
        $apiKey = env('GEMINI_API_KEY');
        $endpoint = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=' . $apiKey;

        // 1. Ambil FAQ
        $faq = config('faq');
        $faqText = collect($faq)->map(function($item, $i) {
            return ($i+1) . ". Q: {$item['question']}\nA: {$item['answer']}";
        })->implode("\n\n");

        // 2. Ambil konten page statis (markdown/html)
        $staticPages = [
            'Sejarah' => resource_path('content/sejarah.md'),
            'Syarat & Ketentuan' => resource_path('content/terms.md'),
            'Kebijakan Privasi' => resource_path('content/privacy.md'),
        ];
        $staticText = collect($staticPages)->map(function($path, $title) {
            return file_exists($path) ? "== $title ==\n" . file_get_contents($path) : '';
        })->implode("\n\n");

        // 3. Produk (detail lengkap)
        $products = Product::with('sizes')->select('name','description','price','image')->get();
        $productText = $products->map(function($p, $i) {
            $totalStock = $p->sizes->sum('stock');
            $sizeInfo = $p->sizes->map(function($s) {
                return "{$s->size} (stok: {$s->stock})";
            })->implode(', ');
            return ($i+1) . ". {$p->name}\nDeskripsi: {$p->description}\nHarga: Rp{$p->price}\nTotal Stok: {$totalStock}\nUkuran: {$sizeInfo}\nGambar: " . ($p->image ?? '-');
        })->implode("\n\n");

        // 4. Blog (judul saja)
        $blogs = Blog::select('title')->latest()->take(10)->get();
        $blogText = $blogs->map(function($b, $i) {
            return ($i+1) . ". {$b->title}";
        })->implode("\n");

        // 5. Kupon aktif
        $now = now();
        $coupons = Coupon::where('active', 1)
            ->where(function($q) use ($now) {
                $q->whereNull('valid_until')->orWhere('valid_until', '>=', $now);
            })->get();
        $couponText = $coupons->map(function($c, $i) {
            return ($i+1) . ". Kode: {$c->code}, Diskon: {$c->discount_percent}%, Berlaku: {$c->valid_from} s/d {$c->valid_until}";
        })->implode("\n");

        // Gabungkan context
        $context = "FAQ:\n$faqText\n\n" .
                   "Sejarah, Syarat, dsb:\n$staticText\n\n" .
                   "Produk:\n$productText\n\n" .
                   "Blog Terbaru:\n$blogText\n\n" .
                   "Kupon Aktif:\n$couponText";

        $prompt = "Kamu adalah asisten BatikGumelem.com. Jawab pertanyaan customer dengan ramah dan informatif. Gunakan hanya informasi berikut ini:\n\n$context\n\nJika kamu tidak yakin atau pertanyaan di luar context, arahkan user untuk menghubungi admin.\n\nPertanyaan: $question";

        try {
            $result = Gemini::generativeModel(model: 'gemini-2.0-flash')->generateContent($prompt);
            $answer = $result->text() ?? null;
            if (!$answer || strlen(trim($answer)) < 5) {
                $answer = 'Maaf, untuk pertanyaan ini silakan hubungi admin kami melalui WhatsApp atau email.';
            }
            return response()->json(['answer' => $answer], 200);
        } catch (\Exception $e) {
            \Log::error('AI Chat Error: ' . $e->getMessage(), ['exception' => $e]);
            $errorMsg = $e->getMessage();
            if (str_contains(strtolower($errorMsg), 'overloaded') || str_contains(strtolower($errorMsg), 'rate limit')) {
                $userMsg = 'Maaf, server AI sedang sibuk atau terkena batas penggunaan. Silakan coba beberapa saat lagi.';
            } else {
                $userMsg = 'Maaf, terjadi gangguan teknis. Silakan hubungi admin.';
            }
            return response()->json([
                'answer' => $userMsg
            ], 200);
        }
    }
}
