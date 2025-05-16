<?php

namespace Database\Seeders;

use App\Models\Coupon;
use Illuminate\Database\Seeder;

class CouponSeeder extends Seeder
{
    public function run()
    {
        $coupons = [
            [
                'code' => 'BATIK10',
                'discount_percent' => 10,
                'valid_from' => now()->subMonth(),
                'valid_until' => now()->addMonths(3),
                'active' => true,
            ],
            [
                'code' => 'BATIK20',
                'discount_percent' => 20,
                'valid_from' => now()->subMonth(),
                'valid_until' => now()->addMonths(3),
                'active' => true,
            ],
            [
                'code' => 'BATIKMAY15',
                'discount_percent' => 15,
                'valid_from' => now()->subMonth(),
                'valid_until' => now()->addMonths(3),
                'active' => true,
            ],
        ];

        foreach ($coupons as $coupon) {
            Coupon::create($coupon);
        }
    }
}
