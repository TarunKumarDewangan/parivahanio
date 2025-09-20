<?php

use Illuminate\Support\Facades\Route;

// This file is not used for the API.
// It can be used for web pages if you add them later.
Route::get('/', function () {
    return ['Laravel' => app()->version()];
});
