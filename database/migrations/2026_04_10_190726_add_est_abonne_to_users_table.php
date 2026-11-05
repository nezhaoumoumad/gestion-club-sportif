<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // On ajoute une colonne boolean (0 ou 1).
            // Par défaut c'est 0 (false) car l'utilisateur n'a pas encore payé.
            $table->boolean('est_abonne')->default(false)->after('email');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Indispensable si tu veux annuler la migration plus tard
            $table->dropColumn('est_abonne');
        });
    }
};
