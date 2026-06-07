<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class SetLocale
{
    /**
     * Set application locale from cookie (fallback to config).
     */
    public function handle(Request $request, Closure $next)
    {
        $supported = ['id', 'en'];
        $locale = $request->cookie('locale');

        if (is_string($locale) && in_array($locale, $supported, true)) {
            app()->setLocale($locale);
        }

        return $next($request);
    }
}

