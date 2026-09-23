<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Player extends Model
{
    protected $fillable = [
        'external_id',
        'name',
        'age',
        'position',
        'photo_url',
    ];

    public function transfers(): HasMany
    {
        return $this->hasMany(Transfer::class);
    }
}