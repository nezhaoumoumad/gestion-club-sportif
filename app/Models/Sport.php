<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Sport extends Model
{
    protected $fillable = ['nom', 'description', 'image'];

    public function seances()
    {
        return $this->hasMany(Seance::class);
    }
}
