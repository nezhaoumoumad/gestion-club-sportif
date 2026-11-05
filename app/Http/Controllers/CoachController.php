<?php

namespace App\Http\Controllers;

use App\Models\ProfilCoach;
use App\Models\ReservationCoaching;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

class CoachController extends Controller
{
   public function index()
    {
        $user = Auth::user();

        $abo = $user->abonnements()
            ->where('statut', 'actif')
            ->with('formule')
            ->latest()
            ->first();

        $prixAbo = $abo && $abo->formule ? (float)$abo->formule->prix : 0;

        ReservationCoaching::where('user_id', $user->id)
            ->whereIn('statut', ['en_attente', 'confirmee'])
            ->where('date_seance', '<', Carbon::now('Africa/Casablanca'))
            ->update(['statut' => 'expiree']);

        $count = ReservationCoaching::where('user_id', $user->id)
            ->whereIn('statut', ['en_attente', 'confirmee'])
            ->where('date_seance', '>', Carbon::now('Africa/Casablanca'))
            ->count();

        $coachs = ProfilCoach::where('disponible', true)
            ->where('is_active_admin', true)
            ->with('user')
            ->get();

        return Inertia::render('Client/Coachs', [
            'coachs'    => $coachs,
            'utilisees' => (int)$count,
            'prixAbo'   => $prixAbo,
        ]);
    }

    public function dashboard()
    {
        $profil = ProfilCoach::where('user_id', Auth::id())->first();
        
        // Récupération des réservations destinées à ce coach avec les infos du client (user)
        $reservations = [];
        if ($profil) {
            $reservations = ReservationCoaching::where('profil_coach_id', $profil->id)
                ->with('user')
                ->latest()
                ->get();
        }
            
        return Inertia::render('Coach/Dashboard', [
            'profil' => $profil,
            'reservations' => $reservations
        ]);
    }

    public function updateProfil(Request $request)
    {
        $request->validate([
            'specialite' => 'required|string|max:100',
            'bio'        => 'nullable|string|max:1000',
            'disponible' => 'required|boolean'
        ]);
        
        $profil = ProfilCoach::where('user_id', Auth::id())->firstOrFail();
        $profil->update([
            'specialite' => $request->specialite,
            'bio'        => $request->bio,
            'disponible' => $request->disponible,
        ]);
        
        return redirect()->back()->with('success', 'Votre profil professionnel a été mis à jour.');
    }
}