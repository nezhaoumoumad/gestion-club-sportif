<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Reservation extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id', 'seance_id', 'date_reservation', 'statut'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function seance()
    {
        return $this->belongsTo(Seance::class);
    }
}
