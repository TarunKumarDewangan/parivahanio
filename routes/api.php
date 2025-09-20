<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\GroupController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\LearnerLicenseController;
use App\Http\Controllers\Api\DrivingLicenseController;
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
use App\Http\Controllers\Api\GlobalSearchController;
use App\Http\Controllers\Api\WorkTakenController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| These routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
| All routes here are automatically prefixed with /api.
|
*/

// --- PROTECTED ROUTES (Require Authentication via Sanctum) ---
Route::middleware('auth:sanctum')->group(function () {

    // Core User & Auth Features
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
    Route::put('/me/password', [AuthController::class, 'updatePassword']);

    // Admin-Specific Features
    Route::get('/dashboard/stats', [DashboardController::class, 'getStats'])->middleware('role:admin');
    Route::apiResource('groups', GroupController::class);
    Route::apiResource('users', UserController::class);

    // General Application Features
    Route::apiResource('licenses', LearnerLicenseController::class);
    Route::apiResource('driving-licenses', DrivingLicenseController::class);
    Route::apiResource('citizens', CitizenController::class);
    Route::apiResource('work-taken', WorkTakenController::class);
    Route::get('reports/expiring-documents', [ReportController::class, 'expiringDocuments']);
    Route::get('global-search', [GlobalSearchController::class, 'search']);

    // Nested Vehicle & Document Features
    // Note: ->shallow() simplifies document routes to e.g., /insurances/{id} instead of /vehicles/{vid}/insurances/{id}
    Route::apiResource('citizens.vehicles', VehicleController::class)->shallow();
    Route::get('vehicles/{vehicle}/details', [VehicleController::class, 'getDetails']);
    Route::apiResource('vehicles.fitness_certificates', FitnessCertificateController::class)->shallow();
    Route::apiResource('vehicles.insurances', InsuranceController::class)->shallow();
    Route::apiResource('vehicles.permits', PermitController::class)->shallow();
    Route::apiResource('vehicles.puccs', PuccController::class)->shallow();
    Route::apiResource('vehicles.slds', SldController::class)->shallow();
    Route::apiResource('vehicles.vehicle_taxes', VehicleTaxController::class)->shallow();
    Route::apiResource('vehicles.vltds', VltdController::class)->shallow();
});
