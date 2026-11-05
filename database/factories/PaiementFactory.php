<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class PaiementFactory extends Factory
{
    public function definition(): array
    {
        return [
            'abonnement_id' => $this->faker->numberBetween(1, 20),
            'montant' => $this->faker->randomElement([99.00, 199.00, 299.00]),
            'date_paiement' => $this->faker->dateTimeBetween('-6 months', 'now'),
            'statut' => $this->faker->randomElement([
                'effectue',
                'echoue',
                'rembourse'
            ])
        ];
    }
}
