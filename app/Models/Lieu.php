<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Lieu extends Model
{
    protected $table = 'lieux';

    protected $fillable = ['ville', 'pays', 'adresse', 'telephone', 'image', 'description'];
    public function seances()
    {
        return $this->hasMany(Seance::class);
    }
}
