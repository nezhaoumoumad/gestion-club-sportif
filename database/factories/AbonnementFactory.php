<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;


class AbonnementFactory extends Factory
{
   public function definition(): array
    {
        $formuleId = $this->faker->numberBetween(1, 3);
        
        // Durée selon la formule
        $durees = [1 => 1, 2 => 3, 3 => 6];
        $duree = $durees[$formuleId];
        
        $dateDebut = $this->faker->dateTimeBetween('-'.$duree.' months', 'now');
        $dateFin = (clone $dateDebut)->modify('+'.$duree.' months');

        return [
            'user_id' => $this->faker->numberBetween(2, 21),
            'formule_id' => $formuleId,
            'date_debut' => $dateDebut,
            'date_fin' => $dateFin,
            'statut' => $this->faker->randomElement([
                'actif',
                'expire',
                'annule'
            ])
        ];
    }
}
