<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Sport;

class SportSeeder extends Seeder
{
    public function run(): void
    {
        $sports = [
            [
                'nom' => 'Yoga',
                'description' => 'Améliore la flexibilité et la relaxation',
                'image' => 'yoga.jpg'
            ],
            [
                'nom' => 'Boxe',
                'description' => 'Sport de combat pour renforcer le corps',
                'image' => 'boxe.jpg'
            ],
            [
                'nom' => 'Natation',
                'description' => 'Sport aquatique complet pour tout le corps',
                'image' => 'natation.jpg'
            ],
            [
                'nom' => 'Cyclisme',
                'description' => 'Cardio intense sur vélo stationnaire',
                'image' => 'cyclisme.jpg'
            ],
            [
                'nom' => 'Pilates',
                'description' => 'Renforcement musculaire en douceur',
                'image' => 'pilates.jpg'
            ],
            [
                'nom' => 'Running',
                'description' => 'Course à pied pour améliorer l\'endurance',
                'image' => 'running.jpg'
            ],
            [
                'nom' => 'Musculation',
                'description' => 'Renforcement musculaire avec poids et machines',
                'image' => 'musculation.jpg'
            ],
        ];

        foreach ($sports as $sport) {
            Sport::create($sport);
        }
    }
}
