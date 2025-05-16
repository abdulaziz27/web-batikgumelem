<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\PermissionRegistrar;
use App\Models\User;

class RoleAndPermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        // Create permissions
        $permissions = [
            // Product permissions
            'view products',
            'create products',
            'edit products',
            'delete products',
            
            // Blog permissions
            'view blogs',
            'create blogs',
            'edit blogs',
            'delete blogs',
            
            // Order permissions
            'view orders',
            'manage orders',
            'view own orders',
            'cancel own orders',
            
            // User management
            'manage users',
            'view profile',
            'edit profile',
        ];

        foreach ($permissions as $permission) {
            Permission::create(['name' => $permission]);
        }

        // Create roles and assign permissions
        
        // Guest role (no permissions needed as they're handled by public routes)
        $guestRole = Role::create(['name' => 'guest']);
        
        // Regular user role
        $userRole = Role::create(['name' => 'user']);
        $userRole->givePermissionTo([
            'view products',
            'view blogs',
            'view own orders',
            'cancel own orders',
            'view profile',
            'edit profile',
        ]);
        
        // Admin role with all permissions
        $adminRole = Role::create(['name' => 'admin']);
        $adminRole->givePermissionTo(Permission::all());

        // Optionally create demo users
        // Uncomment if you want to create demo users during seeding
        /*
        $adminUser = User::factory()->create([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
        ]);
        $adminUser->assignRole('admin');

        $regularUser = User::factory()->create([
            'name' => 'Regular User',
            'email' => 'user@example.com',
        ]);
        $regularUser->assignRole('user');
        */
    }
} 