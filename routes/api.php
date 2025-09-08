<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\GroupController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\LearnerLicenseController;
use App\Http\Controllers\Api\DrivingLicenseController; // ✅ IMPORTED
use App\Http\Controllers\Api\CitizenController;
use App\Http\Controllers\Api\VehicleController;
use App\Http\Controllers\Api\FitnessCertificateController;
use App\Http\Controllers\Api\InsuranceController;
use App\Http\Controllers\Api\PermitController;
use App\Http\Controllers\Api\PuccController;
use App\Http\Controllers\Api\SldController;
use App\Http\Controllers\Api\VehicleTaxController;
use App\Http\Controllers\Api\VltdController;
use App\Http\Controllers\Api\ReportController;

// --- PUBLIC ROUTES ---
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// --- PROTECTED ROUTES ---
Route::middleware(['auth:sanctum'])->group(function () {

    // --- Core Features ---
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
    Route::put('/me/password', [AuthController::class, 'updatePassword']);
    Route::get('/dashboard/stats', [DashboardController::class, 'getStats'])->middleware('role:admin');
    Route::apiResource('groups', GroupController::class);
    Route::apiResource('users', UserController::class);

    // --- Application Features ---
    Route::apiResource('licenses', LearnerLicenseController::class);

    // ✅ NEW DRIVING LICENSE ROUTE
    Route::apiResource('driving-licenses', DrivingLicenseController::class);

    Route::apiResource('citizens', CitizenController::class);
    Route::get('citizens/{citizen}/vehicles', [VehicleController::class, 'index']);
    Route::post('citizens/{citizen}/vehicles', [VehicleController::class, 'store']);
    Route::apiResource('vehicles', VehicleController::class)->except(['index', 'store']);
    Route::get('vehicles/{vehicle}/details', [VehicleController::class, 'getDetails']);

    // --- Document Features ---
    Route::apiResource('vehicles.fitness_certificates', FitnessCertificateController::class);
    Route::apiResource('vehicles.insurances', InsuranceController::class);
    Route::apiResource('vehicles.permits', PermitController::class);
    Route::apiResource('vehicles.puccs', PuccController::class);
    Route::apiResource('vehicles.slds', SldController::class);
    Route::apiResource('vehicles.vehicle_taxes', VehicleTaxController::class);
    Route::apiResource('vehicles.vltds', VltdController::class);

    // --- Report Features ---
    Route::get('reports/expiring-documents', [ReportController::class, 'expiringDocuments']);
});
