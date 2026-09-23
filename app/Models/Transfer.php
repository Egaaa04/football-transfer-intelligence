<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Transfer extends Model
{
    protected $fillable = [
        'player_id',
        'from_club_id',
        'to_club_id',
        'league_id',
        'season_id',
        'transfer_date',
        'fee_raw',
        'transfer_fee',
    ];

    protected $casts = [
        'transfer_date' => 'date',
        'transfer_fee' => 'decimal:2',
    ];

    public function player(): BelongsTo
    {
        return $this->belongsTo(Player::class);
    }

    public function fromClub(): BelongsTo
    {
        return $this->belongsTo(Club::class, 'from_club_id');
    }

    public function toClub(): BelongsTo
    {
        return $this->belongsTo(Club::class, 'to_club_id');
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
