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
        Schema::create('seances', function (Blueprint $table) {
            $table->id();
            $table->dateTime('date_heure');
            $table->integer('capacite');
            $table->integer('duree');
            $table->text('description')->nullable();
            $table->enum('statut', ['planifiee', 'en_cours', 'terminee', 'annulee'])->default('planifiee');
            $table->foreignId('sport_id')->constrained('sports')->onDelete('cascade');
            $table->foreignId('lieu_id')->constrained('lieux')->onDelete('cascade');
            $table->foreignId('profil_coach_id')->constrained('profils_coachs')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('seances');
    }
};
