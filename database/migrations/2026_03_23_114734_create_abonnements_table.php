<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
     public function up(): void
    {
        Schema::create('abonnements', function (Blueprint $table) {
            $table->id();
            $table->date('date_debut');
            $table->date('date_fin');
            $table->enum('statut', ['en_attente', 'actif', 'expire', 'annule'])->default('en_attente');
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('formule_id')->constrained('formules')->onDelete('cascade');
            $table->timestamps();
        });
    }
    public function down(): void
    {
        Schema::dropIfExists('abonnements');
    }
};
