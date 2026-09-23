<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class League extends Model
{
    protected $fillable = [
        'external_id',
        'name',
        'country',
        'logo_url',
    ];

    public function transfers(): HasMany
    {
        return $this->hasMany(Transfer::class);
    }

    public function clubSeasons(): HasMany
    {
        return $this->hasMany(ClubSeason::class);
    }
}
