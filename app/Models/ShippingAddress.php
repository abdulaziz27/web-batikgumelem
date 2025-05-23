<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ShippingAddress extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'user_id',
        'full_name',
        'address',
        'city',
        'province',
        'postal_code',
        'phone',
        'is_default'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
