<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    protected $fillable = [
        'role_id',
        'prenom',
        'nom',
        'email',
        'password',
        'telephone',
        'statut',
        'est_abonne',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];


    public function aAbonnementValide()
{
    return $this->abonnements()
        ->where('statut', 'actif')
        ->where('date_fin', '>=', now())
        ->exists();
}

    protected function casts(): array
    {
        return [
            'password' => 'hashed',
            'est_abonne' => 'boolean',
        ];
    }

    /**
     * RELATIONS
     */

    // Relation indispensable pour la fiche client
    public function paiements()
    {
        return $this->hasMany(Paiement::class);
    }

    public function abonnements()
    {
        return $this->hasMany(Abonnement::class);
    }

    public function role()
    {
        return $this->belongsTo(Role::class);
    }

    public function reservations()
    {
        return $this->hasMany(Reservation::class);
    }

    public function reservationsCoaching()
    {
        return $this->hasMany(ReservationCoaching::class);
    }

    public function profilCoach()
    {
        return $this->hasOne(ProfilCoach::class);
    }

    public function candidatures()
    {
        return $this->hasMany(Candidature::class);
    }

    public function emails()
    {
        return $this->hasMany(Email::class);
    }
}