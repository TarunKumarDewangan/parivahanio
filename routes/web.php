<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| This file is for session management routes for your SPA. It uses the
| 'web' middleware group, providing session state and CSRF protection.
|
*/

Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

// A route just to show the app is running.
Route::get('/', function () {
    return ['Laravel' => app()->version()];
});
