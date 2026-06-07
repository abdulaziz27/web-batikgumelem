<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Auth;

class UserMiddleware
{
    /**
     * Middleware untuk membatasi akses hanya untuk user biasa (role user).
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Jika belum login, redirect ke login
        if (!Auth::check()) {
            return redirect('login');
        }

        // Jika bukan user biasa, cek apakah admin
        if (!Auth::user()->hasRole('user')) {
            // Jika admin, tetap boleh akses (karena hak akses lebih tinggi)
            if (Auth::user()->hasRole('admin')) {
                return $next($request);
            }
            // Jika bukan admin, redirect ke home dengan pesan error
            return redirect('/')->with('error', 'Anda tidak memiliki akses ke halaman ini.');
        }

        // Jika user biasa, lanjutkan request
        return $next($request);
    }
} 