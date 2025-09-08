<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Citizen;
use Illuminate\Http\Request;

class CitizenController extends Controller
{
    public function index(Request $request)
    {
        // Admins see all citizens, other users see only their own.
        if ($request->user()->role === 'admin') {
            $citizens = Citizen::latest()->get();
        } else {
            $citizens = Citizen::where('user_id', $request->user()->id)->latest()->get();
        }
        return response()->json($citizens);
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'mobile_no' => 'required|string|max:15|unique:citizens',
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

        return response()->json($citizen, 201);
    }

    public function show(Citizen $citizen)
    {
        // Assumes a CitizenPolicy exists
        // $this->authorize('view', $citizen);
        return response()->json($citizen);
    }

    public function update(Request $request, Citizen $citizen)
    {
        // $this->authorize('update', $citizen);
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'mobile_no' => 'required|string|max:15|unique:citizens,mobile_no,' . $citizen->id,
            'email' => 'nullable|email|max:255|unique:citizens,email,' . $citizen->id,
            'birth_date' => 'nullable|date',
            'relation_type' => 'nullable|string|max:50',
            'relation_name' => 'nullable|string|max:255',
            'address' => 'nullable|string',
            'state' => 'nullable|string|max:100',
            'city' => 'nullable|string|max:100',
        ]);

        $citizen->update($validatedData);
        return response()->json($citizen);
    }

    public function destroy(Citizen $citizen)
    {
        // $this->authorize('delete', $citizen);
        $citizen->delete();
        return response()->json(null, 204);
    }
}
