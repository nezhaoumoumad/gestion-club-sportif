<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;
use Carbon\Carbon;

class SupprimerInactifs extends Command
{
    protected $signature = 'users:supprimer-inactifs';
    protected $description = 'Supprime les comptes inactifs sans abonnement depuis plus de 30 jours';

    public function handle()
    {
        $limite = Carbon::now()->subDays(30);

        $users = User::where('role_id', 2)
            ->where('statut', 'inactif')
            ->where('created_at', '<=', $limite)
            ->whereDoesntHave('abonnements', function($q) {
                $q->where('statut', 'actif');
            })
            ->get();

        $count = $users->count();
        $users->each->delete();

        $this->info("$count compte(s) inactif(s) supprimé(s).");
        return Command::SUCCESS;
    }
}