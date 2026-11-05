<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProfilCoach extends Model
{
    protected $table = 'profils_coachs';

    protected $fillable = [
        'user_id', 'bio', 'specialite', 'photo', 'disponible', 'is_active_admin'
    ];

    protected $casts = [
        'disponible'      => 'boolean',
        'is_active_admin' => 'boolean',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function seances()
    {
        return $this->hasMany(Seance::class);
    }

    public function reservationsCoaching()
    {
        return $this->hasMany(ReservationCoaching::class);
    }
}