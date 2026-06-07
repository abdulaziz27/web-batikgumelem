<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Password;
use Inertia\Inertia;
use Inertia\Response;

class PasswordResetLinkController extends Controller
{
    /**
     * Menampilkan halaman permintaan link reset password.
     */
    public function create(Request $request): Response
    {
        // Render halaman forgot password
        return Inertia::render('auth/forgot-password', [
            'status' => $request->session()->get('status'),
        ]);
    }

    /**
     * Memproses permintaan pengiriman link reset password.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        // Validasi email
        $request->validate([
            'email' => 'required|email',
        ]);

        // Kirim link reset password ke email
        Password::sendResetLink(
            $request->only('email')
        );

        // Tampilkan pesan sukses
        return back()->with('status', __('Sebuah tautan pembaruan akan dikirim jika akun ada.'));
    }
}
