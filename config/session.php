<?php

use Illuminate\Support\Str;

return [
    'driver' => env('SESSION_DRIVER', 'cookie'),
    'lifetime' => env('SESSION_LIFETIME', 120),
    'expire_on_close' => false,
    'encrypt' => false,
    'files' => storage_path('framework/sessions'),
    'connection' => env('SESSION_CONNECTION'),
    'table' => 'sessions',
    'store' => env('SESSION_STORE'),
    'lottery' => [2, 100],
    'cookie' => env('SESSION_COOKIE', Str::slug(env('APP_NAME', 'laravel'), '_') . '_session'),
    'path' => '/',

    // Smart domain detection
    'domain' => env('SESSION_DOMAIN', null),

    // Smart secure cookie detection
    'secure' => env('SESSION_SECURE_COOKIE', false),
    'http_only' => true,

    // Smart same_site detection
    'same_site' => env('SESSION_SAME_SITE', 'lax'),
    'partitioned' => false,
];
