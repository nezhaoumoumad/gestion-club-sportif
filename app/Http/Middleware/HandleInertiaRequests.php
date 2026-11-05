<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    protected $rootView = 'app';

    public function share(Request $request): array
    {
        $user        = $request->user();
        $formuleNom  = null;
        $formulePrix = 0;

        if ($user) {
            $abonnementActif = $user->abonnements()
                ->where('statut', 'actif')
                ->where('date_fin', '>', now())
                ->with('formule')
                ->latest()
                ->first();

            if ($abonnementActif && $abonnementActif->formule) {
                $formuleNom  = $abonnementActif->formule->nom;
                $formulePrix = (float) $abonnementActif->formule->prix;
            }
        }

        // ── FIX : 'fr' hardcodé comme défaut — ignore config('app.locale') qui vaut 'en' par défaut dans Laravel
        $locale = session('locale', 'fr');
        if (! in_array($locale, ['fr', 'en', 'ar'])) {
            $locale = 'fr';
        }
        app()->setLocale($locale);

        return [
            ...parent::share($request),

            'auth' => [
                'user' => $user ? [
                    'id'           => $user->id,
                    'prenom'       => $user->prenom,
                    'nom'          => $user->nom,
                    'role_id'      => $user->role_id,
                    'formule_nom'  => $formuleNom,
                    'formule_prix' => $formulePrix,
                ] : null,
            ],

            // ── I18N ── partagés à TOUTES les pages Inertia ──
            'locale'       => $locale,
            'translations' => (array) trans('messages'),
        ];
    }
}