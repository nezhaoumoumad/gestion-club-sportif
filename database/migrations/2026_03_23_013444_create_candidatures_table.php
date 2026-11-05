<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('candidatures', function (Blueprint $table) {
            $table->id();
            $table->text('experience');
            $table->text('motivation');
            $table->enum('statut', ['en_attente', 'en_examen', 'acceptee', 'refusee'])->default('en_attente');
            $table->timestamp('date_candidature')->useCurrent();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->timestamps();
        });
    }
    public function down(): void
    {
        Schema::dropIfExists('candidatures');
    }
};
