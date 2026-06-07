<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class ProductImage extends Model
{
    use HasFactory;

    protected $fillable = [
        'product_id',
        'image',
        'is_primary',
    ];

    protected $casts = [
        'is_primary' => 'boolean',
    ];

    protected $appends = [
        'image_url',
    ];

    /**
     * Relasi ke produk induk dari gambar ini.
     */
    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    /**
     * Mendapatkan URL gambar (untuk frontend).
     */
    public function getImageUrlAttribute()
    {
        return $this->image ? asset('storage/' . $this->image) : null;
    }

    protected static function boot()
    {
        parent::boot();

        static::deleting(function ($image) {
            if (Storage::disk('public')->exists($image->image)) {
                Storage::disk('public')->delete($image->image);
            }
        });
    }
}
