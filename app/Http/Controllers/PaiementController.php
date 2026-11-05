<?php

namespace App\Http\Controllers;

use App\Models\Paiement;
use App\Models\Abonnement;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class PaiementController extends Controller
{
    public function index()
    {
        $paiements = Paiement::whereHas('abonnement', function($q) {
            $q->where('user_id', Auth::id());
        })->with('abonnement.formule')->get();

        return Inertia::render('Paiements/Index', [
            'paiements' => $paiements
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'abonnement_id' => 'required|exists:abonnements,id',
            'montant'       => 'required|numeric',
        ]);

        $paiement = Paiement::create([
            'abonnement_id' => $request->abonnement_id,
            'montant'       => $request->montant,
            'statut'        => 'effectue'
        ]);

        // Sécurité supplémentaire : Si on valide un paiement ici,
        // on s'assure que l'utilisateur lié à cet abonnement devient "abonné"
        $abonnement = Abonnement::find($request->abonnement_id);
        if ($abonnement) {
            User::where('id', $abonnement->user_id)->update([
                'est_abonne' => true
            ]);
        }

        return redirect()->back()->with('success', 'Paiement effectué avec succès');
    }
}