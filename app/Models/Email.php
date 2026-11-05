<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Email extends Model
{
    protected $fillable = [
        'user_id', 'sujet', 'contenu', 'date_envoi', 'statut'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
