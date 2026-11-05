<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Support\Facades\Auth;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->web(append: [
            \App\Http\Middleware\HandleInertiaRequests::class,
            \Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets::class,
            \App\Http\Middleware\SetLocale::class, // Activation du multi-langues
        ]);

        $middleware->alias([
            'isAdmin'  => \App\Http\Middleware\IsAdmin::class,
            'isClient' => \App\Http\Middleware\IsClient::class,
            'isCoach'  => \App\Http\Middleware\IsCoach::class,
        ]);

        // Gestion des redirections après connexion selon le rôle
        $middleware->redirectUsersTo(function () {
            $user = Auth::user();
            if (!$user) return route('login');

            if ((int)$user->role_id === 1) {
                return route('admin.dashboard');
            } elseif ((int)$user->role_id === 3) {
                return route('coach.dashboard');
            }
            return route('dashboard');
        });
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        //
    })->create();