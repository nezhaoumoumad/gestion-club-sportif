<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Formule extends Model
{
    protected $fillable = [
        'nom', 'prix', 'duree_mois', 'description'
    ];

    public function abonnements()
    {
        return $this->hasMany(Abonnement::class);
    }
}
