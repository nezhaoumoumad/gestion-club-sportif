<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\SportController;
use App\Http\Controllers\LieuController;
use App\Http\Controllers\SeanceController;
use App\Http\Controllers\ReservationController;
use App\Http\Controllers\AbonnementController;
use App\Http\Controllers\FormuleController;
use App\Http\Controllers\CandidatureController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\CoachController;
use App\Http\Controllers\ReservationCoachingController;
use App\Http\Controllers\ClientController;
use App\Http\Controllers\PaiementController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AdminCoachController;
use App\Http\Controllers\ExportController;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Schedule;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| ROUTES PUBLIQUES
|--------------------------------------------------------------------------
*/

Route::get('/', function () {
    return Inertia::render('Welcome');
});

// Garde tes routes actuelles sans changer les ->name()
Route::get('/sports', [SportController::class, 'index'])->name('sports.index');
Route::get('/lieux', [LieuController::class, 'index'])->name('lieux.index');
Route::get('/membership', [FormuleController::class, 'index'])->name('formules.index');

// Ajoute juste celle-ci pour le nouveau bouton (crée le contrôleur plus tard)
Route::get('/personal-training', function () {
    return Inertia::render('PersonalTraining');
})->name('personal-training.index');

/*
|--------------------------------------------------------------------------
| ROUTES SOUS AUTHENTIFICATION (Utilisateurs connectés)
|--------------------------------------------------------------------------
*/

