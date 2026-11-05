<?php

namespace App\Http\Controllers;

use App\Models\Abonnement;
use App\Models\Formule;
use App\Models\Paiement;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use App\Mail\MailConfirmationAbonnement;

class AbonnementController extends Controller
{
    public function index()
    {
        $abonnements = Abonnement::with('formule')
            ->where('user_id', Auth::id())
            ->get();

        return Inertia::render('Abonnements/Index', [
            'abonnements' => $abonnements
        ]);
    }

    public function store(Request $request)
{
    $user = Auth::user();

    $dejaAbonne = Abonnement::where('user_id', $user->id)
        ->where('statut', 'actif')
        ->where('date_fin', '>', now())
        ->exists();

    if ($dejaAbonne) {
        return redirect()->back()->withErrors(['error' => 'Vous avez déjà un abonnement actif.']);
    }

    $request->validate([
        'formule_id' => 'required|exists:formules,id',
    ]);

    $formule = Formule::findOrFail($request->formule_id);

    // --- DÉBUT DE LA TRANSACTION ---
    DB::beginTransaction();

    try {
        // 1. Création de l'abonnement
        $abonnement = Abonnement::create([
            'user_id'    => $user->id,
            'formule_id' => $formule->id,
            'date_debut' => now(),
            'date_fin'   => now()->addMonths($formule->duree_mois),
            'statut'     => 'actif'
        ]);

        // 2. Création du paiement associé
        Paiement::create([
            'abonnement_id' => $abonnement->id,
            'montant'       => $formule->prix,
            'date_paiement' => now(),
            'mode_paiement' => 'carte_bancaire',
            'statut'        => 'actif'
        ]);

        // 3. Mise à jour de l'utilisateur
        $user->update([
            'est_abonne' => true
        ]);

        // --- ENVOI DE L'EMAIL DE CONFIRMATION ---
        Mail::to($user->email)->send(new MailConfirmationAbonnement($user));

        // Si tout est bon, on valide définitivement en base de données
        DB::commit();

        return redirect()->route('dashboard')->with('success', 'Paiement validé ! Bienvenue chez ELITE SPORT.');

    } catch (\Exception $e) {
        // Si une erreur survient (ex: bug SQL, coupure réseau), on annule TOUT
        DB::rollBack();
        
        return redirect()->back()->withErrors(['error' => "Le paiement a échoué. Aucune donnée n'a été modifiée."]);
    }
}

    public function destroy($id)
    {
        $user = Auth::user();
        $abonnement = Abonnement::where('user_id', $user->id)->findOrFail($id);
        
        $abonnement->update(['statut' => 'annule']);

        // On repasse le statut à 0 si l'abonnement est annulé
        $user->update([
            'est_abonne' => false
        ]);

        return redirect()->back()->with('success', 'Abonnement annulé.');
    }

    public function monAbonnement()
{
    // On récupère le dernier abonnement (actif OU expiré)
    // pour que le client voie sa carte même après expiration
    $abonnement = Abonnement::with('formule')
        ->where('user_id', auth()->id())
        ->latest('date_fin')
        ->first();

    return Inertia::render('Abonnements/Index', [
        'abonnement' => $abonnement
    ]);
}
}