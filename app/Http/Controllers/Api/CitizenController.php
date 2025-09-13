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

        // Start the query with the vehicle relationship eager loaded
        $query = Citizen::with('vehicles');

        // Apply security scope based on user role
        if ($user->role === 'group_manager' || $user->role === 'user') {
            $userIdsInGroup = User::where('group_id', $user->group_id)->pluck('id');
            $query->whereIn('user_id', $userIdsInGroup);
        }
        // No user/group filter needed for 'admin'

        // ✅ NEW: Apply search filters if they are present in the request
        if ($request->has('name')) {
            $query->where('name', 'LIKE', '%' . $request->input('name') . '%');
        }
        if ($request->has('mobile_no')) {
            $query->where('mobile_no', 'LIKE', '%' . $request->input('mobile_no') . '%');
        }
        if ($request->has('vehicle_no')) {
            $query->whereHas('vehicles', function ($q) use ($request) {
                $q->where('registration_no', 'LIKE', '%' . $request->input('vehicle_no') . '%');
            });
        }

        $citizens = $query->latest()->get();

        // Manipulate the collection to create a clean 'vehicles' array on each citizen
        // This part is no longer needed with the correct eager loading structure, but we keep it for consistency
        $citizens->each(function ($citizen) {
            if (!$citizen->relationLoaded('vehicles')) {
                // If for some reason vehicles weren't loaded (e.g., in a different method), this prevents errors.
                $citizen->vehicles = $citizen->workTakens->pluck('vehicle')->filter()->unique('id')->values();
                unset($citizen->workTakens);
            }
        });

        return response()->json($citizens);
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'mobile_no' => 'required|string|max:15', // Unique rule removed at group level
            'email' => 'nullable|email|max:255|unique:citizens',
            'birth_date' => 'nullable|date',
            'relation_type' => 'nullable|string|max:50',
            'relation_name' => 'nullable|string|max:255',
            'address' => 'nullable|string',
            'state' => 'nullable|string|max:100',
            'city' => 'nullable|string|max:100',
        ]);

        $validatedData['user_id'] = $request->user()->id;
        $validatedData['group_id'] = $request->user()->group_id; // Assign group on creation
        $citizen = Citizen::create($validatedData);

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

        return response()->json($citizen->fresh()->load('vehicles'));
    }

    public function destroy(Citizen $citizen)
    {
        $this->authorize('delete', $citizen);
        $citizen->delete();
        return response()->json(null, 204);
    }
}
