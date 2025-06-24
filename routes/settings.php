<?php

use App\Http\Controllers\Settings\PasswordController;
use App\Http\Controllers\Settings\ProfileController;
use App\Http\Controllers\ShippingAddressController;
// use App\Http\Controllers\Settings\SiteSettingsController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/**
 * Settings routes.
 */
Route::middleware('auth')->group(function () {
    // Profile & Password Routes (No verification required)
    Route::get('/settings/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/settings/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/settings/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    
    Route::get('/settings/password', [PasswordController::class, 'edit'])->name('password.edit');
    Route::put('/settings/password', [PasswordController::class, 'update'])->name('password.update');

    // Address settings - only for regular users (verification removed)
    Route::middleware(['role:user'])->group(function () {
        Route::get('/settings/addresses', [ShippingAddressController::class, 'index'])->name('addresses.index');
        Route::post('/settings/addresses', [ShippingAddressController::class, 'store'])->name('addresses.store');
        Route::put('/settings/addresses/{address}', [ShippingAddressController::class, 'update'])->name('addresses.update');
        Route::delete('/settings/addresses/{address}', [ShippingAddressController::class, 'destroy'])->name('addresses.destroy');
    });
    
    // Admin-specific settings (commented out - controller not implemented yet)
    // Route::middleware(['role:admin'])->prefix('admin')->name('admin.')->group(function () {
    //     Route::get('/settings/site', [SiteSettingsController::class, 'edit'])->name('site.edit');
    //     Route::patch('/settings/site', [SiteSettingsController::class, 'update'])->name('site.update');
    // });

    Route::get('settings/appearance', function () {
        return Inertia::render('settings/appearance');
    })->name('appearance');
});
