<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;
use Inertia\Response;

class PasswordController extends Controller
{
    /**
     * Menampilkan halaman pengaturan password user.
     */
    public function edit(): Response
    {
        return Inertia::render('settings/password');
    }

    /**
     * Memproses update password user.
     */
    public function update(Request $request): RedirectResponse
    {
        // Validasi password lama dan password baru
        $validated = $request->validate([
            'current_password' => ['required', 'current_password'],
            'password' => ['required', Password::defaults(), 'confirmed'],
        ]);

        // Update password user
        $request->user()->update([
            'password' => Hash::make($validated['password']),
        ]);

        return back();
    }
}
