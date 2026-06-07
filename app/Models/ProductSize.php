<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProductSize extends Model
{
    use HasFactory;

    protected $fillable = [
        'product_id',
        'size',
        'stock',
    ];

    protected $casts = [
        'stock' => 'integer',
    ];

    /**
     * Relasi ke produk induk dari size ini.
     */
    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    /**
     * Relasi ke cart item yang menggunakan size ini.
     */
    public function cartItems()
    {
        return $this->hasMany(\App\Models\CartItem::class, 'size', 'size');
    }
}
