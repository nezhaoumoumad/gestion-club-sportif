<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class IsAdmin
{
    public function handle(Request $request, Closure $next): Response
    {
        // 1. Vérification auth
        if (!Auth::check()) {
            return redirect()->route('login');
        }

        // 2. Vérification rôle Admin (ID 1)
        if ((int) Auth::user()->role_id !== 1) {
            // On redirige vers 'dashboard' qui est la route neutre
            return redirect()->route('dashboard')->with('error', "Accès réservé aux administrateurs.");
        }

        return $next($request);
    }
}