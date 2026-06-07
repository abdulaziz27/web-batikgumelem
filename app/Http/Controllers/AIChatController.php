<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use App\Models\Product;
use App\Models\Blog;
use App\Models\Coupon;
use App\Models\AIChatLog;
use Gemini\Laravel\Facades\Gemini;

class AIChatController extends Controller
{
    private function detectLanguage(string $text): string
    {
        $t = mb_strtolower(trim($text));
        if ($t === '') return 'id';

        // Very lightweight heuristic (good enough for chat switching)
        $enHits = 0;
        $idHits = 0;

        foreach (['what', 'which', 'where', 'when', 'who', 'why', 'how', 'price', 'cost', 'cheapest', 'most expensive', 'recommend', 'suggest', 'size', 'stock', 'shipping', 'cart', 'checkout', 'available', 'buy'] as $w) {
            if (str_contains($t, $w)) $enHits++;
        }
        foreach (['apa', 'yang', 'dimana', 'kapan', 'siapa', 'kenapa', 'bagaimana', 'harga', 'murah', 'mahal', 'termahal', 'termurah', 'rekomendasi', 'sarankan', 'ukuran', 'stok', 'ongkir', 'keranjang', 'checkout', 'tersedia', 'beli'] as $w) {
            if (str_contains($t, $w)) $idHits++;
        }

        // If it looks like mostly ASCII & has EN hints, prefer EN
        $asciiRatio = (strlen($t) > 0) ? (preg_match_all('/[a-z0-9\\s\\p{P}]/u', $t) / max(1, mb_strlen($t))) : 0;
        if ($enHits > $idHits || ($enHits > 0 && $asciiRatio > 0.85 && $idHits === 0)) return 'en';
        return 'id';
    }

    private function isShowcaseIntent(string $question): bool
    {
        $q = mb_strtolower($question);
        return str_contains($q, 'termahal')
            || str_contains($q, 'termurah')
            || (str_contains($q, 'paling') && (str_contains($q, 'mahal') || str_contains($q, 'murah')))
            || str_contains($q, 'rekom')
            || str_contains($q, 'rekomendasi')
            || str_contains($q, 'saran')
            // English intents
            || str_contains($q, 'cheapest')
            || str_contains($q, 'most expensive')
            || str_contains($q, 'recommend')
            || str_contains($q, 'suggest');
    }

    private function pickProductsForShowcase(string $question)
    {
        $q = mb_strtolower($question);

        $base = Product::query()
            ->where('is_active', 1)
            ->select('id', 'name', 'slug', 'price', 'image');

        // Heuristik ringan: tangkap intent umum untuk etalase
        if (
            str_contains($q, 'termahal')
            || (str_contains($q, 'paling') && str_contains($q, 'mahal'))
            || str_contains($q, 'most expensive')
        ) {
            return $base->orderByDesc('price')->limit(4)->get();
        }

        if (
            str_contains($q, 'termurah')
            || (str_contains($q, 'paling') && str_contains($q, 'murah'))
            || str_contains($q, 'cheapest')
        ) {
            return $base->orderBy('price')->limit(4)->get();
        }

        if (
            str_contains($q, 'rekom')
            || str_contains($q, 'sarank')
            || str_contains($q, 'rekomendasi')
            || str_contains($q, 'recommend')
            || str_contains($q, 'suggest')
        ) {
            return $base->inRandomOrder()->limit(6)->get();
        }

        // Coba match nama produk yang ada di pertanyaan (ambil beberapa untuk hemat query)
        $candidates = $base->orderByDesc('id')->limit(20)->get();
        foreach ($candidates as $p) {
            if ($p->name && str_contains($q, mb_strtolower($p->name))) {
                return collect([$p]);
            }
        }

        return collect();
    }

