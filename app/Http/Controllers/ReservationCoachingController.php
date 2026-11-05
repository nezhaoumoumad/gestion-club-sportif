<?php

namespace App\Http\Controllers;

use App\Models\ReservationCoaching;
use App\Models\ProfilCoach;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

class ReservationCoachingController extends Controller
{
    /**
     * Calcule le quota utilisé de manière unique pour tout le contrôleur
     * Règle : Seules les séances FUTURES en attente ou confirmées comptent.
     */
   private function getQuotaUtilise()
{
    $maintenant = Carbon::now('Africa/Casablanca');

    // Met à jour en BDD les sessions passées encore en attente/confirmées
    ReservationCoaching::where('user_id', Auth::id())
        ->whereIn('statut', ['en_attente', 'confirmee'])
        ->where('date_seance', '<', $maintenant)
        ->update(['statut' => 'expiree']);

    // Compte uniquement les sessions futures actives
    return ReservationCoaching::where('user_id', Auth::id())
        ->whereIn('statut', ['en_attente', 'confirmee'])
        ->where('date_seance', '>', $maintenant)
        ->count();
}
   public function index()
    {
        $user = Auth::user();
        $abo = $user->abonnements()->where('statut', 'actif')->with('formule')->latest()->first();
        $prixAbo = $abo ? (int)$abo->formule->prix : 0;
        
        $maintenant = Carbon::now();

        $raw = ReservationCoaching::with('profilCoach.user')
            ->where('user_id', $user->id)
            ->latest()
            ->get();

        $reservations = $raw->map(function($r) use ($maintenant) {
            $dt = Carbon::parse($r->getRawOriginal('date_seance'), 'Africa/Casablanca');
            $statut = $r->statut;

            if ($dt->lt($maintenant) && in_array($statut, ['en_attente', 'confirmee'])) {
                $statut = 'expiree';
            }

            return [
                'id' => $r->id,
                'date_seance' => $dt->format('Y-m-d H:i:s'),
                'timestamp'   => $dt->timestamp,
                'statut' => $statut,
                'profil_coach' => [
                    'user' => [
                        'prenom' => $r->profilCoach->user->prenom ?? 'Coach',
                        'nom' => $r->profilCoach->user->nom ?? '',
                    ]
                ]
            ];
        });

        $utilisees = $this->getQuotaUtilise();

        return Inertia::render('ReservationsCoaching/Index', [
            'reservations' => $reservations,
            'prixAbo' => $prixAbo,
            'utilisees' => $utilisees
        ]);
    }

    public function coachs()
{
    $user = Auth::user();
    
    $abo = $user->abonnements()->where('statut', 'actif')->with('formule')->latest()->first();
    $prixAbo = $abo ? (int)$abo->formule->prix : 0;

    $coachs = ProfilCoach::with('user')->get();

    $utilisees = $this->getQuotaUtilise();


    return Inertia::render('ReservationsCoaching/ClientCoachs', [
        'coachs' => $coachs,
        'prixAbo' => $prixAbo,
        'utilisees' => $utilisees
    ]);
}

    public function coachIndex()
    {
        $coach = ProfilCoach::where('user_id', Auth::id())->firstOrFail();
        $maintenant = Carbon::now();

        $reservations = ReservationCoaching::with('user')
            ->where('profil_coach_id', $coach->id)
            ->orderBy('date_seance', 'desc')
            ->get()
            ->map(function($r) use ($maintenant) {
                $dt = Carbon::parse($r->getRawOriginal('date_seance'));
                if ($dt->lt($maintenant) && !in_array($r->statut, ['refusee', 'annulee'])) {
                    $r->statut = 'expiree';
                }
                $r->date_seance = $dt->format('d/m/Y H:i');
                return $r;
            });

        return Inertia::render('Coach/Reservations', [
            'reservations' => $reservations->toArray(),
            'profil' => $coach
        ]);
    }

    public function store(Request $request)
{
    $request->validate([
        'profil_coach_id' => 'required|exists:profils_coachs,id',
        'date_seance'     => 'required|date|after:now',
        'duree'           => 'required|integer|min:15',
        'notes'           => 'nullable|string|max:500',
    ]);

    $userId = Auth::id();

    // Vérification du quota (Max 5 sessions actives)
    $quotaUtilise = ReservationCoaching::where('user_id', $userId)
        ->whereIn('statut', ['en_attente', 'confirmee'])
        ->where('date_seance', '>', now())
        ->count();

    if ($quotaUtilise >= 5) {
        return redirect()->back()->withErrors([
            'quota' => 'Vous avez atteint votre limite de 5 réservations actives.'
        ]);
    }

    // Vérification : Une seule séance par jour
    $dateJour = Carbon::parse($request->date_seance)->toDateString();
    $dejaReserveCeJour = ReservationCoaching::where('user_id', $userId)
        ->whereIn('statut', ['en_attente', 'confirmee'])
        ->whereDate('date_seance', $dateJour)
        ->exists();

    if ($dejaReserveCeJour) {
        return redirect()->back()->withErrors([
            'date_seance' => 'Vous avez déjà une réservation prévue pour ce jour-là.'
        ]);
    }

    ReservationCoaching::create([
        'user_id'         => $userId,
        'profil_coach_id' => $request->profil_coach_id,
        'date_seance'     => $request->date_seance,
        'duree'           => $request->duree,
        'notes'           => $request->notes,
        'statut'          => 'en_attente',
    ]);

    return redirect()->route('reservations.coaching.index')
        ->with('success', 'Votre demande de coaching a été envoyée.');
}

    public function confirm($id)
    {
        $reservation = ReservationCoaching::findOrFail($id);
        $reservation->update(['statut' => 'confirmee']);
        return redirect()->back();
    }

    public function reject($id)
    {
        $reservation = ReservationCoaching::findOrFail($id);
        $reservation->update(['statut' => 'annulee']);
        return redirect()->back()->with('success', 'La séance a été refusée.');
    }

    public function cancel($id)
    {
        $reservation = ReservationCoaching::where('id', $id)
            ->where('user_id', Auth::id())
            ->firstOrFail();

        $reservation->update(['statut' => 'annulee']);

        return redirect()->back()->with('success', 'Session annulée avec succès.');
    }
}