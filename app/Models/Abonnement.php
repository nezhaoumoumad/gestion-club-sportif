<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Abonnement extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id', 'formule_id', 'date_debut', 'date_fin', 'statut'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function formule()
    {
        return $this->belongsTo(Formule::class);
    }

    public function paiements()
    {
        return $this->hasMany(Paiement::class);
    }
}
