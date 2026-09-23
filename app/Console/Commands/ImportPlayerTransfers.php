<?php

namespace App\Console\Commands;

use App\Services\FootballApiService;
use App\Services\TransferImportService;
use Illuminate\Console\Command;

class ImportPlayerTransfers extends Command
{
    protected $signature = 'football:import-player
        {playerId}
        {leagueId}
        {season}';

    protected $description = 'Import transfer history for a football player';

    public function __construct(
        protected FootballApiService $api,
        protected TransferImportService $importer
    ) {
        parent::__construct();
    }

    public function handle(): int
    {
        $playerId = (int) $this->argument('playerId');
        $leagueId = (int) $this->argument('leagueId');
        $season = (int) $this->argument('season');

        $this->info(
            "Importing transfers for player ID: {$playerId}, " .
            "league ID: {$leagueId}, " .
            "season: {$season}..."
        );

        /*
        |--------------------------------------------------------------------------
        | Fetch player information
        |--------------------------------------------------------------------------
        */

        $response = $this->api->get('players', [
            'id' => $playerId,
            'season' => $season,
        ]);

        if ($response->status() === 429) {
            $this->error(
                'API-Football rate limit reached (HTTP 429).'
            );

            return self::FAILURE;
        }

        if (! $response->successful()) {
            $this->error(
                'Failed to fetch player. ' .
                'Status: ' . $response->status()
            );

            return self::FAILURE;
        }

        $data = $response->json();

        if (! empty($data['errors'])) {
            $this->error(
                'API-Football error: ' .
                json_encode($data['errors'])
            );

            return self::FAILURE;
        }

        if (empty($data['response'][0])) {
            $this->error(
                "Player with API ID {$playerId} was not found."
            );

            return self::FAILURE;
        }

        $playerData = $data['response'][0];

        /*
        |--------------------------------------------------------------------------
        | Import transfers
        |--------------------------------------------------------------------------
        */

        try {
            $imported = $this->importer->importPlayerTransfers(
                $playerData,
                $leagueId,
                $season
            );

            $this->info(
                "Successfully imported {$imported} transfer(s)."
            );

            return self::SUCCESS;
        } catch (\Throwable $e) {
            $this->error(
                $e->getMessage()
            );

            return self::FAILURE;
        }
    }
}