<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('club_seasons', function (Blueprint $table) {
            $table->id();

            $table->foreignId('club_id')
                ->constrained('clubs')
                ->cascadeOnDelete();

            $table->foreignId('league_id')
                ->constrained('leagues')
                ->cascadeOnDelete();

            $table->foreignId('season_id')
                ->constrained('seasons')
                ->cascadeOnDelete();

            $table->timestamps();

            $table->unique([
                'club_id',
                'league_id',
                'season_id',
            ]);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('club_seasons');
    }
};