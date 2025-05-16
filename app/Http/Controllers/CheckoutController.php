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
        \Log::info('Checkout page accessed');
        $cart = $this->cartService->getCart();

        \Log::info('Cart structure on checkout', ['cart' => $cart]);

        if (empty($cart['items'])) {
            \Log::info('Cart is empty, redirecting to cart page');
            return redirect()->route('cart.index')->with('error', 'Your cart is empty');
        }

        // Ambil shippingOptions dari session jika ada
        $shippingOptions = session('shippingOptions', []);
        session()->forget('shippingOptions'); // Pastikan ini ada untuk membersihkan session
    
        // Get saved addresses for authenticated users
        $savedAddresses = [];
        if (auth()->check()) {
            $savedAddresses = ShippingAddress::where('user_id', auth()->id())
                ->whereNull('order_id') // Only get saved addresses, not ones tied to specific orders
                ->orderBy('is_default', 'desc')
                ->orderBy('created_at', 'desc')
                ->get();
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
                $weightInKg
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
        
        // If using saved address, require address_id. Otherwise, require full address details.
        if ($request->has('saved_address_id') && $request->saved_address_id) {
            $validationRules['saved_address_id'] = 'required|exists:shipping_addresses,id';
        } else {
            $validationRules['shipping_address'] = 'required|array';
            $validationRules['shipping_address.full_name'] = 'required|string';
            $validationRules['shipping_address.address'] = 'required|string';
            $validationRules['shipping_address.city'] = 'required|string';
            $validationRules['shipping_address.province'] = 'required|string';
            $validationRules['shipping_address.postal_code'] = 'required|string';
            $validationRules['shipping_address.phone'] = 'required|string';
        }
        
        $request->validate($validationRules);

        // Start DB transaction
        return DB::transaction(function () use ($request, $cart) {
            // Calculate total with shipping and discount
            $subtotal = $cart['total'];
            $shippingCost = $request->shipping_method['price'];
            $discount = 0;

            if (Session::has('coupon')) {
                $coupon = Session::get('coupon');
                $discount = ($subtotal * $coupon['discount_percent']) / 100;
            }

            // Calculate totals
            $total = $subtotal + $shippingCost - $discount;

            // Create shipping address first
            if ($request->has('saved_address_id') && $request->saved_address_id && auth()->check()) {
                // Find the saved address and verify it belongs to the current user
                $savedAddress = ShippingAddress::where('id', $request->saved_address_id)
                    ->where('user_id', auth()->id())
                    ->whereNull('order_id')
                    ->firstOrFail();
                
                // Clone the saved address for this order, without order_id for now
                $shippingAddress = ShippingAddress::create([
                    'user_id' => auth()->id(),
                    'full_name' => $savedAddress->full_name,
                    'address' => $savedAddress->address,
                    'city' => $savedAddress->city,
                    'province' => $savedAddress->province,
                    'postal_code' => $savedAddress->postal_code,
                    'phone' => $savedAddress->phone,
                    'is_default' => false,
                ]);
            } else {
                // Create or update shipping address
                $shippingAddressData = $request->shipping_address;

                if (auth()->check()) {
                    $shippingAddressData['user_id'] = auth()->id();
                }

                $shippingAddress = ShippingAddress::create($shippingAddressData);
                
                // If the user wants to save this address for future use
                if (auth()->check() && $request->input('save_address', false)) {
                    $isDefault = $request->input('set_as_default', false);
                    
                    if ($isDefault) {
                        // Unset any other default addresses
                        ShippingAddress::where('user_id', auth()->id())
                            ->whereNull('order_id')
                            ->update(['is_default' => false]);
                    }
                    
                    // Create a new record for the saved address (separate from the order-specific one)
                    ShippingAddress::create([
                        'user_id' => auth()->id(),
                        'order_id' => null,
                        'full_name' => $shippingAddressData['full_name'],
                        'address' => $shippingAddressData['address'],
                        'city' => $shippingAddressData['city'], 
                        'province' => $shippingAddressData['province'],
                        'postal_code' => $shippingAddressData['postal_code'],
                        'phone' => $shippingAddressData['phone'],
                        'is_default' => $isDefault,
                    ]);
                }
            }

            // Create order with shipping_address_id
            $order = Order::create([
                'user_id' => auth()->check() ? auth()->id() : null,
                'guest_email' => auth()->check() ? null : $request->input('email', 'guest@example.com'),
                'guest_name' => auth()->check() ? null : $shippingAddress->full_name,
                'status' => 'pending',
                'total_price' => $subtotal, // Subtotal before shipping and discount
                'total_amount' => $total,   // Final total including shipping and discount
                'shipping_address_id' => $shippingAddress->id, // Set shipping_address_id
                'shipping_method' => $request->shipping_method,
                'shipping_cost' => $shippingCost,
                'payment_method' => $request->payment_method,
                'payment_status' => 'pending',
                'discount' => $discount,
                'coupon_id' => Session::has('coupon') ? Session::get('coupon')['id'] : null,
                'notes' => $request->notes,
            ]);

            // Now update shipping address with order_id to complete the relationship
            $shippingAddress->order_id = $order->id;
            $shippingAddress->save();

            // Create order items
            foreach ($cart['items'] as $key => $item) {
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $item['id'],
                    'quantity' => $item['quantity'],
                    'price' => $item['price'],
                    'size' => $item['size'] ?? null,
                ]);
            }

            // Initialize payment with Midtrans
            $paymentResponse = $this->midtransService->createTransaction($order);

            if (!$paymentResponse['success']) {
                throw new \Exception('Payment initialization failed');
            }

            // Clear cart and coupon after successful order
            $this->cartService->clearCart();
            Session::forget('coupon');

            // Return payment URL for redirect
            return redirect()->route('checkout.payment', [
                'order_id' => $order->id,
                'payment_url' => $paymentResponse['redirect_url'],
            ]);
        });
    }

    public function payment(Request $request)
    {
        $order = Order::findOrFail($request->order_id);
        
        \Log::info('Payment page accessed', [
            'order_id' => $order->id,
            'payment_token' => $order->payment_token,
            'payment_url' => $request->payment_url ?? $order->payment_url
        ]);
        
        return Inertia::render('CheckoutPayment', [
            'order' => $order,
            'payment_url' => $request->payment_url ?? $order->payment_url,
        ]);
    }

    public function success(Request $request)
    {
        $order = Order::findOrFail($request->order_id);

        return Inertia::render('CheckoutSuccess', [
            'order' => $order,
        ]);
    }

    public function cancel(Request $request)
    {
        $order = Order::findOrFail($request->order_id);
        $order->update(['status' => 'cancelled']);

        return redirect()->route('home')->with('error', 'Your order has been cancelled');
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
            
            // Fix: Define status code variable, it was missing
            $statusCode = 200;
            
            // Update order status berdasarkan transaction_status
            if ($statusCode == 200) {
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
            }
            
            // Trigger event jika status berubah
            if ($oldStatus !== 'processing') {
                event(new OrderStatusChanged($order, $oldStatus, 'processing'));
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

    public function checkPaymentStatus(Request $request)
    {
        try {
            $orderId = $request->order_id;
            $order = Order::findOrFail($orderId);
            
            // Use the new method to check and update order status
            $result = $this->midtransService->checkAndUpdateOrderStatus($order);
            
            if (!$result['success']) {
                return back()->with('error', 'Gagal mengecek status pembayaran: ' . ($result['message'] ?? ''));
            }
            
            if ($result['updated']) {
                return back()->with('success', 'Status pembayaran berhasil diperbarui');
            } else {
                return back()->with('info', 'Status pembayaran tidak berubah');
            }
        } catch (\Exception $e) {
            \Log::error('Error checking payment status', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return back()->with('error', 'Gagal mengecek status pembayaran: ' . $e->getMessage());
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
