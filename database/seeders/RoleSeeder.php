<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Role;

class RoleSeeder extends Seeder
{
    public function run(): void
    {
        $roles = ['admin', 'client', 'coach'];

        foreach ($roles as $role) {
            Role::create([
                'nom' => $role
            ]);
        }
    }
}
