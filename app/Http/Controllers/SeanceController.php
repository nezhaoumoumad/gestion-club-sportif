<?php

namespace App\Http\Controllers;

use App\Models\Seance;
use Illuminate\Http\Request;
use App\Models\Sport;
use App\Models\Lieu;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class SeanceController extends Controller
{
    public function index()
{
    // Mettre à jour en BDD les séances dont la date est passée
    Seance::whereIn('statut', ['planifiee', 'en_cours'])
    ->where('date_heure', '<', now('Africa/Casablanca'))
    ->update(['statut' => 'terminee']);

    $seances = Seance::with(['sport', 'lieu', 'profilCoach.user'])
        ->withCount(['reservations' => function ($query) {
            $query->where('statut', '!=', 'annulee');
        }])->get();

    $mesReservationsIds = [];
    $estAbonne = false;

    if (Auth::check()) {
        $user = Auth::user();

        $mesReservationsIds = DB::table('reservations')
            ->where('user_id', $user->id)
            ->where('statut', '!=', 'annulee')
            ->pluck('seance_id')->toArray();

        $estAbonne = DB::table('abonnements')
            ->where('user_id', $user->id)
            ->where('statut', 'actif')
            ->where('date_fin', '>', now())
            ->exists();
    }

    return Inertia::render('Seances/Index', [
        'seances' => $seances,
        'mesReservationsIds' => $mesReservationsIds,
        'estAbonne' => (bool)$estAbonne
    ]);
}


    public function adminIndex()
    {
        $seances = Seance::with(['lieu', 'sport', 'reservations' => function($query) {
            $query->where('statut', 'confirmee')->with('user');
        }])->orderBy('date_heure', 'desc')->get();

        $sports = Sport::all();
        $lieux = Lieu::all();

        return Inertia::render('Admin/Seances', [
            'seances' => $seances,
            'sports' => $sports,
            'lieux' => $lieux
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'date_heure' => 'required|date',
            'capacite' => 'required|integer|min:1',
            'duree' => 'required|integer',
            'sport_id' => 'required|exists:sports,id',
            'lieu_id' => 'required|exists:lieux,id',
            'description' => 'nullable|string',
        ]);

        Seance::create($validated);

        return redirect()->back()->with('success', 'Séance ajoutée avec succès.');
    }

    public function edit(Seance $seance)
{
    return Inertia::render('Admin/SeanceEdit', [
        'seance' => $seance,
        'sports' => Sport::all(),
        'lieux' => Lieu::all(),
    ]);
}

    public function destroy(Seance $seance)
    {
        $seance->delete();
        return redirect()->back()->with('success', 'Séance supprimée.');
    }


    public function inscrits(Seance $seance)
    {
        $seance->load([
            'sport',
            'reservations' => function ($query) {
                $query->where('statut', 'confirmee')->with('user');
            }
        ]);

        return Inertia::render('Admin/SeanceInscrits', [
            'seance' => $seance,
        ]);
    }


    public function update(Request $request, Seance $seance)
    {
        $validated = $request->validate([
            'date_heure'  => 'required|date',
            'capacite'    => 'required|integer|min:1',
            'duree'       => 'required|integer|min:1',
            'sport_id'    => 'required|exists:sports,id',
            'lieu_id'     => 'required|exists:lieux,id',
            'description' => 'nullable|string',
        ]);

        $seance->update($validated);

        return redirect()->route('admin.seances.index')->with('success', 'La séance a été modifiée avec succès.');
    }
}