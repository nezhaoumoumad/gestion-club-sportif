<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Seance extends Model
{
    use HasFactory;

    protected $fillable = [
        'sport_id', 'lieu_id', 'profil_coach_id',
        'date_heure', 'capacite', 'duree', 'description', 'statut'
    ];

    public function sport()
    {
        return $this->belongsTo(Sport::class);
    }

    public function lieu()
    {
        return $this->belongsTo(Lieu::class);
    }

    public function profilCoach()
    {
        return $this->belongsTo(ProfilCoach::class);
    }

    public function reservations()
    {
        return $this->hasMany(Reservation::class);
    }
}
