<?php

namespace App\Http\Controllers;

use App\Models\ProfilCoach;
use App\Models\Abonnement;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class ClientController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        // 1. Redirections de sécurité
        if ($user->role_id === 1) return redirect()->route('admin.dashboard');
        if ($user->role_id === 3) return redirect()->route('coach.dashboard');
        if ($user->statut === 'inactif') return redirect()->route('compte.desactive');

        // 2. Logique d'abonnement et Message Personnalisé
        $aDejaEuUnAbonnement = Abonnement::where('user_id', $user->id)->exists();
        $abonnementValide = $user->aAbonnementValide();

        // On prépare la phrase ici pour simplifier le React
        $statusMessage = $abonnementValide
            ? "Vous avez maintenant accès à l'ensemble de nos installations et aux séances de sport réservées aux membres."
            : ($aDejaEuUnAbonnement 
                ? "Votre abonnement a expiré. Renouvelez-le pour accéder aux séances." 
                : "Choisissez une formule pour commencer votre entraînement et réserver vos séances.");

        return Inertia::render('Dashboard', [
            'hasSub' => $abonnementValide ? true : ($aDejaEuUnAbonnement ? false : null),
            'statusMessage' => $statusMessage,
        ]);
    }

    public function profil()
    {
        $user = Auth::user()->load(['abonnements.formule', 'reservations.seance.sport']);
        return Inertia::render('Client/Profil', [
            'user' => $user
        ]);
    }

    public function coachs()
    {
        $coachs = ProfilCoach::with('user')
            ->where('disponible', true)
            ->get();

        return Inertia::render('Client/Coachs', [
            'coachs' => $coachs
        ]);
    }
}