    private function formatShowcaseAnswer(string $question, $showcase, string $lang): string
    {
        $q = mb_strtolower($question);
        $title = $lang === 'en' ? 'Here are some of our products:' : 'Berikut beberapa produk kami:';

        if (
            str_contains($q, 'termahal')
            || (str_contains($q, 'paling') && str_contains($q, 'mahal'))
            || str_contains($q, 'most expensive')
        ) {
            $title = $lang === 'en' ? 'Our most expensive product right now:' : 'Produk termahal kami saat ini:';
        } elseif (
            str_contains($q, 'termurah')
            || (str_contains($q, 'paling') && str_contains($q, 'murah'))
            || str_contains($q, 'cheapest')
        ) {
            $title = $lang === 'en' ? 'Our cheapest product right now:' : 'Produk termurah kami saat ini:';
        } elseif (
            str_contains($q, 'rekom')
            || str_contains($q, 'rekomendasi')
            || str_contains($q, 'saran')
            || str_contains($q, 'recommend')
            || str_contains($q, 'suggest')
        ) {
            $title = $lang === 'en' ? 'Product recommendations for you:' : 'Rekomendasi produk untuk kamu:';
        }

        $lines = collect($showcase)->take(6)->values()->map(function ($p, $i) {
            $n = $i + 1;
            $name = $p['name'] ?? '';
            $slug = $p['slug'] ?? '';
            $price = number_format((float) ($p['price'] ?? 0), 0, ',', '.');
            return "{$n}. {$name} — Rp{$price}\n   /products/{$slug}";
        })->implode("\n");

        $cta = $lang === 'en'
            ? 'Click a product to view details or press Add to cart.'
            : 'Klik salah satu produk untuk lihat detail atau tekan Add to cart.';

        return trim($title . "\n" . $lines . "\n\n" . $cta);
    }

    /**
     * Endpoint untuk menerima pertanyaan dari user dan menjawab dengan AI Gemini.
     */
    public function ask(Request $request)
    {
        $t0 = hrtime(true);
        $modelName = 'gemini-2.5-flash';

        // Validasi input pertanyaan
        $request->validate([
            'question' => 'required|string|max:1000',
        ]);

        $question = $request->input('question');
        $lang = $this->detectLanguage($question);

        // Helper: potong teks untuk hemat token (kuota gratis terbatas)
        $trim = fn ($s, $max = 120) => mb_strlen($s) > $max ? mb_substr($s, 0, $max) . '...' : $s;

        // 1. FAQ — maksimal 6 item (hemat token)
        $faq = array_slice(config('faq', []), 0, 6);
        $faqText = collect($faq)->map(function($item, $i) use ($trim) {
            return ($i+1) . ". Q: {$item['question']}\nA: " . $trim($item['answer'] ?? '', 200);
        })->implode("\n\n");

        // 2. Halaman statis — skip isi panjang, hanya daftar judul (hemat token)
        $staticText = "Info lengkap: Sejarah, Syarat & Ketentuan, Kebijakan Privasi ada di website.";

        // 3. Produk — maksimal 8, deskripsi dipotong
        $products = Product::with('sizes')
            ->where('is_active', 1)
            ->select('id', 'name', 'slug', 'description', 'price', 'image')
            ->take(8)
            ->get();
        $productText = $products->map(function($p, $i) use ($trim) {
            $sizeInfo = $p->sizes->take(5)->map(fn($s) => $s->size)->implode(', ');
            return ($i+1) . ". {$p->name} | Rp" . number_format($p->price) . " | Ukuran: {$sizeInfo}. " . $trim($p->description ?? '', 80);
        })->implode("\n");

        // 4. Blog — maksimal 5 judul
        $blogText = Blog::select('title')->latest()->take(5)->get()
            ->map(fn($b, $i) => ($i+1) . ". {$b->title}")->implode("\n");

        // 5. Kupon — maksimal 3, format ringkas
        $now = now();
        $couponText = Coupon::where('active', 1)
            ->where(function($q) use ($now) {
                $q->whereNull('valid_until')->orWhere('valid_until', '>=', $now);
            })
            ->take(3)
            ->get()
            ->map(fn($c, $i) => ($i+1) . ". {$c->code} ({$c->discount_percent}%)")
            ->implode("\n");

        $context = "FAQ:\n$faqText\n\nLainnya: $staticText\n\nProduk:\n$productText\n\nBlog:\n$blogText\n\nKupon: $couponText";
        $styleRules = <<<TXT
Aturan format jawaban:
- Output harus PLAIN TEXT (bukan markdown). Jangan gunakan karakter seperti *, **, _, `, atau blok kode.
- Gunakan daftar bernomor 1., 2., 3. ATAU bullet dengan '-' agar rapi jika menyebut beberapa item.
- Jika menyebut produk, sertakan link yang bisa diklik dengan format: /products/<slug>
- Hindari kalimat "Tentu, dengan senang hati!" dan hindari gaya yang terasa AI.
- Maksimal 6 baris jika memungkinkan.
TXT;

        $langRule = $lang === 'en'
            ? "Language rule: Reply in ENGLISH. Do not mix Indonesian unless the user uses Indonesian."
            : "Aturan bahasa: Balas dalam Bahasa Indonesia. Jangan campur bahasa Inggris kecuali user memakai bahasa Inggris.";

        $prompt = "Kamu asisten BatikGumelem.com. Jawab singkat, natural, dan ramah. Hanya gunakan info di bawah. Jika tidak ada di context, arahkan hubungi admin/website.\n\n$langRule\n\n$styleRules\n\n$context\n\nPertanyaan: $question";

        try {
            // Kirim prompt ke Gemini dan ambil jawaban
            $result = Gemini::generativeModel(model: $modelName)->generateContent($prompt);
            $answer = $result->text() ?? null;
            if (!$answer || strlen(trim($answer)) < 5) {
                $answer = 'Maaf, untuk pertanyaan ini silakan hubungi admin kami melalui WhatsApp atau email.';
            }

            // Sanitasi ringan jika model masih mengeluarkan markdown
            $answer = preg_replace('/[`*_]{1,}/', '', $answer);
            $answer = preg_replace('/\n{3,}/', "\n\n", $answer);
            $answer = trim((string) $answer);

