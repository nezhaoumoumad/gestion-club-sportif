<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;

class UserFactory extends Factory
{
   public function definition(): array
    {
        return [
            'role_id' => 2,
            'prenom' => fake()->firstName(),
            'nom' => fake()->lastName(),
            'email' => fake()->unique()->safeEmail(),
            'password' => Hash::make('password123'),
            'telephone' => fake()->phoneNumber(),
            'statut' => 'actif'
        ];
    }
}
