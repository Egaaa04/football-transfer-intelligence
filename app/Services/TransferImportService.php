<?php

namespace App\Services;

use App\Models\Club;
use App\Models\League;
use App\Models\Player;
use App\Models\Season;
use App\Models\Transfer;
use Illuminate\Support\Facades\DB;

class TransferImportService
{
    public function __construct(
        protected FootballApiService $api
    ) {}

    public function importPlayerTransfers(
        array $playerData,
        int $leagueExternalId,
        int $seasonYear
    ): int {
        $player = $playerData['player'] ?? [];

        if (empty($player['id'])) {
            return 0;
        }

        $playerExternalId = (int) $player['id'];

        /*
        |--------------------------------------------------------------------------
        | Save / update player
        |--------------------------------------------------------------------------
        */

        $position = $this->getPositionFromStatistics(
            $playerData['statistics'] ?? [],
            $leagueExternalId,
            $seasonYear
        );

        $playerModel = Player::updateOrCreate(
            [
                'external_id' => $playerExternalId,
            ],
            [
                'name' => $player['name'] ?? 'Unknown',
                'age' => $player['age'] ?? null,
                'position' => $position,
                'photo_url' => $player['photo'] ?? null,
            ]
        );

        /*
        |--------------------------------------------------------------------------
        | Find target league
        |--------------------------------------------------------------------------
        */

        $league = League::where(
            'external_id',
            $leagueExternalId
        )->first();

        if (! $league) {
            throw new \RuntimeException(
                "League with external ID {$leagueExternalId} not found."
            );
        }

        /*
        |--------------------------------------------------------------------------
        | Fetch transfer history
        |--------------------------------------------------------------------------
        */

        sleep(7);

        $response = $this->api->get('transfers', [
            'player' => $playerExternalId,
        ]);

        if ($response->status() === 429) {
            throw new \RuntimeException(
                'API-Football rate limit reached (HTTP 429).'
            );
        }

        if (! $response->successful()) {
            throw new \RuntimeException(
                'API-Football request failed with status ' .
                    $response->status()
            );
        }

        $data = $response->json();

        if (! empty($data['errors'])) {
            throw new \RuntimeException(
                'API-Football error: ' .
                    json_encode($data['errors'])
            );
        }

        if (empty($data['response'][0]['transfers'])) {
            return 0;
        }

        /*
        |--------------------------------------------------------------------------
        | Import transfers
        |--------------------------------------------------------------------------
        */

        $imported = 0;

        DB::transaction(function () use (
            $data,
            $playerModel,
            $league,
            $seasonYear,
            &$imported
        ) {
            foreach ($data['response'][0]['transfers'] as $transferData) {
                $date = $transferData['date'] ?? null;

                if (! $date) {
                    continue;
                }

                /*
                |--------------------------------------------------------------------------
                | Determine season from transfer date
                |--------------------------------------------------------------------------
                |
                | July - December -> same calendar year
                | January - June  -> previous calendar year
                |
                */

                $transferSeasonYear = $this->getSeasonYear($date);

                if ($transferSeasonYear !== $seasonYear) {
                    continue;
                }

                /*
                |--------------------------------------------------------------------------
                | Season
                |--------------------------------------------------------------------------
                */

                $season = Season::firstOrCreate([
                    'year' => $transferSeasonYear,
                ]);

                /*
                |--------------------------------------------------------------------------
                | Clubs
                |--------------------------------------------------------------------------
                */

                $fromClub = $this->findOrCreateClub(
                    $transferData['teams']['out'] ?? null
                );

                $toClub = $this->findOrCreateClub(
                    $transferData['teams']['in'] ?? null
                );

                /*
                |--------------------------------------------------------------------------
                | Target league validation
                |--------------------------------------------------------------------------
                */

                $transferLeagueId = $this->findLeagueId(
                    $fromClub,
                    $toClub,
                    $season,
                    $league
                );

                /*
                |--------------------------------------------------------------------------
                | Skip transfers that are not related to target league
                |--------------------------------------------------------------------------
                */

                if ($transferLeagueId === null) {
                    continue;
                }

                /*
                |--------------------------------------------------------------------------
                | Save transfer
                |--------------------------------------------------------------------------
                */

                $transfer = Transfer::firstOrCreate(
                    [
                        'player_id' => $playerModel->id,
                        'from_club_id' => $fromClub?->id,
                        'to_club_id' => $toClub?->id,
                        'league_id' => $transferLeagueId,
                        'season_id' => $season->id,
                        'transfer_date' => $date,
                    ],
                    [
                        'fee_raw' => $transferData['type'] ?? null,
                        'transfer_fee' => $this->parseTransferFee(
                            $transferData['type'] ?? null
                        ),
                    ]
                );

                if ($transfer->wasRecentlyCreated) {
                    $imported++;
                }
            }
        });

        return $imported;
    }

