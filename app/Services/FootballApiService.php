<?php

namespace App\Services;

use Illuminate\Http\Client\Response;
use Illuminate\Support\Facades\Http;

class FootballApiService
{
    protected string $baseUrl;
    protected string $apiKey;

    public function __construct()
    {
        $this->baseUrl = config('services.api_football.base_url');
        $this->apiKey = config('services.api_football.key');
    }

    public function get(
        string $endpoint,
        array $params = []
    ): Response {
        return Http::withHeaders([
            'x-apisports-key' => $this->apiKey,
        ])
            ->timeout(30)
            ->get(
                $this->baseUrl . '/' . ltrim($endpoint, '/'),
                $params
            );
    }
}