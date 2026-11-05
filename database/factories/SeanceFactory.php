<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class SeanceFactory extends Factory
{
    public function definition(): array
    {
       return [
            'sport_id' => $this->faker->numberBetween(1, 7),
            'lieu_id' => $this->faker->numberBetween(1, 4),
            'profil_coach_id' => $this->faker->numberBetween(1, 5),
            'date_heure' => $this->faker->dateTimeBetween('now', '+3 months'),
            'capacite' => $this->faker->numberBetween(10, 30),
            'duree' => $this->faker->randomElement([45, 60, 90]),
            'description' => $this->faker->sentence(),
            'statut' => 'planifiee'
        ];
    }
}
