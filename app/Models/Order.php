<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'guest_email',
        'guest_name',
        'status',
        'total_price',
        'total_amount',
        'shipping_address_id',
        'shipping_method',
        'shipping_cost',
        'payment_method',
        'payment_status',
        'payment_token',
        'payment_url',
        'discount',
        'coupon_id',
        'notes',
        'admin_notes',
        'tracking_number',
        'tracking_url',
        'order_number'
    ];

    protected $casts = [
        'shipping_method' => 'array',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * The "booted" method of the model.
     */
    protected static function boot()
    {
        parent::boot();

        // Auto-generate order_number when creating a new order
        static::creating(function ($order) {
            if (empty($order->order_number)) {
                $order->order_number = 'ORD-' . date('Ymd') . '-' . sprintf('%04d', static::whereDate('created_at', today())->count() + 1);
            }
            
            // Set total_amount to match total_price if not specified
            if (empty($order->total_amount) && !empty($order->total_price)) {
                $order->total_amount = $order->total_price;
            }
        });
        
        // After creating an order, update the shipping address with the order_id
        static::created(function ($order) {
            if ($order->shipping_address_id) {
                $shippingAddress = ShippingAddress::find($order->shipping_address_id);
                if ($shippingAddress && empty($shippingAddress->order_id)) {
                    $shippingAddress->update(['order_id' => $order->id]);
                }
            }
        });
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }

    public function shippingAddress()
    {
        return $this->belongsTo(ShippingAddress::class);
    }

    public function coupon()
    {
        return $this->belongsTo(Coupon::class);
    }
    
    public function getTotalAttribute()
    {
        return $this->total_price ?? $this->total_amount;
    }
}
