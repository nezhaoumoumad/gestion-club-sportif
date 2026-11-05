<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Candidature extends Model
{
    protected $fillable = [
        'user_id',
        'experience',
        'motivation',
        'statut',
        'date_candidature',
        'cv_path'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}