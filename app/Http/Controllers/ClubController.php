<?php

namespace App\Http\Controllers;

use App\Models\Club;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ClubController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Club::query();

        if ($request->filled('search')) {
            $search = $request->string('search');

            $query->where(
                'name',
                'like',
                '%' . $search . '%'
            );
        }

        $clubs = $query
            ->orderBy('name')
            ->get();

        return response()->json([
            'success' => true,
            'count' => $clubs->count(),
            'data' => $clubs,
        ]);
    }

    public function show(int $id): JsonResponse
    {
        $club = Club::with([
            'outgoingTransfers.player',
            'outgoingTransfers.toClub',
            'incomingTransfers.player',
            'incomingTransfers.fromClub',
        ])->find($id);

        if (! $club) {
            return response()->json([
                'success' => false,
                'message' => 'Club not found.',
            ], 404);
        }

        $club->outgoingTransfers->each(function ($transfer) use ($club) {
            $transfer->setRelation('club', $club);
        });

        $club->incomingTransfers->each(function ($transfer) use ($club) {
            $transfer->setRelation('club', $club);
        });

        return response()->json([
            'success' => true,
            'data' => $club,
        ]);
    }
}