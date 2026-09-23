<?php

namespace App\Http\Controllers;

use App\Models\League;
use Illuminate\Http\JsonResponse;

class LeagueController extends Controller
{
    public function index(): JsonResponse
    {
        $leagues = League::orderBy('name')->get();

        return response()->json([
            'success' => true,
            'count' => $leagues->count(),
            'data' => $leagues,
        ]);
    }

    public function show(int $id): JsonResponse
    {
        $league = League::with([
            'transfers.player',
            'transfers.fromClub',
            'transfers.toClub',
            'transfers.season',
        ])->find($id);

        if (! $league) {
            return response()->json([
                'success' => false,
                'message' => 'League not found.',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $league,
        ]);
    }
}