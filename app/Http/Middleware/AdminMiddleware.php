<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Auth;

class AdminMiddleware
{
    /**
     * Middleware untuk membatasi akses hanya untuk user dengan role admin.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Jika belum login, redirect ke halaman login
        if (!Auth::check()) {
            return redirect('login');
        }

        // Jika user tidak punya role admin, redirect ke home dengan pesan error
        if (!Auth::user()->hasRole('admin')) {
            return redirect('/')->with('error', 'Anda tidak memiliki akses ke halaman admin.');
        }

        // Jika lolos, lanjutkan request
        return $next($request);
    }
}
