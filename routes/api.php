<?php

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
*/

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
    Route::apiResource('driving-licenses', DrivingLicenseController::class);
    Route::apiResource('citizens', CitizenController::class);

    // --- Vehicle & Document Features ---

    // Nested resource for vehicles under a citizen. This creates routes like:
    // GET    /citizens/{citizen}/vehicles      (index)
    // POST   /citizens/{citizen}/vehicles      (store)
    Route::apiResource('citizens.vehicles', VehicleController::class)->except(['show', 'update', 'destroy']);

    // Standalone routes for managing a specific vehicle (Show, Update, Delete)
    // This allows cleaner URLs like /vehicles/{vehicle} for these actions.
    Route::apiResource('vehicles', VehicleController::class)->only(['show', 'update', 'destroy']);

    // Efficient route for the document page
    Route::get('vehicles/{vehicle}/details', [VehicleController::class, 'getDetails']);

    // Nested resources for all vehicle documents
    Route::apiResource('vehicles.fitness_certificates', FitnessCertificateController::class);
    Route::apiResource('vehicles.insurances', InsuranceController::class);
    Route::apiResource('vehicles.permits', PermitController::class);
    Route::apiResource('vehicles.puccs', PuccController::class);
    Route::apiResource('vehicles.slds', SldController::class);
    Route::apiResource('vehicles.vehicle_taxes', VehicleTaxController::class);
    Route::apiResource('vehicles.vltds', VltdController::class);

    // --- Work Taken & Report Features ---
    Route::apiResource('work-taken', WorkTakenController::class);
    Route::get('reports/expiring-documents', [ReportController::class, 'expiringDocuments']);
    Route::get('global-search', [GlobalSearchController::class, 'search']);


});

Route::get('/debug-config', function () {
    return response()->json([
        'message' => 'Current Live Configuration',
        'session_driver' => config('session.driver'),
        'session_domain' => config('session.domain'),
        'session_secure' => config('session.secure'),
        'session_same_site' => config('session.same_site'),
        'sanctum_stateful_domains' => config('sanctum.stateful'),
        'app_url' => config('app.url'),
    ]);
});
