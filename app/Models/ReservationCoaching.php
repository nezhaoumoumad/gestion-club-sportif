<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use DateTimeInterface; // Ne pas oublier cet import

class ReservationCoaching extends Model
{
    protected $table = 'reservations_coaching';
    use HasFactory;

    protected $fillable = [
        'user_id', 'profil_coach_id',
        'date_seance', 'duree', 'notes', 'statut'
    ];

    protected $casts = [
        'date_seance' => 'datetime',
    ];

    protected function serializeDate(DateTimeInterface $date)
    {
        return $date->format('d/m/Y H:i');
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function profilCoach()
    {
        return $this->belongsTo(ProfilCoach::class);
    }
}