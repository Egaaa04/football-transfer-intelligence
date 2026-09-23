<?php

namespace App\Http\Controllers;

use App\Models\Player;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PlayerController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Player::query();

        if ($request->filled('search')) {
            $search = $request->string('search');

            $query->where(
                'name',
                'like',
                '%' . $search . '%'
            );
        }

        if ($request->filled('position')) {
            $query->where(
                'position',
                $request->string('position')
            );
        }

        if ($request->filled('min_age')) {
            $query->where(
                'age',
                '>=',
                $request->integer('min_age')
            );
        }

        if ($request->filled('max_age')) {
            $query->where(
                'age',
                '<=',
                $request->integer('max_age')
            );
        }

        $players = $query
            ->orderBy('name')
            ->get();

        return response()->json([
            'success' => true,
            'count' => $players->count(),
            'data' => $players,
        ]);
    }

    public function show(int $id): JsonResponse
    {
        $player = Player::with([
            'transfers.fromClub',
            'transfers.toClub',
            'transfers.league',
            'transfers.season',
        ])->find($id);

        if (! $player) {
            return response()->json([
                'success' => false,
                'message' => 'Player not found.',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $player,
        ]);
    }
}