            $showcase = $this->pickProductsForShowcase($question)
                ->map(function ($p) {
                    return [
                        'id' => (int) $p->id,
                        'name' => $p->name,
                        'slug' => $p->slug,
                        'price' => (float) $p->price,
                        'image' => $p->image,
                        'url' => route('products.show', $p->slug),
                    ];
                })
                ->values();

            // Kalau intent-nya jelas terkait produk, gunakan format deterministik agar rapi & konsisten
            if ($showcase->count() > 0 && $this->isShowcaseIntent($question)) {
                $answer = $this->formatShowcaseAnswer($question, $showcase, $lang);
            }

            $latencyMs = (int) ((hrtime(true) - $t0) / 1_000_000);

            // Best-effort token extraction (varies by SDK/version)
            $promptTokens = null;
            $completionTokens = null;
            $totalTokens = null;
            try {
                if (is_object($result)) {
                    if (method_exists($result, 'usageMetadata')) {
                        $usage = $result->usageMetadata();
                        if (is_array($usage)) {
                            $promptTokens = $usage['promptTokenCount'] ?? $usage['prompt_tokens'] ?? null;
                            $completionTokens = $usage['candidatesTokenCount'] ?? $usage['completion_tokens'] ?? null;
                            $totalTokens = $usage['totalTokenCount'] ?? $usage['total_tokens'] ?? null;
                        }
                    } elseif (property_exists($result, 'usageMetadata') && is_array($result->usageMetadata)) {
                        $usage = $result->usageMetadata;
                        $promptTokens = $usage['promptTokenCount'] ?? $usage['prompt_tokens'] ?? null;
                        $completionTokens = $usage['candidatesTokenCount'] ?? $usage['completion_tokens'] ?? null;
                        $totalTokens = $usage['totalTokenCount'] ?? $usage['total_tokens'] ?? null;
                    }
                }
            } catch (\Throwable $e) {
                // ignore usage parsing errors
            }