    protected function getPositionFromStatistics(
        array $statistics,
        int $leagueExternalId,
        int $season
    ): ?string {
        $leagueStatistics = collect($statistics)->first(
            function ($stat) use ($leagueExternalId, $season) {
                return ($stat['league']['id'] ?? null) == $leagueExternalId
                    && ($stat['league']['season'] ?? null) == $season;
            }
        );

        return $leagueStatistics['games']['position'] ?? null;
    }

    protected function findOrCreateClub(?array $clubData): ?Club
    {
        if (empty($clubData['id'])) {
            return null;
        }

        return Club::updateOrCreate(
            [
                'external_id' => $clubData['id'],
            ],
            [
                'name' => $clubData['name'] ?? 'Unknown',
                'logo_url' => $clubData['logo'] ?? null,
            ]
        );
    }

    protected function getSeasonYear(?string $date): int
    {
        $transferDate = \Carbon\Carbon::parse($date);

        return $transferDate->month >= 7
            ? $transferDate->year
            : $transferDate->year - 1;
    }

    protected function parseTransferFee(?string $fee): ?float
    {
        if (! $fee) {
            return null;
        }

        $fee = trim($fee);

        /*
        |--------------------------------------------------------------------------
        | Non-numeric transfer types
        |--------------------------------------------------------------------------
        */

        if (
            $fee === 'Loan' ||
            $fee === 'N/A' ||
            str_contains(strtolower($fee), 'loan') ||
            str_contains(strtolower($fee), 'free agent')
        ) {
            return null;
        }

        /*
        |--------------------------------------------------------------------------
        | Normalize value
        |--------------------------------------------------------------------------
        */

        $normalized = str_replace(
            ['€', '$', '£', ' '],
            '',
            $fee
        );

        /*
        |--------------------------------------------------------------------------
        | Millions
        |--------------------------------------------------------------------------
        */

        if (str_ends_with(strtoupper($normalized), 'M')) {
            $number = (float) str_replace(
                'M',
                '',
                strtoupper($normalized)
            );

            return $number * 1_000_000;
        }

        /*
        |--------------------------------------------------------------------------
        | Thousands
        |--------------------------------------------------------------------------
        */

        if (str_ends_with(strtoupper($normalized), 'K')) {
            $number = (float) str_replace(
                'K',
                '',
                strtoupper($normalized)
            );

            return $number * 1_000;
        }

        /*
        |--------------------------------------------------------------------------
        | Plain numeric value
        |--------------------------------------------------------------------------
        */

        $normalized = str_replace(',', '', $normalized);

        return is_numeric($normalized)
            ? (float) $normalized
            : null;
    }

    protected function findLeagueId(
        ?Club $fromClub,
        ?Club $toClub,
        Season $season,
        League $league
    ): ?int {
        /*
     * League di sini digunakan sebagai konteks dataset,
     * bukan sebagai filter terhadap klub asal/tujuan transfer.
     *
     * Contoh:
     * Manchester United → Dortmund
     *
     * Dortmund tidak perlu menjadi anggota Premier League
     * agar transfer tetap dapat disimpan.
     */

        if (! $fromClub && ! $toClub) {
            return null;
        }

        return $league->id;
    }
}
