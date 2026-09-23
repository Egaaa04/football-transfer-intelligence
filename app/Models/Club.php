<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Club extends Model
{
    protected $fillable = [
        'external_id',
        'name',
        'logo_url',
    ];

    public function outgoingTransfers(): HasMany
    {
        return $this->hasMany(Transfer::class, 'from_club_id');
    }

    public function incomingTransfers(): HasMany
    {
        return $this->hasMany(Transfer::class, 'to_club_id');
    }

    public function clubSeasons(): HasMany
    {
        return $this->hasMany(ClubSeason::class);
    }
}
