<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use App\Models\ProfilCoach;

class IsCoach
{
    public function handle(Request $request, Closure $next)
    {
        $user = auth()->user();

        // 1. Vérification de base
        if (!$user || $user->role_id !== 3) {
            return redirect(route('dashboard'));
        }

        // 2. Vérification du statut admin du coach
        $profil = ProfilCoach::where('user_id', $user->id)->first();

        if ($profil && $profil->is_active_admin === false) {
            // On évite une boucle infinie : si on est déjà sur la page désactivé, on laisse passer
            if ($request->routeIs('coach.compte.desactive')) {
                return $next($request);
            }
            // Sinon on redirige vers la page explicative (coach reste connecté)
            return redirect()->route('coach.compte.desactive');
        }

        return $next($request);
    }
}