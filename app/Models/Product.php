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

    public function images()
    {
        return $this->hasMany(ProductImage::class);
    }

    public function sizes()
    {
        return $this->hasMany(ProductSize::class);
    }

    public function orderItems()
    {
        return $this->hasMany(OrderItem::class);
    }

    public function cartItems()
    {
        return $this->hasMany(\App\Models\CartItem::class);
    }

    /**
     * Get total stock from all sizes, or 0 if no sizes exist
     */
    public function getTotalStockAttribute()
    {
        return $this->sizes->sum('stock');
    }

    /**
     * Check if product has stock available
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
