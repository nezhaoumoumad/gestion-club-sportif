<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class ReservationFactory extends Factory
{
    public function definition(): array
    {
        return [
            'user_id' => $this->faker->numberBetween(2, 21),
            'seance_id' => $this->faker->numberBetween(1, 20),
            'statut' => $this->faker->randomElement([
                'en_attente',
                'confirmee',
                'annulee',
                'terminee'
            ])
        ];
    }
}
