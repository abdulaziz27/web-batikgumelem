<?php

use App\Http\Controllers\BlogController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\CheckoutController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ShippingAddressController;
use App\Http\Controllers\Admin\BlogController as AdminBlogController;
use App\Http\Controllers\Admin\OrderController as AdminOrderController;
use App\Http\Controllers\Admin\ProductController as AdminProductController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\AIChatController;
use App\Http\Controllers\UserDashboardController;
use App\Http\Controllers\Admin\ReportController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\CouponController;
use App\Http\Controllers\Auth\VerifyEmailController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
*/

// Public Routes
Route::get('/', [HomeController::class, 'index'])->name('home');

// Authentication Routes
require __DIR__ . '/auth.php';

// Settings Routes
require __DIR__ . '/settings.php';

// Midtrans notification endpoint (must be public)
Route::post('/checkout/notification', [CheckoutController::class, 'notification'])
    ->name('checkout.notification')
    ->withoutMiddleware(['auth']);

// Midtrans payment callback routes
Route::get('/checkout/success', [CheckoutController::class, 'success'])->name('checkout.success');
Route::get('/checkout/pending', [CheckoutController::class, 'pending'])->name('checkout.pending');
Route::get('/checkout/failed', [CheckoutController::class, 'failed'])->name('checkout.failed');
Route::get('/checkout/cancel', [CheckoutController::class, 'cancel'])->name('checkout.cancel');

// Products, Blogs, and Public Pages
Route::get('/products', [ProductController::class, 'index'])->name('products.index');
Route::get('/products/{slug}', [ProductController::class, 'show'])->name('products.show');

Route::get('/blog', [BlogController::class, 'index'])->name('blog.index');
Route::get('/blog/{slug}', [BlogController::class, 'show'])->name('blog.show');

// About and info pages
Route::get('/history', function () {
    return Inertia::render('History');
})->name('history');

Route::get('/about', function () {
    return Inertia::render('About');
})->name('about');

Route::get('/faq', function () {
    return Inertia::render('FAQ');
})->name('faq');

Route::get('/shipping', function () {
    return Inertia::render('ShippingInfo');
})->name('shipping');

Route::get('/terms', function () {
    return Inertia::render('Terms');
})->name('terms');

Route::get('/privacy', function () {
    return Inertia::render('Privacy');
})->name('privacy');

