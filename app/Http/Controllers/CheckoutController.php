<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\ShippingAddress;
use App\Services\BiteshipService;
use App\Services\CartService;
use App\Services\MidtransService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Session;
use Inertia\Inertia;
use App\Events\OrderStatusChanged;

class CheckoutController extends Controller
{
    protected $cartService;
    protected $biteshipService;
    protected $midtransService;

    public function __construct(
        CartService $cartService,
        BiteshipService $biteshipService,
        MidtransService $midtransService
    ) {
        $this->cartService = $cartService;
        $this->biteshipService = $biteshipService;
        $this->midtransService = $midtransService;
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $cart = $this->cartService->getCart();
        if (empty($cart['items'])) {
            return redirect()->route('cart.index')->with('error', 'Your cart is empty');
        }
        $shippingOptions = session('shippingOptions', []);
        session()->forget('shippingOptions');
        $savedAddresses = [];
        if (auth()->check()) {
            // Coba ambil alamat default
            $defaultAddress = \App\Models\ShippingAddress::where('user_id', auth()->id())
                ->where('is_default', true)
                ->whereNotNull('user_id')
                ->where('is_order_address', true)
                ->first();

            if ($defaultAddress) {
                $savedAddresses = [$defaultAddress];
            } else {
                // Jika tidak ada alamat default, ambil alamat terakhir
                $lastAddress = \App\Models\ShippingAddress::where('user_id', auth()->id())
                    ->whereNotNull('user_id')
                    ->where('is_order_address', false)
                    ->latest()
                    ->first();
                
                if ($lastAddress) {
                    $savedAddresses = [$lastAddress];
                }
            }
        }
        return Inertia::render('Checkout', [
            'cart' => $cart,
            'coupon' => session('coupon'),
            'shippingOptions' => $shippingOptions,
            'savedAddresses' => $savedAddresses,
            'auth' => [
                'check' => auth()->check(),
                'user' => auth()->check() ? auth()->user() : null,
            ],
        ]);
    }

