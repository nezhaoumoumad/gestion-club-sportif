<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\ProfilCoach;
use App\Models\Seance;
use App\Models\Abonnement;
use App\Models\Paiement;
use App\Models\Reservation;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            RoleSeeder::class,
            SportSeeder::class,
            LieuSeeder::class,
            FormuleSeeder::class,
        ]);

        // Créer 1 admin
        User::factory()->create([
            'role_id' => 1,
            'prenom' => 'Admin',
            'nom' => 'Club',
            'email' => 'admin@clubsportif.com',
            'password' => Hash::make('admin123'),
        ]);

        // Créer 20 clients fictifs
        User::factory()->count(20)->create([
            'role_id' => 2,
        ]);

        // Créer 5 coachs fictifs
        User::factory()->count(5)->create([
            'role_id' => 3,
        ]);
         // 5. Créer 5 profils coachs
        for ($i = 22; $i <= 26; $i++) {
            ProfilCoach::create([
                'user_id' => $i,
                'bio' => fake()->sentence(),
                'specialite' => fake()->randomElement(['Yoga', 'Boxe', 'Natation', 'Cyclisme', 'Pilates']),
                'photo' => 'coach.jpg',
                'disponible' => true
            ]);
        }

        // 6. Créer 20 séances fictives
        Seance::factory()->count(20)->create();

        // 7. Créer 20 abonnements fictifs
        Abonnement::factory()->count(20)->create();

        // 8. Créer 20 paiements fictifs
        Paiement::factory()->count(20)->create();

        // 9. Créer 30 réservations fictives
        Reservation::factory()->count(30)->create();
    
    }
}
