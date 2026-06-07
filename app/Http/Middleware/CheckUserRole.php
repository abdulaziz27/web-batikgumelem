<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Auth;

class CheckUserRole
{
    /**
     * Middleware untuk mengecek apakah user memiliki role tertentu.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @param  string  $role
     * @return mixed
     */
    public function handle(Request $request, Closure $next, string $role): Response
    {
        // Jika belum login, redirect ke login
        if (!Auth::check()) {
            return redirect('login');
        }

        $user = Auth::user();
        
        // Jika user punya role yang diminta, lanjutkan request
        if ($user->hasRole($role)) {
            return $next($request);
        }

        // Jika user admin, redirect ke dashboard admin
        if ($user->hasRole('admin')) {
            return redirect('admin/dashboard');
        }
        
        // Jika user biasa, redirect ke dashboard user
        if ($user->hasRole('user')) {
            return redirect('dashboard');
        }
        
        // Jika tidak punya role yang sesuai, redirect ke home dengan pesan error
        return redirect('/')->with('error', 'Anda tidak memiliki akses ke halaman tersebut.');
    }
} 