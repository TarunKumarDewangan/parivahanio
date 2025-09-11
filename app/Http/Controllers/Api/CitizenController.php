<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Citizen;
use App\Models\User;
use Illuminate\Http\Request;

class CitizenController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        // Eager load vehicles to prevent N+1 query issues and ensure data is available
        if ($user->role === 'admin') {
            $citizens = Citizen::with('vehicles')->latest()->get();
        } elseif ($user->role === 'group_manager') {
            $userIdsInGroup = User::where('group_id', $user->group_id)->pluck('id');
            $citizens = Citizen::with('vehicles')->whereIn('user_id', $userIdsInGroup)->latest()->get();
        } else {
            $citizens = Citizen::with('vehicles')->where('user_id', $user->id)->latest()->get();
        }

        return response()->json($citizens);
    }

    public function store(Request $request)
    {
        // Policy check for creation is implicitly handled by requiring an authenticated user.
        // Or you can add: $this->authorize('create', Citizen::class);

        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'mobile_no' => 'required|string|max:15',
            'email' => 'nullable|email|max:255|unique:citizens',
            'birth_date' => 'nullable|date',
            'relation_type' => 'nullable|string|max:50',
            'relation_name' => 'nullable|string|max:255',
            'address' => 'nullable|string',
            'state' => 'nullable|string|max:100',
            'city' => 'nullable|string|max:100',
        ]);

        $validatedData['user_id'] = $request->user()->id;
        $citizen = Citizen::create($validatedData);

        // ✅ Return the created model with its relationships loaded for consistency.
        return response()->json($citizen->load('vehicles'), 201);
    }

    public function show(Citizen $citizen)
    {
        $this->authorize('view', $citizen);
        return response()->json($citizen->load('vehicles'));
    }

    public function update(Request $request, Citizen $citizen)
    {
        $this->authorize('update', $citizen);

        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'mobile_no' => 'required|string|max:15',
            'email' => 'nullable|email|max:255|unique:citizens,email,' . $citizen->id,
            'birth_date' => 'nullable|date',
            'relation_type' => 'nullable|string|max:50',
            'relation_name' => 'nullable|string|max:255',
            'address' => 'nullable|string',
            'state' => 'nullable|string|max:100',
            'city' => 'nullable|string|max:100',
        ]);

        $citizen->update($validatedData);

        // ✅ FIX: Refresh the model from the database and load relationships
        // This ensures the response contains the absolute latest data.
        return response()->json($citizen->fresh()->load('vehicles'));
    }

    public function destroy(Citizen $citizen)
    {
        $this->authorize('delete', $citizen);
        $citizen->delete();
        return response()->json(null, 204);
    }
}
