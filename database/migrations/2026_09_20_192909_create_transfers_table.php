<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('transfers', function (Blueprint $table) {
            $table->id();

            $table->foreignId('player_id')
                ->constrained('players')
                ->cascadeOnDelete();

            $table->foreignId('from_club_id')
                ->nullable()
                ->constrained('clubs')
                ->nullOnDelete();

            $table->foreignId('to_club_id')
                ->nullable()
                ->constrained('clubs')
                ->nullOnDelete();

            $table->foreignId('league_id')
                ->nullable()
                ->constrained('leagues')
                ->nullOnDelete();

            $table->foreignId('season_id')
                ->constrained('seasons')
                ->cascadeOnDelete();

            $table->date('transfer_date')->nullable();

            $table->string('fee_raw')->nullable();

            $table->decimal('transfer_fee', 15, 2)->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transfers');
    }
};
