<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Lieu;

class LieuSeeder extends Seeder
{
     public function run(): void
    {
        $lieux = [
            [
                'ville' => 'Casablanca',
                'pays' => 'Maroc',
                'adresse' => '123 Boulevard Mohammed V',
                'image' => 'casablanca.jpg',
                'description' => 'Notre club principal au cœur de Casablanca'
            ],
            [
                'ville' => 'Rabat',
                'pays' => 'Maroc',
                'adresse' => '45 Avenue Hassan II',
                'image' => 'rabat.jpg',
                'description' => 'Club moderne en plein centre de Rabat'
            ],
            [
                'ville' => 'Marrakech',
                'pays' => 'Maroc',
                'adresse' => '78 Rue de la Liberté',
                'image' => 'marrakech.jpg',
                'description' => 'Club premium au cœur de Marrakech'
            ],
            [
                'ville' => 'Tanger',
                'pays' => 'Maroc',
                'adresse' => '12 Boulevard Mohammed VI',
                'image' => 'tanger.jpg',
                'description' => 'Club spacieux avec vue sur mer'
            ],
        ];

        foreach ($lieux as $lieu) {
            Lieu::create($lieu);
        }
    }
}
