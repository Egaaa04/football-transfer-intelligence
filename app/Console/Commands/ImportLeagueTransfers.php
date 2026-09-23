<?php

namespace App\Console\Commands;

use App\Models\ClubSeason;
use App\Models\Player;
use App\Services\FootballApiService;
use App\Services\TransferImportService;
use Illuminate\Console\Command;

class ImportLeagueTransfers extends Command
{
    protected $signature = 'football:import-league-transfers
        {leagueId}
        {season}
        {--limit=10 : Maximum number of NEW players to process}
        {--club-limit=4 : Maximum number of clubs to process}';

    protected $description = 'Import transfer history for new players in a league and season';

    public function __construct(
        protected FootballApiService $api,
        protected TransferImportService $transferImportService
    ) {
        parent::__construct();
    }

    public function handle(): int
    {
        $leagueId = (int) $this->argument('leagueId');
        $season = (int) $this->argument('season');
        $limit = (int) $this->option('limit');
        $clubLimit = (int) $this->option('club-limit');

        if ($limit < 1) {
            $this->error('The --limit option must be at least 1.');

            return self::FAILURE;
        }

        if ($clubLimit < 1) {
            $this->error('The --club-limit option must be at least 1.');

            return self::FAILURE;
        }

        $this->info(
            "Importing transfers for league ID: {$leagueId}, " .
            "season: {$season}..."
        );

        $this->line("New player limit: {$limit}");
        $this->line("Club limit: {$clubLimit}");

        $clubSeasons = ClubSeason::with('club')
            ->whereHas('league', function ($query) use ($leagueId) {
                $query->where('external_id', $leagueId);
            })
            ->whereHas('season', function ($query) use ($season) {
                $query->where('year', $season);
            })
            ->get();

        $this->info("Clubs found: {$clubSeasons->count()}");

        if ($clubSeasons->isEmpty()) {
            $this->warn(
                'No clubs found for this league and season.'
            );

            return self::SUCCESS;
        }

        $processedPlayers = 0;
        $skippedExistingPlayers = 0;
        $importedTransfersTotal = 0;

        foreach ($clubSeasons->take($clubLimit) as $clubSeason) {
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
                    'season' => $season,
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

                    $existingPlayer = Player::where(
                        'external_id',
                        $playerExternalId
                    )->exists();

                    if ($existingPlayer) {
                        $skippedExistingPlayers++;

                        $this->line(
                            "  Skipping existing player: " .
                            $playerName .
                            " (API ID: {$playerExternalId})"
                        );

                        continue;
                    }

                    $processedPlayers++;

                    $this->line(
                        "[{$processedPlayers}/{$limit}] " .
                        "New player: " .
                        $playerName .
                        " (API ID: {$playerExternalId})"
                    );

                    try {
                        $importedTransfers =
                            $this->transferImportService
                                ->importPlayerTransfers(
                                    $playerData,
                                    $leagueId,
                                    $season
                                );

                        $importedTransfersTotal += $importedTransfers;

                        $this->info(
                            "  Transfers imported: " .
                            $importedTransfers
                        );
                    } catch (\Throwable $e) {
                        $this->error(
                            "  Transfer import failed: " .
                            $e->getMessage()
                        );

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

                /*
                 * API-Football Free plan:
                 * process maximum 3 pages per club.
                 */
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
        $this->info('Transfer import completed.');
        $this->info(
            "New players processed: {$processedPlayers}"
        );
        $this->info(
            "Existing players skipped: {$skippedExistingPlayers}"
        );
        $this->info(
            "New transfers imported: {$importedTransfersTotal}"
        );
        $this->info('========================================');

        return self::SUCCESS;
    }
}