            AIChatLog::create([
                'user_id' => optional($request->user())->id,
                'session_id' => $request->session()->getId(),
                'model' => $modelName,
                'lang' => $lang,
                'question' => $question,
                'question_length' => mb_strlen($question),
                'answer_length' => mb_strlen((string) $answer),
                'latency_ms' => $latencyMs,
                'success' => true,
                'prompt_tokens' => is_numeric($promptTokens) ? (int) $promptTokens : null,
                'completion_tokens' => is_numeric($completionTokens) ? (int) $completionTokens : null,
                'total_tokens' => is_numeric($totalTokens) ? (int) $totalTokens : null,
                'ip' => $request->ip(),
                'user_agent' => substr((string) $request->userAgent(), 0, 512),
            ]);

            return response()->json([
                'answer' => $answer,
                'products' => $showcase,
            ], 200);
        } catch (\Illuminate\Database\QueryException $e) {
            \Log::error('AI Chat DB Error: ' . $e->getMessage(), ['exception' => $e]);
            $userMsg = 'Maaf, terjadi gangguan teknis (database). Silakan hubungi admin.';
            $latencyMs = (int) ((hrtime(true) - $t0) / 1_000_000);
            AIChatLog::create([
                'user_id' => optional($request->user())->id,
                'session_id' => $request->session()->getId(),
                'model' => $modelName,
                'lang' => $lang,
                'question' => $question,
                'question_length' => mb_strlen($question),
                'answer_length' => mb_strlen((string) $userMsg),
                'latency_ms' => $latencyMs,
                'success' => false,
                'error_type' => 'db',
                'error_message' => substr($e->getMessage(), 0, 2000),
                'ip' => $request->ip(),
                'user_agent' => substr((string) $request->userAgent(), 0, 512),
            ]);
            return response()->json(['answer' => $userMsg, 'products' => []], 200);
        } catch (\Exception $e) {
            \Log::error('AI Chat Error: ' . $e->getMessage(), ['exception' => $e]);
            $errorMsg = $e->getMessage();
            if (str_contains(strtolower($errorMsg), 'quota') || str_contains(strtolower($errorMsg), 'quota exceeded')) {
                $userMsg = 'Batas penggunaan AI (kuota gratis) telah tercapai. Silakan coba lagi nanti (biasanya reset per menit/jam) atau hubungi admin untuk pengecekan API key.';
            } elseif (str_contains(strtolower($errorMsg), 'overloaded') || str_contains(strtolower($errorMsg), 'rate limit')) {
                $userMsg = 'Maaf, server AI sedang sibuk atau terkena batas penggunaan. Silakan coba beberapa saat lagi.';
            } elseif (str_contains(strtolower($errorMsg), 'expired') || str_contains(strtolower($errorMsg), 'renew the api key')) {
                $userMsg = 'API key Gemini kedaluwarsa. Admin perlu buat key baru di Google AI Studio (aistudio.google.com/app/apikey) dan perbarui di .env (GEMINI_API_KEY).';
            } elseif (str_contains(strtolower($errorMsg), 'api key') || str_contains(strtolower($errorMsg), '403') || str_contains(strtolower($errorMsg), '401')) {
                $userMsg = 'Maaf, layanan AI sementara tidak tersedia. Periksa API key di .env (GEMINI_API_KEY). Silakan hubungi admin.';
            } else {
                $userMsg = 'Maaf, terjadi gangguan teknis. Silakan hubungi admin.';
            }
            $latencyMs = (int) ((hrtime(true) - $t0) / 1_000_000);
            AIChatLog::create([
                'user_id' => optional($request->user())->id,
                'session_id' => $request->session()->getId(),
                'model' => $modelName,
                'lang' => $lang,
                'question' => $question,
                'question_length' => mb_strlen($question),
                'answer_length' => mb_strlen((string) $userMsg),
                'latency_ms' => $latencyMs,
                'success' => false,
                'error_type' => 'provider',
                'error_message' => substr($e->getMessage(), 0, 2000),
                'ip' => $request->ip(),
                'user_agent' => substr((string) $request->userAgent(), 0, 512),
            ]);
            return response()->json(['answer' => $userMsg, 'products' => []], 200);
        }
    }
}
