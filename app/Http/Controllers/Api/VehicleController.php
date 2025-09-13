<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Vehicle;
use App\Models\Citizen;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class VehicleController extends Controller
{
    /**
     * Display a listing of vehicles for a specific citizen.
     */
    public function index(Citizen $citizen)
    {
        $this->authorize('view', $citizen);
        return response()->json($citizen->vehicles()->latest()->get());
    }

    /**
     * Store a newly created vehicle for a specific citizen.
     */
    public function store(Request $request, Citizen $citizen)
    {
        $this->authorize('update', $citizen); // Can the user add a vehicle to this citizen?

        $validatedData = $request->validate([
            // Validation rule to check for uniqueness ONLY within the citizen's group.
            'registration_no' => [
                'required',
                'string',
                'max:20',
                Rule::unique('vehicles')->where(function ($query) use ($citizen) {
                    return $query->where('group_id', $citizen->group_id);
                })
            ],
            'type' => 'nullable|string|max:100',
            'make_model' => 'nullable|string|max:100',
            'chassis_no' => 'nullable|string|max:100',
            'engine_no' => 'nullable|string|max:100',
        ]);

        // Automatically assign the citizen's group_id to the new vehicle.
        $validatedData['group_id'] = $citizen->group_id;

        $vehicle = $citizen->vehicles()->create($validatedData);
        return response()->json($vehicle, 201);
    }

    /**
     * Get a vehicle's details AND the counts of all its related documents.
     */
    public function getDetails(Vehicle $vehicle)
    {
        $vehicle->load('citizen.user');
        $this->authorize('view', $vehicle);

        $vehicle->loadCount([
            'insurances',
            'vehicleTaxes',
            'fitnessCertificates',
            'permits',
            'puccs',
            'slds',
            'vltds'
        ]);

        return response()->json($vehicle);
    }

    /**
     * Display the specified resource.
     */
    public function show(Vehicle $vehicle)
    {
        $vehicle->load('citizen.user');
        $this->authorize('view', $vehicle);
        return response()->json($vehicle);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Vehicle $vehicle)
    {
        $this->authorize('update', $vehicle);

        $validatedData = $request->validate([
            'registration_no' => [
                'required',
                'string',
                'max:20',
                Rule::unique('vehicles')->where(function ($query) use ($vehicle) {
                    return $query->where('group_id', $vehicle->group_id);
                })->ignore($vehicle->id)
            ],
            'type' => 'nullable|string|max:100',
            'make_model' => 'nullable|string|max:100',
            'chassis_no' => 'nullable|string|max:100',
            'engine_no' => 'nullable|string|max:100',
        ]);

        $vehicle->update($validatedData);
        return response()->json($vehicle);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Vehicle $vehicle)
    {
        $this->authorize('delete', $vehicle);
        $vehicle->delete();
        return response()->json(null, 204);
    }
}
