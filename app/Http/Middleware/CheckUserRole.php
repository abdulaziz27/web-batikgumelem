<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Auth;

class CheckUserRole
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @param  string  $role
     * @return mixed
     */
    public function handle(Request $request, Closure $next, string $role): Response
    {
        if (!Auth::check()) {
            return redirect('login');
        }

        $user = Auth::user();
        
        // Check if the user has the specified role
        if ($user->hasRole($role)) {
            return $next($request);
        }

        // Redirect based on user's role
        if ($user->hasRole('admin')) {
            return redirect('admin/dashboard');
        }
        
        if ($user->hasRole('user')) {
            return redirect('dashboard');
        }
        
        // Fallback to home page if no specific role or unauthorized
        return redirect('/')->with('error', 'Anda tidak memiliki akses ke halaman tersebut.');
    }
} 