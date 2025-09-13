<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\WorkTaken;
use Illuminate\Http\Request;
use App\Models\User;

class WorkTakenController extends Controller
{
    /**
     * Display a listing of the resource based on the user's role.
     */
    public function index(Request $request)
    {
        $user = $request->user();

        // Start the query with relationships that will be needed on the frontend
        $query = WorkTaken::with(['citizen', 'vehicle']);

        // Apply filters based on user role
        if ($user->role === 'admin') {
            // Admin sees all records, no filter needed.
        } elseif ($user->role === 'group_manager') {
            // Group manager sees all records created by users in their group.
            $userIdsInGroup = User::where('group_id', $user->group_id)->pluck('id');
            $query->whereIn('user_id', $userIdsInGroup);
        } else { // 'user' role
            // A regular user sees only the records they personally created.
            $query->where('user_id', $user->id);
        }

        return response()->json($query->latest()->get());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'citizen_id' => 'required|exists:citizens,id',
            'vehicle_id' => 'required|exists:vehicles,id',
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

    /**
     * Display the specified resource.
     */
    public function show(WorkTaken $workTaken)
    {
        // Add authorization check here if needed in the future
        return response()->json($workTaken->load(['citizen', 'vehicle']));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, WorkTaken $workTaken)
    {
        // Add authorization check here if needed in the future
        $validatedData = $request->validate([
            'citizen_id' => 'required|exists:citizens,id',
            'vehicle_id' => 'required|exists:vehicles,id',
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

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(WorkTaken $workTaken)
    {
        // Add authorization check here if needed in the future
        $workTaken->delete();
        return response()->json(null, 204);
    }
}
