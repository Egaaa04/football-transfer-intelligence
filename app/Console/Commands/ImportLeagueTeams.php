<?php

namespace App\Console\Commands;

use App\Models\Club;
use App\Models\ClubSeason;
use App\Models\League;
use App\Models\Season;
use App\Services\FootballApiService;
use Illuminate\Console\Command;

class ImportLeagueTeams extends Command
{
    protected $signature = 'football:import-league {leagueId} {season}';

    protected $description = 'Import league, season, teams, and club-season relationships';

    public function handle(FootballApiService $api): int
    {
        $leagueExternalId = (int) $this->argument('leagueId');
        $seasonYear = (int) $this->argument('season');

        $this->info(
            "Importing league {$leagueExternalId} for season {$seasonYear}..."
        );

        try {
            $response = $api->get('teams', [
                'league' => $leagueExternalId,
                'season' => $seasonYear,
            ]);

            if (! $response->successful()) {
                $this->error(
                    'API-Football request failed with status ' . $response->status()
                );

                return self::FAILURE;
            }

            $data = $response->json();

            if (empty($data['response'])) {
                $this->warn('No teams found.');

                return self::SUCCESS;
            }

            /*
             * Ambil informasi league dari response API.
             */
            $leagueData = $data['parameters']['league'] ?? $leagueExternalId;

            $leagueInfo = $data['response'][0]['team'] ?? null;

            if (! $leagueInfo) {
                $this->error('League/team information is missing.');

                return self::FAILURE;
            }

            /*
             * Untuk sementara nama league kita ambil dari
             * endpoint leagues, bukan dari object team.
             */
            $leagueResponse = $api->get('leagues', [
                'id' => $leagueExternalId,
            ]);

            if (! $leagueResponse->successful()) {
                $this->error(
                    'Failed to fetch league information. Status: '
                    . $leagueResponse->status()
                );

                return self::FAILURE;
            }

            $leagueResponseData = $leagueResponse->json();

            $leagueApiData = $leagueResponseData['response'][0]['league'] ?? null;
            $country = $leagueResponseData['response'][0]['country']['name'] ?? null;

            if (! $leagueApiData) {
                $this->error('League information not found.');

                return self::FAILURE;
            }

            /*
             * Simpan league.
             */
            $league = League::updateOrCreate(
                [
                    'external_id' => $leagueApiData['id'],
                ],
                [
                    'name' => $leagueApiData['name'],
                    'country' => $country,
                    'logo_url' => $leagueApiData['logo'] ?? null,
                ]
            );

            /*
             * Simpan season.
             */
            $season = Season::firstOrCreate([
                'year' => $seasonYear,
            ]);

            $imported = 0;

            foreach ($data['response'] as $teamData) {
                $team = $teamData['team'] ?? null;

                if (! $team || empty($team['id'])) {
                    continue;
                }

                /*
                 * Simpan/update club.
                 */
                $club = Club::updateOrCreate(
                    [
                        'external_id' => $team['id'],
                    ],
                    [
                        'name' => $team['name'],
                        'logo_url' => $team['logo'] ?? null,
                    ]
                );

                /*
                 * Hubungkan club dengan league + season.
                 */
                $clubSeason = ClubSeason::firstOrCreate([
                    'club_id' => $club->id,
                    'league_id' => $league->id,
                    'season_id' => $season->id,
                ]);

                if ($clubSeason->wasRecentlyCreated) {
                    $imported++;
                }
            }

            $this->info("League: {$league->name}");
            $this->info("Season: {$season->year}");
            $this->info("Teams found: " . count($data['response']));
            $this->info("New club-season relationships: {$imported}");

            return self::SUCCESS;
        } catch (\Throwable $e) {
            $this->error($e->getMessage());

            return self::FAILURE;
        }
    }
}