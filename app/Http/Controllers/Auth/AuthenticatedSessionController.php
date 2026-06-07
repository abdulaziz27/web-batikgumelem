<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;

class AuthenticatedSessionController extends Controller
{
    /**
     * Menampilkan halaman login.
     */
    public function create(Request $request): Response
    {
        // Render halaman login dengan status dan opsi reset password
        return Inertia::render('auth/login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => $request->session()->get('status'),
        ]);
    }

    /**
     * Memproses permintaan login/authentication.
     */
    public function store(LoginRequest $request): RedirectResponse
    {
        // Autentikasi user
        $request->authenticate();

        // Regenerasi session untuk keamanan
        $request->session()->regenerate();

        // Redirect berdasarkan role user
        $user = $request->user();
        if ($user->hasRole('admin')) {
            return redirect()->intended(route('admin.dashboard', absolute: false));
        }
        // Jika bukan admin, redirect ke dashboard user
        return redirect()->intended(route('dashboard', absolute: false));
    }

    /**
     * Logout user dan hapus session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
}
