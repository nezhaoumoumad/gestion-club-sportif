<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up()
    {
        DB::unprepared("DROP PROCEDURE IF EXISTS GetTotalGeneralRecettes");
        DB::unprepared("
            CREATE PROCEDURE GetTotalGeneralRecettes(OUT total DOUBLE)
            BEGIN
                SELECT SUM(montant) INTO total FROM paiements;
            END
        ");
    }

    public function down()
    {
        DB::unprepared("DROP PROCEDURE IF EXISTS GetTotalGeneralRecettes");
    }
};