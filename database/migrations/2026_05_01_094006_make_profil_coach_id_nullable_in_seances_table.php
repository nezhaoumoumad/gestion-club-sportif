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
        Schema::table('seances', function (Blueprint $table) {
            // Rend la colonne profil_coach_id facultative
            $table->unsignedBigInteger('profil_coach_id')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('seances', function (Blueprint $table) {
            // Remet la colonne en obligatoire si on annule la migration
            $table->unsignedBigInteger('profil_coach_id')->nullable(false)->change();
        });
    }
};