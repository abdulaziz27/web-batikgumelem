<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
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
    }

    /**
     * Relasi ke user yang melakukan order.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Relasi ke item-item yang ada di order ini.
     */
    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }

    /**
     * Relasi ke alamat pengiriman yang digunakan pada order ini.
     * withTrashed() agar tetap bisa diakses meski alamat sudah dihapus (soft delete).
     */
    public function shippingAddress()
    {
        return $this->belongsTo(ShippingAddress::class)->withTrashed();
    }

    /**
     * Relasi ke kupon yang digunakan pada order ini (jika ada).
     */
    public function coupon()
    {
        return $this->belongsTo(Coupon::class);
    }
    
    /**
     * Accessor untuk mengambil total order (total_price atau total_amount).
     */
    public function getTotalAttribute()
    {
        return $this->total_price ?? $this->total_amount;
    }
}
