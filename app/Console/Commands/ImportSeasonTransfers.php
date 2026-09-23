<?php

namespace App\Console\Commands;

use App\Models\ClubSeason;
use App\Models\Player;
use App\Models\PlayerSeasonImport;
use App\Models\Season;
use App\Services\FootballApiService;
use App\Services\TransferImportService;
use Illuminate\Console\Command;

class ImportSeasonTransfers extends Command
{
    protected $signature = 'football:import-season-transfers
        {leagueId}
        {season}
        {--limit=10 : Maximum number of players to process}
        {--club-limit=4 : Maximum number of clubs to process}
        {--club-offset=0 : Number of clubs to skip before starting}';

    protected $description = 'Import transfer history for a league season with player-season tracking';

    public function __construct(
        protected FootballApiService $api,
        protected TransferImportService $transferImportService
    ) {
        parent::__construct();
    }

    public function handle(): int
    {
        $leagueId = (int) $this->argument('leagueId');
        $seasonYear = (int) $this->argument('season');
        $limit = (int) $this->option('limit');
        $clubLimit = (int) $this->option('club-limit');
        $clubOffset = (int) $this->option('club-offset');

        if ($limit < 1) {
            $this->error('The --limit option must be at least 1.');

            return self::FAILURE;
        }

        if ($clubLimit < 1) {
            $this->error('The --club-limit option must be at least 1.');

            return self::FAILURE;
        }

        if ($clubOffset < 0) {
            $this->error('The --club-offset cannot be negative.');

            return self::FAILURE;
        }

        $this->info(
            "Importing season transfers for league ID: {$leagueId}, " .
            "season: {$seasonYear}..."
        );

        $this->line("Player limit: {$limit}");
        $this->line("Club limit: {$clubLimit}");
        $this->line("Club offset: {$clubOffset}");

        $season = Season::where('year', $seasonYear)->first();

        if (! $season) {
            $this->error(
                "Season {$seasonYear} does not exist in the database."
            );

            return self::FAILURE;
        }

        $clubSeasons = ClubSeason::with('club')
            ->whereHas('league', function ($query) use ($leagueId) {
                $query->where('external_id', $leagueId);
            })
            ->where('season_id', $season->id)
            ->get();

        $this->info(
            "Clubs found: {$clubSeasons->count()}"
        );

        if ($clubSeasons->isEmpty()) {
            $this->warn(
                'No clubs found for this league and season.'
            );

            return self::SUCCESS;
        }

        if ($clubOffset >= $clubSeasons->count()) {
            $this->error(
                "Club offset {$clubOffset} is outside the available " .
                "club range."
            );

            return self::FAILURE;
        }

        $selectedClubs = $clubSeasons
            ->slice($clubOffset, $clubLimit);

        $this->info(
            "Selected clubs: {$selectedClubs->count()}"
        );

        $processedPlayers = 0;
        $skippedPlayerSeasons = 0;
        $newPlayers = 0;
        $existingPlayers = 0;
        $importedTransfersTotal = 0;

        foreach ($selectedClubs as $clubSeason) {
            if ($processedPlayers >= $limit) {
                break;
            }

            $club = $clubSeason->club;

            if (! $club) {
                continue;
            }

            $this->newLine();

            $this->info(
                "Club: {$club->name} " .
                "(API ID: {$club->external_id})"
            );

            $page = 1;
            $totalPages = 1;

            do {
                if ($processedPlayers >= $limit) {
                    break;
                }

                $this->line(
                    "  Requesting players page {$page}..."
                );

                $response = $this->api->get('players', [
                    'team' => $club->external_id,
                    'season' => $seasonYear,
                    'page' => $page,
                ]);

                if ($response->status() === 429) {
                    $this->error(
                        'Rate limit reached (HTTP 429).'
                    );

                    return self::FAILURE;
                }

                if (! $response->successful()) {
                    $this->error(
                        "Failed to fetch players for {$club->name}. " .
                        "Page: {$page}. " .
                        "Status: {$response->status()}"
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

                if (
                    ! isset($data['response']) ||
                    ! isset($data['paging'])
                ) {
                    $this->error(
                        "Unexpected API response on page {$page}."
                    );

                    return self::FAILURE;
                }

                $players = $data['response'];

                $currentPage = (int) $data['paging']['current'];
                $totalPages = (int) $data['paging']['total'];

                $this->line(
                    "  Page {$currentPage}/{$totalPages}: " .
                    count($players) .
                    " players"
                );

                foreach ($players as $playerData) {
                    if ($processedPlayers >= $limit) {
                        break 2;
                    }

                    $player = $playerData['player'] ?? [];

                    if (empty($player['id'])) {
                        continue;
                    }

                    $playerExternalId = (int) $player['id'];
                    $playerName = $player['name'] ?? 'Unknown';

                    /*
                     * Check whether this exact player + season
                     * has already been processed.
                     *
                     * This check happens BEFORE the transfer API request.
                     */
                    $existingPlayerModel = Player::where(
                        'external_id',
                        $playerExternalId
                    )->first();

                    if ($existingPlayerModel) {
                        $existingPlayer = true;
                        $playerModelId = $existingPlayerModel->id;
                    } else {
                        $existingPlayer = false;
                        $playerModelId = null;
                    }

                    $alreadyImported = false;

                    if ($playerModelId !== null) {
                        $alreadyImported = PlayerSeasonImport::where(
                            'player_id',
                            $playerModelId
                        )
                            ->where(
                                'season_id',
                                $season->id
                            )
                            ->exists();
                    }

                    if ($alreadyImported) {
                        $skippedPlayerSeasons++;

                        $this->line(
                            "  SKIP {$playerName} " .
                            "(API ID: {$playerExternalId}) " .
                            "- season {$seasonYear} already imported."
                        );

                        continue;
                    }

                    $processedPlayers++;

                    if ($existingPlayer) {
                        $existingPlayers++;

                        $this->line(
                            "[{$processedPlayers}/{$limit}] " .
                            "Existing player: {$playerName} " .
                            "(API ID: {$playerExternalId})"
                        );
                    } else {
                        $newPlayers++;

                        $this->line(
                            "[{$processedPlayers}/{$limit}] " .
                            "New player: {$playerName} " .
                            "(API ID: {$playerExternalId})"
                        );
                    }

                    try {
                        $importedTransfers =
                            $this->transferImportService
                                ->importPlayerTransfers(
                                    $playerData,
                                    $leagueId,
                                    $seasonYear
                                );

                        $importedTransfersTotal += $importedTransfers;

                        $this->info(
                            "  Transfers imported: " .
                            $importedTransfers
                        );

                        /*
                         * IMPORTANT:
                         * Mark player + season as processed even when
                         * zero transfers were found.
                         */
                        $playerModel = Player::where(
                            'external_id',
                            $playerExternalId
                        )->first();

                        if ($playerModel) {
                            PlayerSeasonImport::firstOrCreate(
                                [
                                    'player_id' => $playerModel->id,
                                    'season_id' => $season->id,
                                ],
                                [
                                    'imported_at' => now(),
                                ]
                            );
                        }
                    } catch (\Throwable $e) {
                        $this->error(
                            "  Transfer import failed: " .
                            $e->getMessage()
                        );

                        /*
                         * Do NOT mark the player-season as imported
                         * when the API/import failed.
                         */
                        if (
                            str_contains(
                                $e->getMessage(),
                                'HTTP 429'
                            )
                        ) {
                            $this->error(
                                'Stopping import because API rate limit was reached.'
                            );

                            return self::FAILURE;
                        }
                    }
                }

                $maxPage = min($totalPages, 3);

                if ($currentPage !== $page) {
                    $this->error(
                        "Unexpected page returned. " .
                        "Requested: {$page}, " .
                        "Returned: {$currentPage}"
                    );

                    return self::FAILURE;
                }

                $page++;
            } while ($page <= $maxPage);
        }

        $this->newLine();

        $this->info('========================================');
        $this->info('Season transfer import completed.');
        $this->info(
            "Players processed: {$processedPlayers}"
        );
        $this->info(
            "Existing players: {$existingPlayers}"
        );
        $this->info(
            "New players: {$newPlayers}"
        );
        $this->info(
            "Player-seasons skipped: {$skippedPlayerSeasons}"
        );
        $this->info(
            "New transfers imported: {$importedTransfersTotal}"
        );
        $this->info('========================================');

        return self::SUCCESS;
    }
}