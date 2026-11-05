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
        Schema::create('paiements', function (Blueprint $table) {
            $table->id();
            $table->decimal('montant', 8, 2);
            $table->timestamp('date_paiement')->useCurrent();
            $table->enum('statut', ['en_attente', 'effectue', 'echoue', 'rembourse'])->default('en_attente');
            $table->foreignId('abonnement_id')->constrained('abonnements')->onDelete('cascade');
            $table->timestamps();
    });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('paiements');
    }
};
