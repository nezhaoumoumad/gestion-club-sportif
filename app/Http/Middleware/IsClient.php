<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class IsClient
{
    public function handle(Request $request, Closure $next)
    {
        if (auth()->check() && auth()->user()->role_id == 2) {
            if (auth()->user()->statut === 'inactif') {
                // On l'autorise EXCLUSIVEMENT à voir la page d'erreur
                if ($request->routeIs('compte.desactive')) {
                    return $next($request);
                }

                // Pour toute autre page, on le renvoie vers l'erreur
                return redirect()->route('compte.desactive');
            }
            return $next($request);
        }

        return redirect('/');
    }
}