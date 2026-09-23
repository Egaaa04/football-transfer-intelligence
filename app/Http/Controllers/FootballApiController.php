<?php

namespace App\Http\Controllers;

use App\Services\FootballApiService;

class FootballApiController extends Controller
{
    public function test(FootballApiService $api)
    {
        $response = $api->get('transfers', [
            'player' => 874,
        ]);

        return response()->json([
            'success' => $response->successful(),
            'status' => $response->status(),
            'data' => $response->json(),
        ]);
    }

    public function player(int $playerId, FootballApiService $api)
    {
        $response = $api->get('players', [
            'id' => $playerId,
            'season' => 2023,
        ]);

        return response()->json([
            'success' => $response->successful(),
            'status' => $response->status(),
            'data' => $response->json(),
        ]);
    }

    public function teams(FootballApiService $api)
    {
        $response = $api->get('teams', [
            'league' => 39,
            'season' => 2023,
        ]);

        return response()->json([
            'success' => $response->successful(),
            'status' => $response->status(),
            'data' => $response->json(),
        ]);
    }
}