    public function calculateShipping(Request $request)
    {
        try {
            $request->validate([
                'city' => 'required|string',
                'postal_code' => 'required|string',
            ]);

            $cart = $this->cartService->getCart();

            if (empty($cart['items'])) {
                \Log::warning('Empty cart when calculating shipping');
                return back()->with('error', 'Keranjang belanja kosong');
            }

            // Calculate total weight (assuming 500g per item for example)
            $totalWeight = 0;
            foreach ($cart['items'] as $item) {
                $totalWeight += 500 * $item['quantity']; // 500g per item
            }

            // Convert to kg
            $weightInKg = $totalWeight / 1000;

            \Log::info('Calculating shipping cost', [
                'origin' => config('services.biteship.origin_postal_code'),
                'destination' => $request->postal_code,
                'weight' => $weightInKg,
                'cart_items' => $cart['items']
            ]);

            // Get shipping options from Biteship
            $shippingOptions = $this->biteshipService->getShippingCost(
                config('services.biteship.origin_postal_code'),
                $request->postal_code,
                $weightInKg,
                null,
                array_values($cart['items'])
            );

            \Log::info('Shipping options response', ['response' => $shippingOptions]);

            if (!$shippingOptions['success']) {
                return back()->with('error', $shippingOptions['message']);
            }

            // Simpan shippingOptions ke session
            session(['shippingOptions' => $shippingOptions['data']]);

            // Redirect ke halaman checkout (GET)
            return redirect()->route('checkout.index');
        } catch (\Exception $e) {
            \Log::error('Shipping calculation error', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return back()->with('error', 'Error calculating shipping cost: ' . $e->getMessage());
        }
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
        $cart = $this->cartService->getCart();
        if (empty($cart['items'])) {
            return redirect()->route('cart.index')->with('error', 'Your cart is empty');
        }
        $validationRules = [
            'shipping_method' => 'required|array',
            'shipping_method.id' => 'required|string',
            'shipping_method.company' => 'required|string',
            'shipping_method.name' => 'required|string',
            'shipping_method.price' => 'required|numeric',
            'payment_method' => 'required|string|in:bank_transfer,e_wallet,cod',
            'notes' => 'nullable|string',
        ];
        if ($request->has('saved_address_id') && $request->saved_address_id) {
            $validationRules['saved_address_id'] = 'required|exists:shipping_addresses,id';
        } else {
            $validationRules['shipping_address'] = 'required|array';
            $validationRules['shipping_address.full_name'] = 'required|string|min:3|max:255';
            $validationRules['shipping_address.address'] = 'required|string|min:10|max:500';
            $validationRules['shipping_address.city'] = 'required|string|min:3|max:100';
            $validationRules['shipping_address.province'] = 'required|string|min:3|max:100';
            $validationRules['shipping_address.postal_code'] = 'required|string|regex:/^[0-9]{5}$/';
            $validationRules['shipping_address.phone'] = 'required|string|regex:/^[0-9]{10,15}$/';
        }
        $request->validate($validationRules, [
            'shipping_address.full_name.required' => 'Nama lengkap wajib diisi.',
            'shipping_address.full_name.min' => 'Nama lengkap minimal 3 karakter.',
            'shipping_address.address.required' => 'Alamat lengkap wajib diisi.',
            'shipping_address.address.min' => 'Alamat minimal 10 karakter.',
            'shipping_address.city.required' => 'Nama kota wajib diisi.',
            'shipping_address.city.min' => 'Nama kota minimal 3 karakter.',
            'shipping_address.province.required' => 'Nama provinsi wajib diisi.',
            'shipping_address.province.min' => 'Nama provinsi minimal 3 karakter.',
            'shipping_address.postal_code.required' => 'Kode pos wajib diisi.',
            'shipping_address.postal_code.regex' => 'Kode pos harus berupa 5 digit angka.',
            'shipping_address.phone.required' => 'Nomor telepon wajib diisi.',
            'shipping_address.phone.regex' => 'Nomor telepon harus berupa angka 10-15 digit.',
            'shipping_method.required' => 'Metode pengiriman wajib dipilih.',
            'payment_method.required' => 'Metode pembayaran wajib dipilih.',
            'payment_method.in' => 'Metode pembayaran tidak valid.',
        ]);
        // Start DB transaction
        return \DB::transaction(function () use ($request, $cart) {
            $subtotal = $cart['total'];
            $shippingCost = $request->shipping_method['price'];
            $discount = 0;
            if (session()->has('coupon')) {
                $coupon = session('coupon');
                $discount = ($subtotal * $coupon['discount_percent']) / 100;
            }
            $total = $subtotal + $shippingCost - $discount;
            // Create shipping address first
            if ($request->has('saved_address_id') && $request->saved_address_id && auth()->check()) {
                $savedAddress = \App\Models\ShippingAddress::where('id', $request->saved_address_id)
                    ->where('user_id', auth()->id())
                    ->firstOrFail();
                $shippingAddress = $savedAddress->replicate();
                $shippingAddress->is_order_address = true;  // Set sebagai alamat pesanan
                $shippingAddress->save();
            } else {
                $shippingAddress = \App\Models\ShippingAddress::create([
                    'user_id' => auth()->id(),
                    'full_name' => $request->shipping_address['full_name'],
                    'address' => $request->shipping_address['address'],
                    'city' => $request->shipping_address['city'],
                    'province' => $request->shipping_address['province'],
                    'postal_code' => $request->shipping_address['postal_code'],
                    'phone' => $request->shipping_address['phone'],
                    'is_default' => false,
                    'is_order_address' => true,  // Set sebagai alamat pesanan
                ]);
            }
            $order = \App\Models\Order::create([
                'user_id' => auth()->id(),
                'status' => 'pending',
                'total_price' => $subtotal,
                'total_amount' => $total,
                'shipping_address_id' => $shippingAddress->id,
                'shipping_method' => $request->shipping_method,
                'shipping_cost' => $shippingCost,
                'payment_method' => $request->payment_method,
                'payment_status' => 'pending',
                'discount' => $discount,
                'coupon_id' => session('coupon.id') ?? null,
                'notes' => $request->notes,
            ]);
            foreach ($cart['items'] as $item) {
                \App\Models\OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $item['id'],
                    'quantity' => $item['quantity'],
                    'price' => $item['price'],
                    'size' => $item['size'],
                ]);
            }
            $this->cartService->clearCart();
            session()->forget('coupon');

            // TAMBAHKAN INI: Buat transaksi Midtrans
            $transaction = $this->midtransService->createTransaction($order);

            if (!$transaction['success']) {
                // Log the error
                \Log::error('Failed to create Midtrans transaction', [
                    'order_id' => $order->id,
                    'error' => $transaction['message'] ?? 'Unknown error'
                ]);
            }


            // Redirect langsung ke pending (menggabungkan payment dan pending)
            return redirect()->route('checkout.pending', [
                'order_number' => $order->order_number,
            ]);
        });
    }

    public function payment(Request $request)
    {
        if (!$request->has('order_id') || !$request->order_id) {
            return redirect()->route('home')->with('error', 'Invalid order data');
        }

        $order = Order::findOrFail($request->order_id);

        // Ensure payment_url never null
        $paymentUrl = $request->payment_url ?? $order->payment_url ?? '';
        
        \Log::info('Payment page accessed', [
            'order_id' => $order->id,
            'payment_token' => $order->payment_token,
            'payment_url' => $request->payment_url ?? $order->payment_url
        ]);
        
        return Inertia::render('CheckoutPayment', [
            'order' => $order,
            'payment_url' => $paymentUrl,
            'midtrans_client_key' => config('services.midtrans.client_key'),
            'is_production' => config('services.midtrans.is_production', false),
        ]);
    }

    public function success(Request $request)
    {
        // Get order_number parameter - this should be the customer-facing order number
        $orderNumber = $request->order_number;
        
        // Support legacy order_id parameter for backward compatibility 
        if (!$orderNumber && $request->order_id) {
            $legacyOrderId = $request->order_id;
            // If it's Midtrans format (ORD-X-timestamp), extract the database ID
            if (strpos($legacyOrderId, 'ORD-') === 0) {
                $parts = explode('-', $legacyOrderId);
                $dbId = $parts[1] ?? null;
                if ($dbId) {
                    $order = Order::find($dbId);
                    if ($order) {
                        // Redirect to use proper order_number format
                        return redirect()->route('checkout.success', ['order_number' => $order->order_number]);
                    }
                }
            }
        }
        \Log::info('Success page accessed', ['order_param' => $orderNumber]);
        
        if (!$orderNumber) {
            \Log::error('No order_number provided in success page');
            return redirect()->route('home')->with('error', 'Parameter pesanan tidak valid');
        }
        
        // Find order by order_number (customer-facing format: ORD-YYYYMMDD-XXXX)
        $order = Order::where('order_number', $orderNumber)->first();

        if (!$order) {
            \Log::error('Order not found in success page', ['order_param' => $orderNumber]);
            return redirect()->route('home')->with('error', 'Pesanan tidak ditemukan');
        }
        
        // If payment status is not paid yet, try to update it first
        if ($order->payment_status !== 'paid') {
            \Log::info('Payment status not paid, checking Midtrans status', [
                'order_id' => $order->id,
                'current_status' => $order->payment_status
            ]);
            
            // Try to update order status from Midtrans
            $result = $this->midtransService->checkAndUpdateOrderStatus($order);
            
            if ($result['success'] && $result['updated']) {
                // Refresh order data
                $order->refresh();
                \Log::info('Order status updated from Midtrans', [
                    'order_id' => $order->id,
                    'new_payment_status' => $order->payment_status
                ]);
            }
            
            // Check again after potential update
            if ($order->payment_status !== 'paid') {
                if ($order->payment_status === 'pending') {
                    return redirect()->route('checkout.pending', ['order_number' => $order->order_number]);
                } else {
                    return redirect()->route('checkout.failed', ['order_number' => $order->order_number]);
                }
            }
        }
        
        return Inertia::render('CheckoutSuccess', [
            'order' => $order,
        ]);
    }

    public function pending(Request $request)
    {
        // Get order_number parameter - this should be the customer-facing order number
        $orderNumber = $request->order_number;
        
        // Support legacy order_id parameter for backward compatibility 
        if (!$orderNumber && $request->order_id) {
            $legacyOrderId = $request->order_id;
            // If it's Midtrans format (ORD-X-timestamp), extract the database ID
            if (strpos($legacyOrderId, 'ORD-') === 0) {
                $parts = explode('-', $legacyOrderId);
                $dbId = $parts[1] ?? null;
                if ($dbId) {
                    $order = Order::find($dbId);
                    if ($order) {
                        // Redirect to use proper order_number format
                        return redirect()->route('checkout.pending', ['order_number' => $order->order_number]);
                    }
                }
            }
        }
        
        if (!$orderNumber) {
            return redirect()->route('home')->with('error', 'Parameter pesanan tidak valid');
        }
        
        // Find order by order_number (customer-facing format: ORD-YYYYMMDD-XXXX)
        $order = Order::where('order_number', $orderNumber)->first();

        if (!$order) {
            return redirect()->route('home')->with('error', 'Pesanan tidak ditemukan');
        }
        
        // Redirect to appropriate page based on payment status
        if ($order->payment_status === 'paid') {
            return redirect()->route('checkout.success', ['order_number' => $order->order_number]);
        } elseif (in_array($order->payment_status, ['failed', 'expired'])) {
            return redirect()->route('checkout.failed', ['order_number' => $order->order_number]);
        }
        
        // Update order status if needed
        if ($order->status === 'created') {
            $order->update(['status' => 'pending']);
        }

        return Inertia::render('CheckoutPending', [
            'order' => $order,
            'midtrans_client_key' => config('services.midtrans.client_key'),
            'is_production' => config('services.midtrans.is_production', false),
        ]);
    }

    public function failed(Request $request)
    {
        // Get order_number parameter - this should be the customer-facing order number
        $orderNumber = $request->order_number;
        
        // Support legacy order_id parameter for backward compatibility 
        if (!$orderNumber && $request->order_id) {
            $legacyOrderId = $request->order_id;
            // If it's Midtrans format (ORD-X-timestamp), extract the database ID
            if (strpos($legacyOrderId, 'ORD-') === 0) {
                $parts = explode('-', $legacyOrderId);
                $dbId = $parts[1] ?? null;
                if ($dbId) {
                    $order = Order::find($dbId);
                    if ($order) {
                        // Redirect to use proper order_number format
                        return redirect()->route('checkout.failed', ['order_number' => $order->order_number]);
                    }
                }
            }
        }
        
        if (!$orderNumber) {
            return redirect()->route('home')->with('error', 'Parameter pesanan tidak valid');
        }
        
        // Find order by order_number (customer-facing format: ORD-YYYYMMDD-XXXX)
        $order = Order::where('order_number', $orderNumber)->first();

        if (!$order) {
            return redirect()->route('home')->with('error', 'Pesanan tidak ditemukan');
        }
        $order->update(['status' => 'cancelled', 'payment_status' => 'failed']);
        
        // Get specific error message based on the situation
        $errorMessage = match($request->transaction_status ?? '') {
            'deny' => 'Pembayaran ditolak oleh sistem.',
            'expire' => 'Waktu pembayaran telah habis.',
            'cancel' => 'Pembayaran dibatalkan.',
            default => 'Pembayaran gagal diproses.'
        };
        
        return Inertia::render('CheckoutFailed', [
            'order' => $order,
            'error_message' => $errorMessage
        ]);
    }

    public function cancel(Request $request)
    {
        // Extract order ID from Midtrans order_id format (ORD-xx-timestamp)
        $parts = explode('-', $request->order_id);
        $orderId = $parts[1] ?? null;

        if (!$orderId) {
            return redirect()->route('home')->with('error', 'Invalid order data');
        }

        $order = Order::findOrFail($orderId);
        $order->update(['status' => 'cancelled']);
        
        return redirect()->route('orders.show', $order->id)
            ->with('info', 'Pesanan telah dibatalkan');
    }

    public function notification(Request $request)
    {
        try {
            // Ambil dan log permintaan JSON yang masuk
            $notification = json_decode($request->getContent(), true);
            \Log::info('Midtrans notification received', ['data' => $notification]);

            // Validasi notification
            $orderId = $notification['order_id'] ?? null;
            $transactionStatus = $notification['transaction_status'] ?? null;
            $fraudStatus = $notification['fraud_status'] ?? null;
            
            if (!$orderId || !$transactionStatus) {
                \Log::warning('Invalid Midtrans notification', ['data' => $notification]);
                return response()->json(['status' => 'error', 'message' => 'Invalid notification data'], 400);
            }

            // Extract order ID dari format Midtrans (ORD-xx-timestamp)
            $parts = explode('-', $orderId);
            $dbOrderId = $parts[1] ?? null;

            if (!$dbOrderId) {
                \Log::warning('Invalid order ID format', ['order_id' => $orderId]);
                return response()->json(['status' => 'error', 'message' => 'Invalid order ID format'], 400);
            }

            // Cari order di database
            $order = Order::find($dbOrderId);
            if (!$order) {
                \Log::warning('Order not found', ['order_id' => $dbOrderId]);
                return response()->json(['status' => 'error', 'message' => 'Order not found'], 404);
            }
            
            // Save original status for comparison
            $originalStatus = [
                'status' => $order->status,
                'payment_status' => $order->payment_status,
            ];
            
            // Log status sebelumnya
            \Log::info('Processing payment notification', [
                'order_id' => $dbOrderId,
                'previous_status' => $order->status,
                'previous_payment_status' => $order->payment_status,
                'transaction_status' => $transactionStatus,
                'fraud_status' => $fraudStatus
            ]);

            // Simpan status lama sebelum update
            $oldStatus = $order->status;
            
            // Update order status berdasarkan transaction_status
            switch ($transactionStatus) {
                case 'capture':
                    // Untuk kartu kredit, perlu cek fraud_status
                    if ($fraudStatus == 'challenge') {
                        $order->update([
                            'payment_status' => 'challenge',
                            'status' => 'pending'
                        ]);
                    } else {
                        $order->update([
                            'payment_status' => 'paid',
                            'status' => 'processing'
                        ]);
                    }
                    break;
                    
                case 'settlement':
                    $order->update([
                        'payment_status' => 'paid',
                        'status' => 'processing'
                    ]);
                    break;
                    
                case 'pending':
                    $order->update([
                        'payment_status' => 'pending',
                        'status' => 'pending'
                    ]);
                    break;
                    
                case 'deny':
                case 'cancel':
                case 'expire':
                    $order->update([
                        'payment_status' => 'failed',
                        'status' => 'cancelled'
                    ]);
                    break;
                    
                default:
                    $order->update([
                        'payment_status' => 'pending',
                        'status' => 'pending'
                    ]);
                    break;
            }
            
            // Trigger event jika status berubah
            if ($oldStatus !== $order->status) {
                event(new OrderStatusChanged($order, $oldStatus, $order->status));
            }
            
            // Log status setelah update
            \Log::info('Payment notification processed', [
                'order_id' => $dbOrderId,
                'new_status' => $order->status,
                'new_payment_status' => $order->payment_status
            ]);

            return response()->json(['status' => 'success']);
        } catch (\Exception $e) {
            \Log::error('Error processing Midtrans notification', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
        }
    }

    public function checkPaymentStatus($orderNumber)
    {
        try {
            // Ambil order dari database berdasarkan order_number
            $order = Order::where('order_number', $orderNumber)->firstOrFail();
            
            // Pastikan order ada
            if (!$order) {
                \Log::error('Order not found when checking payment status');
                return back()->with('error', 'Pesanan tidak ditemukan');
            }

            // Use the new method to check and update order status
            $result = $this->midtransService->checkAndUpdateOrderStatus($order);
            
            if (!$result['success']) {
                \Log::warning('Unable to check payment status from Midtrans', [
                    'order_id' => $order->id,
                    'error' => $result['message'] ?? 'Unknown error'
                ]);
                
                // Berikan pesan berdasarkan status saat ini di database
                switch ($order->payment_status) {
                    case 'pending':
                        return back()->with('info', 'Status pembayaran masih pending. Silakan lakukan pembayaran terlebih dahulu.');
                    case 'paid':
                        return back()->with('success', 'Pembayaran telah berhasil.');
                    case 'failed':
                    case 'expired':
                        return back()->with('warning', 'Pembayaran gagal atau telah kadaluarsa. Silakan buat pesanan baru.');
                    default:
                        return back()->with('info', 'Status pembayaran saat ini: ' . ucfirst($order->payment_status));
                }
            }
            
            // Refresh order untuk mendapatkan status terbaru
            $order->refresh();
            
            // Redirect berdasarkan status pembayaran terbaru
            switch ($order->payment_status) {
                case 'paid':
                    return redirect()->route('checkout.success', ['order_number' => $order->order_number])
                        ->with('success', 'Pembayaran berhasil dikonfirmasi!');
                case 'failed':
                case 'expired':
                    return redirect()->route('checkout.failed', ['order_number' => $order->order_number])
                        ->with('warning', 'Pembayaran gagal atau telah kadaluarsa.');
                case 'pending':
                    return back()->with('info', 'Status pembayaran masih pending. Silakan selesaikan pembayaran Anda.');
                case 'challenge':
                    return back()->with('warning', 'Pembayaran sedang dalam review. Mohon tunggu konfirmasi lebih lanjut.');
                default:
                    return back()->with('info', 'Status pembayaran: ' . ucfirst($order->payment_status));
            }
        } catch (\Exception $e) {
            \Log::error('Error checking payment status', [
                'order_number' => $orderNumber,
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return back()->with('error', 'Terjadi kesalahan saat mengecek status pembayaran. Silakan coba lagi.');
        }
    }

    public function applyCoupon(Request $request)
    {
        $request->validate([
            'code' => 'required|string',
        ]);

        try {
            $coupon = \App\Models\Coupon::where('code', $request->code)
                ->where('active', true)
                ->where('valid_from', '<=', now())
                ->where('valid_until', '>=', now())
                ->first();

            if (!$coupon) {
                return back()->with('error', 'Kode kupon tidak valid atau telah kadaluarsa');
            }

            // Simpan kupon ke session
            session(['coupon' => [
                'id' => $coupon->id,
                'code' => $coupon->code,
                'discount_percent' => $coupon->discount_percent,
            ]]);

            return back()->with('success', 'Kupon berhasil diterapkan');
        } catch (\Exception $e) {
            \Log::error('Error applying coupon', [
                'message' => $e->getMessage(),
                'code' => $request->code
            ]);
            return back()->with('error', 'Terjadi kesalahan saat menerapkan kupon');
        }
    }

    public function removeCoupon()
    {
        try {
            session()->forget('coupon');
            return back()->with('success', 'Kupon berhasil dihapus');
        } catch (\Exception $e) {
            \Log::error('Error removing coupon', [
                'message' => $e->getMessage()
            ]);
            return back()->with('error', 'Terjadi kesalahan saat menghapus kupon');
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
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
}