Route::middleware(['auth'])->group(function () {
    
    // On place la vue des séances ici pour que l'objet 'auth' soit complet dans React
    Route::get('/seances', [SeanceController::class, 'index'])->name('seances.index');

    // Redirection intelligente après login selon le rôle
    Route::get('/dashboard', [ClientController::class, 'index'])
    ->middleware(['auth', 'verified'])
    ->name('dashboard');


    // Candidatures pour devenir coach
    Route::get('/devenir-coach', [CandidatureController::class, 'create'])->name('candidature.create');
    Route::post('/candidature', [CandidatureController::class, 'store'])->name('candidature.store');

    /* |--- ESPACE CLIENT (Rôle 2) --- 
    */
    Route::middleware(['isClient'])->group(function () {

        Route::get('/compte-desactive', function () {
        return Inertia::render('CompteDesactive');
        })->name('compte.desactive');

        Route::get('/mon-profil', [ClientController::class, 'profil'])->name('client.profil');
        Route::get('/mon-abonnement', [AbonnementController::class, 'monAbonnement'])->name('mon.abonnement');

        Route::post('/abonnements', [AbonnementController::class, 'store'])->name('abonnements.store');
        Route::post('/paiements', [PaiementController::class, 'store'])->name('paiements.store');

        // Réservations de séances collectives
        Route::get('/mes-reservations', [ReservationController::class, 'index'])->name('reservations.index');
        Route::post('/reservations', [ReservationController::class, 'store'])->name('reservations.store'); // C'est cette route que le bouton appelle
        Route::delete('/reservations/{id}', [ReservationController::class, 'destroy'])->name('reservations.destroy');

        // Coaching Privé
        Route::get('/coachs', [CoachController::class, 'index'])->name('client.coachs');
        Route::get('/mes-coachings', [ReservationCoachingController::class, 'index'])->name('reservations.coaching.index');
        Route::post('/reservations-coaching', [ReservationCoachingController::class, 'store'])->name('reservations.coaching.store');
        Route::delete('/reservations-coaching/{id}', [ReservationCoachingController::class, 'cancel'])->name('reservations.coaching.cancel');    });

    /* |--- ESPACE COACH (Rôle 3) --- 
    */
    Route::middleware(['isCoach'])->group(function () {
        Route::get('/coach/dashboard', [CoachController::class, 'dashboard'])->name('coach.dashboard');
        Route::patch('/coach/profil', [CoachController::class, 'updateProfil'])->name('coach.profil.update');
        Route::get('/coach/reservations', [ReservationCoachingController::class, 'coachIndex'])->name('coach.coaching.index');
        Route::patch('/coach/reservations/{id}/confirmer', [ReservationCoachingController::class, 'confirm'])->name('coach.coaching.confirm');
        Route::patch('/coach/reservations/{id}/refuser', [ReservationCoachingController::class, 'reject'])->name('coach.coaching.reject');

        // ← AJOUTE CETTE ROUTE
        Route::get('/coach/compte-desactive', function () {
        return Inertia::render('Coach/CompteDesactive');
    })->name('coach.compte.desactive');
    });

    /* |--- ESPACE ADMIN (Rôle 1) --- */
Route::middleware(['isAdmin'])->prefix('admin')->name('admin.')->group(function () {
    
    // Devient 'admin.dashboard'
    Route::get('/dashboard', [AdminController::class, 'dashboard'])->name('dashboard'); 
    
    // Gestion des utilisateurs (Deviennent admin.users, admin.users.toggle, etc.)
    Route::get('/users', [AdminController::class, 'users'])->name('users');
    Route::patch('/users/{id}/toggle', [AdminController::class, 'toggleUser'])->name('users.toggle');
    Route::delete('/users/{id}', [AdminController::class, 'destroyUser'])->name('users.destroy');

    Route::get('/users/{id}', [AdminController::class, 'showUser'])->name('users.show');
    Route::get('/users/{id}/edit', [AdminController::class, 'editUser'])->name('users.edit');
    Route::patch('/users/{id}', [AdminController::class, 'updateUser'])->name('users.update');

    // Gestion du contenu (Deviennent admin.formules, admin.candidatures)
    Route::get('/formules', [AdminController::class, 'formules'])->name('formules');
    Route::get('/candidatures', [AdminController::class, 'candidatures'])->name('candidatures');
    Route::patch('/candidatures/{id}/accepter', [AdminController::class, 'accepterCandidature'])->name('candidatures.accepter');
    Route::get('/paiements', [AdminController::class, 'paiements'])->name('paiements');
    
    // Gestion des séances (Deviennent admin.seances.index, admin.seances.store, etc.)
    Route::get('/seances', [SeanceController::class, 'adminIndex'])->name('seances.index');
    Route::post('/seances', [SeanceController::class, 'store'])->name('seances.store');
    Route::delete('/seances/{seance}', [SeanceController::class, 'destroy'])->name('seances.destroy');
    Route::get('/seances/{seance}/edit', [SeanceController::class, 'edit'])->name('seances.edit');
    Route::get('/seances/{seance}/inscrits', [SeanceController::class, 'inscrits'])->name('seances.inscrits');
    Route::patch('/seances/{seance}', [SeanceController::class, 'update'])->name('seances.update');

    // Gestion des Sports
    Route::get('/sports', [SportController::class, 'adminIndex'])->name('sports.index');
    Route::post('/sports', [SportController::class, 'store'])->name('sports.store');
    Route::get('/sports/{id}/edit', [SportController::class, 'edit'])->name('sports.edit');
    // On utilise POST ici car le passage de fichiers (images) avec PUT/PATCH pose souvent problème en PHP/Inertia
    Route::post('/sports/{id}', [SportController::class, 'update'])->name('sports.update');
    Route::delete('/sports/{id}', [SportController::class, 'destroy'])->name('sports.destroy');

    // Gestion des Lieux
    Route::get('/lieux', [LieuController::class, 'adminIndex'])->name('lieux.index');
    Route::post('/lieux', [LieuController::class, 'store'])->name('lieux.store');
    Route::get('/lieux/{id}/edit', [LieuController::class, 'edit'])->name('lieux.edit');
    Route::post('/lieux/{id}', [LieuController::class, 'update'])->name('lieux.update'); // POST pour les images
    Route::delete('/lieux/{id}', [LieuController::class, 'destroy'])->name('lieux.destroy');

    // Gestion des Coachs (Admin)
    Route::get('/coachs', [AdminCoachController::class, 'index'])->name('coachs.index');
    Route::patch('/coachs/{id}', [AdminCoachController::class, 'update'])->name('coachs.update');
    Route::patch('/coachs/{id}/toggle', [AdminCoachController::class, 'toggleStatus'])->name('coachs.toggle');
    Route::delete('/coachs/{id}', [AdminCoachController::class, 'destroy'])->name('coachs.destroy');


    Route::get('/export/membres', [AdminController::class, 'exportMembresXML'])->name('export.membres');
    Route::get('/export/coachs', [AdminController::class, 'exportCoachsXML'])->name('export.coachs');
    Route::get('/export/paiements', [AdminController::class, 'exportPaiementsXML'])->name('export.paiements');

    Route::get('/logs', [AdminController::class, 'viewLogs'])->name('logs.index');
});

    Schedule::command('users:supprimer-inactifs')->daily();

    /*
    |--- PROFIL (Laravel Breeze) ---
    */
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

    // Route pour le client (Son reçu personnel)
    Route::get('/client/download-recu/{id}', [ExportController::class, 'downloadRecu'])->name('abonnements.recu');

    Route::get('lang/{locale}', function ($locale) {
        if (in_array($locale, ['fr', 'en', 'ar'])) {
            session()->put('locale', $locale);
        }
        return redirect()->back();
    })->name('language.switch');

require __DIR__.'/auth.php';