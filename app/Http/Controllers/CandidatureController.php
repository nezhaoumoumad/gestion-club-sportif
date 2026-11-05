<?php

namespace App\Http\Controllers;

use App\Models\Candidature;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class CandidatureController extends Controller
{
    public function create()
    {
        $candidatureActuelle = Candidature::where('user_id', Auth::id())
            ->latest()
            ->first();

        return Inertia::render('Candidatures/Create', [
            'candidatureActuelle' => $candidatureActuelle
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'experience' => 'required|string|min:20',
            'motivation' => 'required|string|min:20',
            'cv'         => 'required|mimes:pdf|max:2048', 
        ], [
            'experience.min' => 'Veuillez détailler un peu plus votre expérience.',
            'motivation.min' => 'Votre motivation semble un peu courte.',
            'cv.required'    => 'Le téléchargement de votre CV est obligatoire.',
        ]);

        $dejaPostule = Candidature::where('user_id', Auth::id())
            ->whereIn('statut', ['en_attente', 'en_examen'])
            ->exists();

        if ($dejaPostule) {
            return redirect()->route('dashboard')->with('error', 'Vous avez déjà une candidature en cours.');
        }

        $path = null;
        if ($request->hasFile('cv')) {
            $user = Auth::user();
            $extension = $request->file('cv')->getClientOriginalExtension();
            
            // Nettoyage du nom pour éviter les problèmes d'URL
            $safePrenom = str_replace(' ', '_', $user->prenom);
            $safeNom = str_replace(' ', '_', $user->nom);
            
            // On définit le nom du fichier : CV_Prenom_Nom.pdf
            $fileName = "CV_{$safePrenom}_{$safeNom}.{$extension}";

            // On stocke avec le nom personnalisé
            $path = $request->file('cv')->storeAs('cvs', $fileName, 'public');
        }

        Candidature::create([
            'user_id'    => Auth::id(),
            'experience' => $request->experience,
            'motivation' => $request->motivation,
            'cv_path'    => $path,
            'statut'     => 'en_attente',
        ]);

        return redirect()->route('dashboard')->with('success', 'Votre candidature a été envoyée avec succès.');
    }
}