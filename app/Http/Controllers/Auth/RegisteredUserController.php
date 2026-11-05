<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

use Illuminate\Support\Facades\Mail;
use App\Mail\MailBienvenueCompte;

use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    public function create(): Response
    {
        return Inertia::render('Auth/Register');
    }
    public function store(Request $request): RedirectResponse
{
    $request->validate([
        'prenom'   => 'required|string|max:255',
        'nom'      => 'required|string|max:255',
        'email'    => 'required|string|lowercase|email|max:255|unique:'.User::class,
        'password' => ['required', 'confirmed', 'min:8'],
        'telephone' => 'nullable|string|max:20',
    ]);

    $user = User::create([
        'role_id'   => 2, // client par défaut
        'prenom'    => $request->prenom,
        'nom'       => $request->nom,
        'email'     => $request->email,
        'password'  => Hash::make($request->password),
        'telephone' => $request->telephone,
        'statut'    => 'actif',
    ]);

    event(new Registered($user));
    Auth::login($user);

    // --- ENVOI DE L'EMAIL DE BIENVENUE ---
    Mail::to($user->email)->send(new MailBienvenueCompte($user));

    return redirect(route('dashboard'));
}
}
