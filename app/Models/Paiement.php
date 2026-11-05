<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Paiement extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id', 'abonnement_id', 'montant', 'date_paiement', 'mode_paiement', 'statut'
    ];

    public function abonnement()
    {
        return $this->belongsTo(Abonnement::class);
    }
}
