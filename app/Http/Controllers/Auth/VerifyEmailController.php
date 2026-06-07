<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Auth\Events\Verified;
use Illuminate\Foundation\Auth\EmailVerificationRequest;
use Illuminate\Http\RedirectResponse;

class VerifyEmailController extends Controller
{
    /**
     * Menandai email user sebagai sudah diverifikasi.
     */
    public function __invoke(EmailVerificationRequest $request): RedirectResponse
    {
        // Jika sudah diverifikasi, redirect ke home
        if ($request->user()->hasVerifiedEmail()) {
            return redirect()->intended('/?verified=1');
        }

        // Tandai email sebagai diverifikasi
        if ($request->user()->markEmailAsVerified()) {
            /** @var \Illuminate\Contracts\Auth\MustVerifyEmail $user */
            $user = $request->user();

            event(new Verified($user));
        }

        return redirect()->intended('/?verified=1')->with('success', 'Email berhasil diverifikasi!');
    }
}
