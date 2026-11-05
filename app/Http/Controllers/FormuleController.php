<?php

namespace App\Http\Controllers;

use App\Models\Formule;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class FormuleController extends Controller
{
    public function index()
    {
        return Inertia::render('Formules/Index', [
            'formules' => Formule::all(),
            
            'auth' => [
                'user' => Auth::user(),
            ],

            // abonnement actif ET date_fin pas encore dépassée
            'aDejaUnAbonnement' => Auth::check()
                ? Auth::user()->abonnements()
                    ->where('statut', 'actif')
                    ->where('date_fin', '>', now())
                    ->exists()
                : false,
        ]);
    }
}