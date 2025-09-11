<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\WorkTaken;
use Illuminate\Http\Request;
use App\Models\User;

class WorkTakenController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        // ✅ FIX: Use a closure to properly load relationships that might be null
        $query = WorkTaken::with([
            'citizen' => function ($query) {
                $query->select('id', 'name', 'mobile_no'); // Only select needed columns
            },
            'vehicle' => function ($query) {
                $query->select('id', 'registration_no'); // Only select needed columns
            }
        ]);

        if ($user->role === 'admin') {
            // No user filter for admin
        } elseif ($user->role === 'group_manager') {
            $userIdsInGroup = User::where('group_id', $user->group_id)->pluck('id');
            $query->whereIn('user_id', $userIdsInGroup);
        } else {
            $query->where('user_id', $user->id);
        }

        return response()->json($query->latest()->get());
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'citizen_id' => 'required|exists:citizens,id',
            'vehicle_id' => 'nullable|exists:vehicles,id',
            'services_list' => 'nullable|array',
            'selected_services' => 'nullable|string',
            'deal_amount' => 'nullable|numeric',
            'deal_taken_date' => 'nullable|date',
            'amount_taken' => 'nullable|numeric',
            'amount_pending' => 'nullable|numeric',
            'balance' => 'nullable|numeric',
        ]);

        $validatedData['user_id'] = $request->user()->id;
        $work = WorkTaken::create($validatedData);

        return response()->json($work->load(['citizen', 'vehicle']), 201);
    }

    public function show(WorkTaken $workTaken)
    {
        return response()->json($workTaken->load(['citizen', 'vehicle']));
    }

    public function update(Request $request, WorkTaken $workTaken)
    {
        $validatedData = $request->validate([
            'citizen_id' => 'required|exists:citizens,id',
            'vehicle_id' => 'nullable|exists:vehicles,id',
            'services_list' => 'nullable|array',
            'selected_services' => 'nullable|string',
            'deal_amount' => 'nullable|numeric',
            'deal_taken_date' => 'nullable|date',
            'amount_taken' => 'nullable|numeric',
            'amount_pending' => 'nullable|numeric',
            'balance' => 'nullable|numeric',
        ]);

        $workTaken->update($validatedData);

        return response()->json($workTaken->fresh()->load(['citizen', 'vehicle']));
    }

    public function destroy(WorkTaken $workTaken)
    {
        $workTaken->delete();
        return response()->json(null, 204);
    }
}
