<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\AviController;
use App\Http\Controllers\Api\ClientAuthController;
use App\Http\Controllers\Api\ClientController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\PaiementController;
use App\Http\Controllers\Api\ReservationController;
use App\Http\Controllers\Api\VehiculeController;
use Illuminate\Support\Facades\Route;

Route::post('/admin/login', [AuthController::class, 'login']);

Route::post('/client/register', [ClientAuthController::class, 'register']);
Route::post('/client/login', [ClientAuthController::class, 'login']);

Route::get('/vehicules', [VehiculeController::class, 'index']);
Route::get('/vehicules/{id}', [VehiculeController::class, 'show']);
Route::get('/vehicules/{id}/disponibilite', [VehiculeController::class, 'disponibilite']);

Route::post('/reservations', [ReservationController::class, 'store']);
Route::get('/reservations/{numero}', [ReservationController::class, 'show']);

Route::post('/paiements', [PaiementController::class, 'store']);

Route::post('/avis', [AviController::class, 'store']);

Route::middleware('auth:sanctum')->group(function () {
    // Client auth
    Route::post('/client/logout', [ClientAuthController::class, 'logout']);
    Route::get('/client/profile', [ClientAuthController::class, 'profile']);
    Route::put('/client/profile', [ClientAuthController::class, 'updateProfile']);
    Route::post('/client/permis', [ClientAuthController::class, 'uploadPermis']);
    Route::get('/client/reservations', [ReservationController::class, 'mesReservations']);

    // Admin auth
    Route::post('/admin/logout', [AuthController::class, 'logout']);
    Route::get('/admin/user', [AuthController::class, 'user']);

    // Admin dashboard
    Route::get('/dashboard/stats', [DashboardController::class, 'stats']);
    Route::get('/dashboard/reservations-recentes', [DashboardController::class, 'reservationsRecentes']);
    Route::get('/dashboard/revenus', [DashboardController::class, 'revenus']);
    Route::get('/dashboard/repartition-vehicules', [DashboardController::class, 'repartitionVehicules']);
    Route::get('/dashboard/rappels', [DashboardController::class, 'rappels']);

    // Admin CRUD
    Route::apiResource('vehicules-admin', VehiculeController::class)->except(['index', 'show']);
    Route::apiResource('clients', ClientController::class)->except(['store']);
    Route::apiResource('reservations-admin', ReservationController::class)->except(['store', 'show']);
    Route::get('/reservations', [ReservationController::class, 'index']);
    Route::put('/reservations/{id}/annuler', [ReservationController::class, 'annuler']);
    Route::get('/paiements', [PaiementController::class, 'index']);
    Route::get('/paiements/{id}', [PaiementController::class, 'show']);
    Route::get('/avis', [AviController::class, 'index']);
});
