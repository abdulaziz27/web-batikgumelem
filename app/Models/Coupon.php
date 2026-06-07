<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Coupon extends Model
{
    use HasFactory;

    protected $fillable = [
        'code',
        'discount_percent',
        'valid_from',
        'valid_until',
        'active'
    ];

    protected $casts = [
        'valid_from' => 'date',
        'valid_until' => 'date',
    ];

    /**
     * Relasi ke semua order yang menggunakan kupon ini.
     */
    public function orders()
    {
        return $this->hasMany(Order::class);
    }

    /**
     * Mengecek apakah kupon masih aktif dan dalam rentang tanggal berlaku.
     */
    public function isValid()
    {
        $now = now();
        return $this->active && $now->between($this->valid_from, $this->valid_until);
    }
}
