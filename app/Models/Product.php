<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;
use Illuminate\Database\Eloquent\SoftDeletes;

class Product extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'name',
        'slug',
        'description',
        'price',
        'is_active',
        'image',
    ];

    protected $casts = [
        'price' => 'float',
        'is_active' => 'boolean',
    ];

    /**
     * Relasi ke semua gambar produk ini.
     */
    public function images()
    {
        return $this->hasMany(ProductImage::class);
    }

    /**
     * Relasi ke semua ukuran produk ini.
     */
    public function sizes()
    {
        return $this->hasMany(ProductSize::class);
    }

    /**
     * Relasi ke semua order item yang berisi produk ini.
     */
    public function orderItems()
    {
        return $this->hasMany(OrderItem::class);
    }

    /**
     * Relasi ke semua cart item yang berisi produk ini.
     */
    public function cartItems()
    {
        return $this->hasMany(\App\Models\CartItem::class);
    }

    /**
     * Get total stock dari semua ukuran produk, 0 jika tidak ada size.
     */
    public function getTotalStockAttribute()
    {
        return $this->sizes->sum('stock');
    }

    /**
     * Mengecek apakah produk punya stok tersedia.
     */
    public function hasStock()
    {
        if ($this->sizes->count() > 0) {
            return $this->sizes->where('stock', '>', 0)->count() > 0;
        }
        return false;
    }

    protected static function boot()
    {
        parent::boot();

        static::deleting(function ($product) {
            // Delete associated images from storage
            foreach ($product->images as $image) {
                if (Storage::disk('public')->exists($image->image)) {
                    Storage::disk('public')->delete($image->image);
                }
            }
        });
    }
}
