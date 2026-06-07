<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CartItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'product_id',
        'quantity',
        'size',
    ];

    protected $casts = [
        'quantity' => 'integer',
    ];

    /**
     * Relasi ke user yang memiliki cart item ini.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Relasi ke produk yang ada di cart item ini.
     */
    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    /**
     * Menghasilkan key unik untuk cart item berdasarkan product_id dan size.
     */
    public function getKeyString()
    {
        return $this->size ? $this->product_id . '-' . $this->size : (string)$this->product_id;
    }
} 