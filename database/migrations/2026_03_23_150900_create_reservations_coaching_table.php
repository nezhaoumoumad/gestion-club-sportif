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
        Schema::create('reservations_coaching', function (Blueprint $table) {
            $table->id();
            $table->dateTime('date_seance');
            $table->integer('duree');
            $table->text('notes')->nullable();
            $table->enum('statut', ['en_attente', 'confirmee', 'annulee', 'terminee'])->default('en_attente');
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('profil_coach_id')->constrained('profils_coachs')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reservations_coaching');
    }
};
