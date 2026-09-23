<?php

namespace App\Http\Controllers;

use App\Models\Transfer;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TransferController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Transfer::with([
            'player',
            'fromClub',
            'toClub',
            'league',
            'season',
        ]);

        // Filter berdasarkan season
        if ($request->filled('season')) {
            $query->whereHas('season', function ($q) use ($request) {
                $q->where('year', $request->integer('season'));
            });
        }

        // Filter berdasarkan league external ID
        if ($request->filled('league')) {
            $query->whereHas('league', function ($q) use ($request) {
                $q->where(
                    'external_id',
                    $request->integer('league')
                );
            });
        }

        // Filter berdasarkan player external ID
        if ($request->filled('player')) {
            $player = $request->string('player');

            $query->whereHas('player', function ($q) use ($player) {
                $q->where('name', 'like', '%' . $player . '%');
            });
        }

        // Filter berdasarkan club external ID
        if ($request->filled('club')) {
            $clubId = $request->integer('club');

            $query->where(function ($q) use ($clubId) {
                $q->whereHas('fromClub', function ($q) use ($clubId) {
                    $q->where('external_id', $clubId);
                })
                    ->orWhereHas('toClub', function ($q) use ($clubId) {
                        $q->where('external_id', $clubId);
                    });
            });
        }

        $transfers = $query
            ->latest('transfer_date')
            ->get();

        return response()->json([
            'success' => true,
            'count' => $transfers->count(),
            'data' => $transfers,
        ]);
    }

    public function show(int $id): JsonResponse
    {
        $transfer = Transfer::with([
            'player',
            'fromClub',
            'toClub',
            'league',
            'season',
        ])->find($id);

        if (! $transfer) {
            return response()->json([
                'success' => false,
                'message' => 'Transfer not found.',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $transfer,
        ]);
    }
}
