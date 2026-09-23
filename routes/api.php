<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\FootballApiController;
use App\Http\Controllers\TransferController;
use App\Http\Controllers\PlayerController;
use App\Http\Controllers\ClubController;
use App\Http\Controllers\LeagueController;
use App\Http\Controllers\SeasonController;
use App\Http\Controllers\AnalyticsController;

Route::get('/user', function (Request $request) {
    return $request->user();
});

Route::get('/football/test', [FootballApiController::class, 'test']);

Route::get('/transfers', [TransferController::class, 'index']);

Route::get('/transfers/{id}', [TransferController::class, 'show']);

Route::get('/players', [PlayerController::class, 'index']);

Route::get('/players/{id}', [PlayerController::class, 'show']);

Route::get('/clubs', [ClubController::class, 'index']);

Route::get('/clubs/{id}', [ClubController::class, 'show']);

Route::get('/leagues', [LeagueController::class, 'index']);

Route::get('/leagues/{id}', [LeagueController::class, 'show']);

Route::get('/seasons', [SeasonController::class, 'index']);

Route::get('/seasons/{id}', [SeasonController::class, 'show']);

Route::get('/analytics/overview', [AnalyticsController::class, 'overview']);

Route::get('/analytics/top-transfers', [AnalyticsController::class, 'topTransfers']);

Route::get('/analytics/active-clubs', [AnalyticsController::class, 'activeClubs']);

Route::get('/analytics/transfers-per-season', [AnalyticsController::class, 'transfersPerSeason']);

Route::get('/analytics/transfers-per-league', [AnalyticsController::class, 'transfersPerLeague']);

Route::get('/football/player/{playerId}', [FootballApiController::class, 'player']);

Route::get('/football/teams', [FootballApiController::class, 'teams']);
