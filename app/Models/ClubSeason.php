<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ClubSeason extends Model
{
    protected $fillable = [
        'club_id',
        'league_id',
        'season_id',
    ];

    public function club(): BelongsTo
    {
        return $this->belongsTo(Club::class);
    }

    public function league(): BelongsTo
    {
        return $this->belongsTo(League::class);
    }

    public function season(): BelongsTo
    {
        return $this->belongsTo(Season::class);
    }
}