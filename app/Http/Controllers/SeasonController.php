<?php

namespace App\Http\Controllers;

use App\Models\Season;
use Illuminate\Http\JsonResponse;

class SeasonController extends Controller
{
    public function index(): JsonResponse
    {
        $seasons = Season::orderByDesc('year')->get();

        return response()->json([
            'success' => true,
            'count' => $seasons->count(),
            'data' => $seasons,
        ]);
    }

    public function show(int $id): JsonResponse
    {
        $season = Season::with([
            'transfers.player',
            'transfers.fromClub',
            'transfers.toClub',
            'transfers.league',
        ])->find($id);

        if (! $season) {
            return response()->json([
                'success' => false,
                'message' => 'Season not found.',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $season,
        ]);
    }
}