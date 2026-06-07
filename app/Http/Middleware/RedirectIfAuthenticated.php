<?php

namespace App\Http\Middleware;

use App\Providers\RouteServiceProvider;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class RedirectIfAuthenticated
{
    /**
     * Middleware untuk mencegah user yang sudah login mengakses halaman guest (login/register).
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, string ...$guards): Response
    {
        $guards = empty($guards) ? [null] : $guards;

        foreach ($guards as $guard) {
            if (Auth::guard($guard)->check()) {
                // Jika user admin, redirect ke dashboard admin
                if (Auth::user()->hasRole('admin')) {
                    return redirect()->route('admin.dashboard');
                }
                // Jika bukan admin, redirect ke home
                return redirect('/');
            }
        }

        // Jika belum login, lanjutkan request
        return $next($request);
    }
} 