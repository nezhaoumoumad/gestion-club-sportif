<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Formule;

class FormuleSeeder extends Seeder
{
    public function run(): void
    {
        $formules = [
            [
                'nom' => 'Basique',
                'prix' => 99.00,
                'duree_mois' => 1,
                'description' => 'Accès aux séances de groupe uniquement'
            ],
            [
                'nom' => 'Premium',
                'prix' => 199.00,
                'duree_mois' => 3,
                'description' => 'Accès aux séances de groupe et au coaching personnel'
            ],
            [
                'nom' => 'VIP',
                'prix' => 299.00,
                'duree_mois' => 6,
                'description' => 'Accès illimité à tout avec priorité de réservation'
            ],
        ];

        foreach ($formules as $formule) {
            Formule::create($formule);
        }
    }
}
