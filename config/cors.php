<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    */

    'paths' => [
        'api/*',
        'login',
        'register',
        'logout',
        'sanctum/csrf-cookie'
    ],

    'allowed_methods' => ['*'],

    // This line reads a comma-separated list from your .env file.
    // If the .env variable is not set, it defaults to allowing only your local vite server.
    'allowed_origins' => explode(',', env('CORS_ALLOWED_ORIGINS', 'http://localhost:5173')),

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => true,

];
