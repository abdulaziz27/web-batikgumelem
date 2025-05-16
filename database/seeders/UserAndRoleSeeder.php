<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Illuminate\Support\Facades\Hash;

class UserAndRoleSeeder extends Seeder
{
    public function run(): void
    {
        // Menggunakan role yang sudah ada daripada membuat baru
        $adminRole = Role::findByName('admin');
        $userRole = Role::findByName('user');

        // Jika role belum ada (walaupun seharusnya sudah ada dari RoleAndPermissionSeeder)
        if (!$adminRole) {
            $this->command->info('Warning: admin role not found, please run RoleAndPermissionSeeder first');
            return;
        }
        
        if (!$userRole) {
            $this->command->info('Warning: user role not found, please run RoleAndPermissionSeeder first');
            return;
        }

        $admin = User::create([
            'name' => 'Abdul Aziz',
            'email' => 'itsdulziz@gmail.com',
            'password' => Hash::make('password'),
            'email_verified_at' => now()
        ]);
        $admin->assignRole($adminRole);

        $admin = User::create([
            'name' => 'Admin Batik Gumelem',
            'email' => 'info@batikgumelem.com',
            'password' => Hash::make('password'),
            'email_verified_at' => now()
        ]);
        $admin->assignRole($adminRole);

        $user = User::create([
            'name' => 'User Batik Gumelem',
            'email' => 'user@batikgumelem.com',
            'password' => Hash::make('password'),
            'email_verified_at' => now()
        ]);
        $user->assignRole($userRole);
    }
}
