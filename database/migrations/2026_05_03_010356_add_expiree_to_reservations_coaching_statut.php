<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::statement("ALTER TABLE reservations_coaching MODIFY COLUMN statut ENUM('en_attente', 'confirmee', 'annulee', 'terminee', 'expiree') DEFAULT 'en_attente'");
    }

    public function down(): void
    {
        DB::statement("ALTER TABLE reservations_coaching MODIFY COLUMN statut ENUM('en_attente', 'confirmee', 'annulee', 'terminee') DEFAULT 'en_attente'");
    }
};