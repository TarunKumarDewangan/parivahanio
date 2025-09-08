<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Vehicle;
use App\Models\Citizen;
use Illuminate\Http\Request;

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
        $this->authorize('update', $citizen);
        $validatedData = $request->validate([
            'registration_no' => 'required|string|max:20|unique:vehicles',
            'type' => 'nullable|string|max:100',
            'make_model' => 'nullable|string|max:100',
            'chassis_no' => 'nullable|string|max:100',
            'engine_no' => 'nullable|string|max:100',
        ]);

        $vehicle = $citizen->vehicles()->create($validatedData);
        return response()->json($vehicle, 201);
    }

    /**
     * ✅ NEW, EFFICIENT METHOD
     * Get a vehicle's details and the counts of all its related documents in a single query.
     */
    public function getDetails(Vehicle $vehicle)
    {
        $this->authorize('view', $vehicle);
        // loadCount is highly efficient. It performs one query to get counts for all relations.
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
     * Display the specified vehicle.
     */
    public function show(Vehicle $vehicle)
    {
        $this->authorize('view', $vehicle);
        return response()->json($vehicle->load('citizen'));
    }

    /**
     * Update the specified vehicle.
     */
    public function update(Request $request, Vehicle $vehicle)
    {
        $this->authorize('update', $vehicle);
        $validatedData = $request->validate([
            'registration_no' => 'required|string|max:20|unique:vehicles,registration_no,' . $vehicle->id,
            'type' => 'nullable|string|max:100',
            'make_model' => 'nullable|string|max:100',
            'chassis_no' => 'nullable|string|max:100',
            'engine_no' => 'nullable|string|max:100',
        ]);

        $vehicle->update($validatedData);
        return response()->json($vehicle);
    }

    /**
     * Remove the specified vehicle from storage.
     */
    public function destroy(Vehicle $vehicle)
    {
        $this->authorize('delete', $vehicle);
        $vehicle->delete();
        return response()->json(null, 204);
    }
}
