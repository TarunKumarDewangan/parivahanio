<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth; // Use the standard Auth facade
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    /**
     * Register a new user and log them in.
     */
    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'required|string|max:15|unique:users,phone',
            'password' => 'required|string|min:6',
        ]);

        $user = User::create([
            'name' => $request->name,
            'phone' => $request->phone,
            'password' => Hash::make($request->password),
            'role' => 'user', // Default role for public registration
        ]);

        Auth::login($user);
        $request->session()->regenerate();

        return response()->json([
            'status' => true,
            'message' => 'User registered and logged in successfully',
            'user' => $user->load('group'),
        ], 201);
    }

    /**
     * Login user using standard session-based authentication.
     */
    public function login(Request $request)
    {
        $credentials = $request->validate([
            'phone' => 'required|string',
            'password' => 'required|string',
        ]);

        if (Auth::attempt($credentials)) {
            $request->session()->regenerate();

            return response()->json([
                'status' => true,
                'message' => 'Login successful',
                'user' => Auth::user()->load('group'),
            ]);
        }

        throw ValidationException::withMessages([
            'phone' => ['The provided credentials are incorrect.'],
        ]);
    }

    /**
     * Logout user by invalidating the session.
     */
    public function logout(Request $request)
    {
        Auth::guard('web')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json([
            'status' => true,
            'message' => 'Logged out successfully',
        ]);
    }

    /**
     * Get the currently authenticated user.
     */
    public function me(Request $request)
    {
        return response()->json([
            'status' => true,
            'user' => $request->user()->load('group'),
        ]);
    }

    /**
     * Update the authenticated user's password.
     */
    public function updatePassword(Request $request)
    {
        $request->validate([
            'old_password' => 'required|string',
            'password' => 'required|string|min:6|confirmed',
        ]);

        $user = $request->user();

        if (!Hash::check($request->old_password, $user->password)) {
            return response()->json(['status' => false, 'message' => 'Current password is incorrect'], 400);
        }

        $user->password = bcrypt($request->password);
        $user->save();

        return response()->json(['status' => true, 'message' => 'Password updated successfully']);
    }
}
