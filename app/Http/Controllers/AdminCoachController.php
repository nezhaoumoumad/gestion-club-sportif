<?php

namespace App\Http\Controllers;

use App\Models\ProfilCoach;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminCoachController extends Controller
{
    public function index()
    {
        $coachs = ProfilCoach::with(['user', 'reservationsCoaching.user'])
            ->get()
            ->map(function ($profil) {

                if ($profil->is_active_admin && $profil->disponible) {
                    $statut = 'actif';
                } elseif (!$profil->is_active_admin) {
                    $statut = 'desactive_admin';
                } else {
                    $statut = 'non_disponible';
                }

                $reservations = $profil->reservationsCoaching->map(function ($r) {
                    return [
                        'id'          => $r->id,
                        'date_seance' => $r->date_seance,
                        'statut'      => $r->statut,
                        'duree'       => $r->duree,
                        'notes'       => $r->notes,
                        'client'      => $r->user ? [
                            'prenom' => $r->user->prenom,
                            'nom'    => $r->user->nom,
                            'email'  => $r->user->email,
                        ] : null,
                    ];
                });

                return [
                    'id'              => $profil->id,
                    'user_id'         => $profil->user_id,
                    'specialite'      => $profil->specialite,
                    'bio'             => $profil->bio,
                    'disponible'      => $profil->disponible,
                    'is_active_admin' => $profil->is_active_admin,
                    'statut'          => $statut,
                    'user'            => $profil->user ? [
                        'id'        => $profil->user->id,
                        'prenom'    => $profil->user->prenom,
                        'nom'       => $profil->user->nom,
                        'email'     => $profil->user->email,
                        'telephone' => $profil->user->telephone,
                    ] : null,
                    'reservations'    => $reservations,
                ];
            });

        return Inertia::render('Admin/Coachs', [
            'coachs' => $coachs,
        ]);
    }

    public function update(Request $request, $id)
    {
        $profil = ProfilCoach::findOrFail($id);

        $request->validate([
            'prenom'     => 'required|string|max:100',
            'nom'        => 'required|string|max:100',
            'email'      => 'required|email|unique:users,email,' . $profil->user_id,
            'telephone'  => 'nullable|string|max:20',
            'specialite' => 'required|string|max:100',
            'bio'        => 'nullable|string|max:1000',
        ]);

        $profil->user->update([
            'prenom'    => $request->prenom,
            'nom'       => $request->nom,
            'email'     => $request->email,
            'telephone' => $request->telephone,
        ]);

        $profil->update([
            'specialite' => $request->specialite,
            'bio'        => $request->bio,
        ]);

        return redirect()->back()->with('success', 'Profil du coach mis à jour.');
    }

    public function toggleStatus($id)
{
    $profil = ProfilCoach::findOrFail($id);

    if ($profil->is_active_admin && $profil->disponible) {
        // Coach actif → on désactive par admin
        $profil->update(['is_active_admin' => false]);
        $message = 'Coach désactivé par l\'admin.';
    } else {
        // Coach inactif (peu importe la raison) → on réactive tout
        $profil->update([
            'is_active_admin' => true,
            'disponible'      => true,
        ]);
        $message = 'Coach réactivé.';
    }

    return redirect()->back()->with('success', $message);
}


    public function destroy($id)
    {
        $profil = ProfilCoach::findOrFail($id);
        $profil->user->delete();

        return redirect()->back()->with('success', 'Compte supprimé définitivement.');
    }
}