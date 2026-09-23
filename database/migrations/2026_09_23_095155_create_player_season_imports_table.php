<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('player_season_imports', function (Blueprint $table) {
            $table->id();

            $table->foreignId('player_id')
                ->constrained('players')
                ->cascadeOnDelete();

            $table->foreignId('season_id')
                ->constrained('seasons')
                ->cascadeOnDelete();

            $table->timestamp('imported_at')->useCurrent();

            $table->unique([
                'player_id',
                'season_id',
            ]);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('player_season_imports');
    }
};