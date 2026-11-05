<?php

namespace App\Http\Controllers;

use App\Models\Reservation;
use App\Models\Seance;
use App\Models\Abonnement;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class ReservationController extends Controller
{
    public function index()
{
    $user = Auth::user();

    $abonnement = Abonnement::where('user_id', $user->id)
        ->where('statut', 'actif')
        ->where('date_fin', '>', now())
        ->first();

    $prixAbo = $abonnement ? $abonnement->formule->prix : 0;

    // Mettre à jour en BDD les réservations dont la séance est passée
    $seancesPasseesIds = Seance::where('date_heure', '<', now('Africa/Casablanca'))
    ->pluck('id');

    Reservation::where('user_id', $user->id)
        ->whereIn('statut', ['en_attente', 'confirmee'])
        ->whereIn('seance_id', $seancesPasseesIds)
        ->update(['statut' => 'terminee']);

    $reservations = Reservation::with(['seance.sport', 'seance.lieu'])
        ->where('user_id', $user->id)
        ->orderBy('created_at', 'desc')
        ->get();

    return Inertia::render('Reservations/Index', [
        'reservations' => $reservations,
        'prixAbo' => $prixAbo
    ]);
}

    public function store(Request $request)
    {
        $request->validate([
            'seance_id' => 'required|exists:seances,id',
        ]);

        $user = Auth::user();
        $seanceId = $request->seance_id;

        // --- ÉTAPE 1 : VÉRIFICATION DE L'ABONNEMENT ---
        // On vérifie si l'utilisateur a un abonnement ACTIF (peu importe le prix)
        $aUnAbonnementActif = Abonnement::where('user_id', $user->id)
            ->where('statut', 'actif')
            ->where('date_fin', '>', now())
            ->exists();

        if (!$aUnAbonnementActif) {
            return redirect()->back()->with('error', 'Un abonnement actif est requis pour réserver.');
        }

        // --- ÉTAPE 2 : EMPÊCHER LES DOUBLONS ---
        $dejaReserve = Reservation::where('user_id', $user->id)
            ->where('seance_id', $seanceId)
            ->where('statut', 'confirmee')
            ->exists();

        if ($dejaReserve) {
            return redirect()->back()->with('error', 'Vous avez déjà réservé cette séance.');
        }

        // --- ÉTAPE 3 : VÉRIFICATION DE LA CAPACITÉ ---
        $seance = Seance::withCount(['reservations' => function($query) {
            $query->where('statut', '!=', 'annulee');
        }])->findOrFail($seanceId);

        if ($seance->reservations_count >= $seance->capacite) {
            return redirect()->back()->with('error', 'Désolé, cette séance est complète.');
        }

        // --- ÉTAPE 4 : CRÉATION ---
        Reservation::create([
            'user_id'   => $user->id,
            'seance_id' => $seanceId,
            'statut'    => 'confirmee'
        ]);

        return redirect()->route('reservations.index')->with('success', 'Votre place a été réservée avec succès !');
    }

    public function destroy($id)
    {
        $reservation = Reservation::where('user_id', Auth::id())->findOrFail($id);
        $reservation->update(['statut' => 'annulee']);
        return redirect()->back()->with('success', 'Réservation annulée.');
    }
}