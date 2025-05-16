<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Run the role and permission seeder first
        $this->call(RoleAndPermissionSeeder::class);
        
        $this->call([
            ProductSeeder::class,
            BlogSeeder::class,
            CouponSeeder::class,
            UserAndRoleSeeder::class,
        ]);
    }
}
