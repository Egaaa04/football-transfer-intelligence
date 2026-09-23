<?php

namespace App\Http\Controllers;

use App\Models\Club;
use App\Models\League;
use App\Models\Player;
use App\Models\Season;
use App\Models\Transfer;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AnalyticsController extends Controller
{
    public function overview(Request $request): JsonResponse
    {
        $query = Transfer::query();

        if ($request->filled('season')) {
            $query->whereHas('season', function ($q) use ($request) {
                $q->where(
                    'year',
                    $request->integer('season')
                );
            });
        }

        $totalTransfers = (clone $query)->count();

        $totalPlayers = (clone $query)
            ->distinct('player_id')
            ->count('player_id');

        $totalClubs = Transfer::query()
            ->when(
                $request->filled('season'),
                function ($q) use ($request) {
                    $q->whereHas(
                        'season',
                        function ($q) use ($request) {
                            $q->where(
                                'year',
                                $request->integer('season')
                            );
                        }
                    );
                }
            )
            ->get()
            ->flatMap(function ($transfer) {
                return [
                    $transfer->from_club_id,
                    $transfer->to_club_id,
                ];
            })
            ->filter()
            ->unique()
            ->count();

        $totalLeagues = (clone $query)
            ->whereNotNull('league_id')
            ->distinct('league_id')
            ->count('league_id');

        $totalSeasons = (clone $query)
            ->distinct('season_id')
            ->count('season_id');

        $totalTransferFees = (clone $query)
            ->whereNotNull('transfer_fee')
            ->sum('transfer_fee');

        $averageTransferFee = (clone $query)
            ->whereNotNull('transfer_fee')
            ->avg('transfer_fee');

        $highestTransfer = (clone $query)
            ->with([
                'player',
                'fromClub',
                'toClub',
                'season',
            ])
            ->whereNotNull('transfer_fee')
            ->orderByDesc('transfer_fee')
            ->first();

        return response()->json([
            'success' => true,
            'data' => [
                'total_transfers' => $totalTransfers,
                'total_players' => $totalPlayers,
                'total_clubs' => $totalClubs,
                'total_leagues' => $totalLeagues,
                'total_seasons' => $totalSeasons,
                'total_transfer_fees' => (float) $totalTransferFees,
                'average_transfer_fee' => $averageTransferFee
                    ? (float) $averageTransferFee
                    : 0,
                'highest_transfer' => $highestTransfer,
            ],
        ]);
    }

    public function topTransfers(Request $request): JsonResponse
    {
        $query = Transfer::with([
            'player',
            'fromClub',
            'toClub',
            'season',
            'league',
        ])
            ->whereNotNull('transfer_fee');

        if ($request->filled('season')) {
            $query->whereHas('season', function ($q) use ($request) {
                $q->where(
                    'year',
                    $request->integer('season')
                );
            });
        }

        $transfers = $query
            ->orderByDesc('transfer_fee')
            ->limit(10)
            ->get();

        return response()->json([
            'success' => true,
            'count' => $transfers->count(),
            'data' => $transfers,
        ]);
    }

    public function activeClubs(Request $request): JsonResponse
    {
        $query = Club::query();

        if ($request->filled('season')) {
            $season = $request->integer('season');

            $query->where(function ($q) use ($season) {
                $q->whereHas(
                    'outgoingTransfers',
                    function ($q) use ($season) {
                        $q->whereHas(
                            'season',
                            function ($q) use ($season) {
                                $q->where(
                                    'year',
                                    $season
                                );
                            }
                        );
                    }
                )
                    ->orWhereHas(
                        'incomingTransfers',
                        function ($q) use ($season) {
                            $q->whereHas(
                                'season',
                                function ($q) use ($season) {
                                    $q->where(
                                        'year',
                                        $season
                                    );
                                }
                            );
                        }
                    );
            });
        }

        $clubs = $query
            ->withCount([
                'outgoingTransfers' => function ($q) use ($request) {
                    if ($request->filled('season')) {
                        $q->whereHas(
                            'season',
                            function ($q) use ($request) {
                                $q->where(
                                    'year',
                                    $request->integer('season')
                                );
                            }
                        );
                    }
                },

                'incomingTransfers' => function ($q) use ($request) {
                    if ($request->filled('season')) {
                        $q->whereHas(
                            'season',
                            function ($q) use ($request) {
                                $q->where(
                                    'year',
                                    $request->integer('season')
                                );
                            }
                        );
                    }
                },
            ])
            ->get()
            ->map(function ($club) {
                return [
                    'id' => $club->id,
                    'external_id' => $club->external_id,
                    'name' => $club->name,
                    'logo_url' => $club->logo_url,
                    'outgoing_transfers' =>
                    $club->outgoing_transfers_count,
                    'incoming_transfers' =>
                    $club->incoming_transfers_count,
                    'total_transfers' =>
                    $club->outgoing_transfers_count
                        + $club->incoming_transfers_count,
                ];
            })
            ->sortByDesc('total_transfers')
            ->values()
            ->take(10);

        return response()->json([
            'success' => true,
            'count' => $clubs->count(),
            'data' => $clubs,
        ]);
    }

    public function transfersPerSeason(): JsonResponse
    {
        $data = Season::withCount('transfers')
            ->orderBy('year')
            ->get()
            ->map(function ($season) {
                return [
                    'season_id' => $season->id,
                    'season' => $season->year,
                    'total_transfers' => $season->transfers_count,
                ];
            });

        return response()->json([
            'success' => true,
            'count' => $data->count(),
            'data' => $data,
        ]);
    }

    public function transfersPerLeague(): JsonResponse
    {
        $data = League::withCount('transfers')
            ->orderByDesc('transfers_count')
            ->get()
            ->map(function ($league) {
                return [
                    'league_id' => $league->id,
                    'external_id' => $league->external_id,
                    'name' => $league->name,
                    'country' => $league->country,
                    'logo_url' => $league->logo_url,
                    'total_transfers' => $league->transfers_count,
                ];
            });

        return response()->json([
            'success' => true,
            'count' => $data->count(),
            'data' => $data,
        ]);
    }
}
