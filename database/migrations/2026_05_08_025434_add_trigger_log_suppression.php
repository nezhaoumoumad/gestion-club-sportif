<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Nous utilisons BEFORE DELETE pour capturer les données AVANT qu'elles ne soient effacées
        DB::unprepared('
            CREATE TRIGGER avant_suppression_user
            BEFORE DELETE ON users
            FOR EACH ROW
            BEGIN
                INSERT INTO logs_suppressions (
                    user_id,
                    nom,
                    email,
                    role_au_moment_suppression,
                    date_creation_compte,
                    date_suppression
                )
                VALUES (
                    OLD.id,
                    OLD.nom,
                    OLD.email,
                    (SELECT nom FROM roles WHERE id = OLD.role_id),
                    OLD.created_at,
                    NOW()
                );
            END
        ');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::unprepared('DROP TRIGGER IF EXISTS avant_suppression_user');
    }
};