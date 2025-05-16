<?php

namespace Tests\Feature;

use App\Events\OrderCreated;
use App\Events\OrderStatusChanged;
use App\Mail\OrderConfirmation;
use App\Mail\OrderStatusUpdate;
use App\Mail\PaymentInstructions;
use App\Models\Order;
use App\Models\Product;
use App\Models\ShippingAddress;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\Mail;
use Tests\TestCase;
use PHPUnit\Framework\Attributes\Test;

class OrderEmailNotificationTest extends TestCase
{
    use RefreshDatabase;

    public function setUp(): void
    {
        parent::setUp();
        Mail::fake();
        
        // Show detailed errors
        $this->withoutExceptionHandling();
    }

    #[Test]
    public function it_sends_order_confirmation_and_payment_instructions_when_order_is_created()
    {
        // Arrange
        $user = User::factory()->create();
        $product = Product::factory()->create(['price' => 950000]);
        
        $shippingAddress = ShippingAddress::create([
            'user_id' => $user->id,
            'full_name' => 'Test User',
            'address' => 'Test Address',
            'city' => 'Test City',
            'province' => 'Test Province',
            'postal_code' => '12345',
            'phone' => '08123456789',
            'is_default' => true,
        ]);
        
        $order = Order::create([
            'user_id' => $user->id,
            'status' => 'pending',
            'total_price' => 972000,
            'shipping_address_id' => $shippingAddress->id,
            'shipping_method' => [
                'courier_name' => 'JNE',
                'courier_service_name' => 'REG',
                'price' => 22000
            ],
            'shipping_cost' => 22000,
            'payment_method' => 'bank_transfer',
            'payment_status' => 'pending'
        ]);
        
        $order->items()->create([
            'product_id' => $product->id,
            'product_name' => $product->name,
            'quantity' => 1,
            'price' => $product->price
        ]);

        // Act
        event(new OrderCreated($order));

        // Assert
        Mail::assertQueued(OrderConfirmation::class, function ($mail) use ($user, $order) {
            return $mail->hasTo($user->email) &&
                $mail->order->id === $order->id;
        });
        
        Mail::assertQueued(PaymentInstructions::class, function ($mail) use ($user, $order) {
            return $mail->hasTo($user->email) &&
                $mail->order->id === $order->id;
        });
    }


    #[Test]
    public function it_sends_order_status_update_email_when_order_status_changes()
    {
        // Arrange
        $user = User::factory()->create();
        $product = Product::factory()->create(['price' => 950000]);
        
        $shippingAddress = ShippingAddress::create([
            'user_id' => $user->id,
            'full_name' => 'Test User',
            'address' => 'Test Address',
            'city' => 'Test City',
            'province' => 'Test Province',
            'postal_code' => '12345',
            'phone' => '08123456789',
            'is_default' => true,
        ]);
        
        $order = Order::create([
            'user_id' => $user->id,
            'status' => 'pending',
            'total_price' => 972000,
            'shipping_address_id' => $shippingAddress->id,
            'shipping_method' => [
                'courier_name' => 'JNE',
                'courier_service_name' => 'REG',
                'price' => 22000
            ],
            'shipping_cost' => 22000,
            'payment_method' => 'bank_transfer',
            'payment_status' => 'pending'
        ]);
        
        $oldStatus = 'pending';
        $newStatus = 'processing';
        
        // Act
        event(new OrderStatusChanged($order, $oldStatus, $newStatus));
        
        // Assert
        Mail::assertQueued(OrderStatusUpdate::class, function ($mail) use ($user, $order, $oldStatus, $newStatus) {
            return $mail->hasTo($user->email) &&
                $mail->order->id === $order->id &&
                $mail->oldStatus === $oldStatus &&
                $mail->newStatus === $newStatus;
        });
    }

    
    #[Test]
    public function it_does_not_send_email_for_guest_orders_without_email()
    {
        // Arrange
        $product = Product::factory()->create(['price' => 950000]);
        
        // Buat ShippingAddress yang sesuai dengan struktur tabel
        $shippingAddress = ShippingAddress::create([
            'user_id' => null,
            'full_name' => 'Guest User',
            'address' => 'Guest Address',
            'city' => 'Guest City',
            'province' => 'Guest Province',
            'postal_code' => '12345',
            'phone' => '08123456789',
            'is_default' => false,
        ]);
        
        $order = Order::create([
            'user_id' => null,
            'guest_name' => 'John Doe',
            'guest_email' => null, // No email provided
            'status' => 'pending',
            'total_price' => 972000,
            'shipping_address_id' => $shippingAddress->id,
            'shipping_method' => [
                'courier_name' => 'JNE',
                'courier_service_name' => 'REG',
                'price' => 22000
            ],
            'shipping_cost' => 22000,
            'payment_method' => 'bank_transfer',
            'payment_status' => 'pending'
        ]);
        
        // Act
        event(new OrderCreated($order));
        
        // Assert
        Mail::assertNotSent(OrderConfirmation::class);
        Mail::assertNotSent(PaymentInstructions::class);
    }
} 