// Routes that require authentication only (verification removed)
Route::middleware(['auth'])->group(function () {
    // Cart Routes
    Route::get('/cart', [CartController::class, 'index'])->name('cart.index');
    Route::get('/cart/data', [CartController::class, 'getData'])->name('cart.data');
    Route::post('/cart', [CartController::class, 'store'])->name('cart.store');
    Route::put('/cart', [CartController::class, 'update'])->name('cart.update');
    Route::delete('/cart', [CartController::class, 'destroy'])->name('cart.destroy');
    Route::post('/cart/clear', [CartController::class, 'clear'])->name('cart.clear');

    // Checkout Routes
    Route::get('/checkout', [CheckoutController::class, 'index'])->name('checkout.index');
    Route::post('/checkout/shipping', [CheckoutController::class, 'calculateShipping'])
        ->name('checkout.shipping');
    Route::post('/checkout', [CheckoutController::class, 'store'])->name('checkout.store');

    Route::get('/checkout/success', [CheckoutController::class, 'success'])->name('checkout.success');
    Route::get('/checkout/pending', [CheckoutController::class, 'pending'])->name('checkout.pending');
    Route::get('/checkout/failed', [CheckoutController::class, 'failed'])->name('checkout.failed');
    Route::get('/checkout/cancel', [CheckoutController::class, 'cancel'])->name('checkout.cancel');
    Route::get('/checkout/check-payment/{orderNumber}', [CheckoutController::class, 'checkPaymentStatus'])
        ->name('checkout.check-payment')
        ->where('orderNumber', 'ORD-.*');
    Route::post('/checkout/coupon', [CheckoutController::class, 'applyCoupon'])->name('checkout.coupon.apply');
    Route::delete('/checkout/coupon', [CheckoutController::class, 'removeCoupon'])->name('checkout.coupon.remove');

    // Order Routes
    Route::get('/orders', [OrderController::class, 'index'])->name('orders.index');
    Route::get('/orders/{id}', [OrderController::class, 'show'])->name('orders.show');
    Route::get('/orders/detail/{orderNumber}', [OrderController::class, 'showByOrderNumber'])
        ->name('orders.show-by-number')
        ->where('orderNumber', 'ORD-.*');
    Route::put('/orders/{id}/cancel', [OrderController::class, 'cancel'])->name('orders.cancel');
    Route::put('/orders/cancel/{orderNumber}', [OrderController::class, 'cancelByOrderNumber'])
        ->name('orders.cancel-by-number')
        ->where('orderNumber', 'ORD-.*');
    Route::put('/orders/complete/{orderNumber}', [OrderController::class, 'markAsCompletedByOrderNumber'])
        ->name('orders.complete-by-number')
        ->where('orderNumber', 'ORD-.*');

    // User Dashboard Routes
    Route::get('/dashboard', [UserDashboardController::class, 'index'])->name('dashboard');

    // Shipping Address Routes
    Route::get('/shipping-addresses', [ShippingAddressController::class, 'index'])->name('shipping-addresses.index');
    Route::post('/shipping-addresses', [ShippingAddressController::class, 'store'])->name('shipping-addresses.store');
    Route::put('/shipping-addresses/{id}', [ShippingAddressController::class, 'update'])->name('shipping-addresses.update');
    Route::delete('/shipping-addresses/{id}', [ShippingAddressController::class, 'destroy'])->name('shipping-addresses.destroy');
});

// AI Chat API
Route::post('/api/ai-chat', [AIChatController::class, 'ask'])->middleware('throttle:10,1');

// Additional User Routes (role-specific)
Route::middleware(['auth', 'role:user'])->group(function () {
    // Order completion (specific to regular users)
    Route::put('/orders/{id}/complete', [OrderController::class, 'markAsCompleted'])->name('orders.complete');

    // Alternative address routes (specific to regular users)
    Route::get('/addresses', [ShippingAddressController::class, 'index'])->name('addresses.index');
    Route::get('/addresses/default', [ShippingAddressController::class, 'getDefault'])->name('addresses.default');
    Route::post('/addresses', [ShippingAddressController::class, 'store'])->name('addresses.store');
    Route::put('/addresses/{id}', [ShippingAddressController::class, 'update'])->name('addresses.update');
    Route::delete('/addresses/{id}', [ShippingAddressController::class, 'destroy'])->name('addresses.destroy');
    Route::post('/addresses/{id}/default', [ShippingAddressController::class, 'setDefault'])->name('addresses.set-default');
});

// Admin Routes
Route::middleware(['auth', 'role:admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Users management
    Route::resource('users', UserController::class);

    // Admin Products
    Route::resource('products', AdminProductController::class);
    Route::post('/products/upload-image', [ProductController::class, 'uploadImage'])->name('products.upload-image');

    // Admin Orders
    Route::resource('orders', AdminOrderController::class);
    Route::post('/orders/{order}/update-status', [OrderController::class, 'updateStatus'])->name('orders.update-status');

    // Admin Blogs
    Route::resource('blogs', AdminBlogController::class);
    Route::post('/blogs/upload-image', [BlogController::class, 'uploadImage'])->name('blogs.upload-image');

    // Reports
    Route::get('/reports', [ReportController::class, 'index'])->name('reports.index');
    Route::get('/reports/sales', [ReportController::class, 'sales'])->name('reports.sales');

    // Coupon management
    Route::resource('coupons', CouponController::class);
});

Route::get('/verify-email/{id}/{hash}', VerifyEmailController::class)
    ->middleware(['auth', 'signed'])
    ->name('verification.verify');
