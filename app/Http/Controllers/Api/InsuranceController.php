<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Insurance;
use App\Models\Vehicle;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class InsuranceController extends Controller
{
    public function index(Vehicle $vehicle)
    {
        $vehicle->load('citizen.user');
        $this->authorize('view', $vehicle);
        return response()->json($vehicle->insurances()->latest()->get());
    }

    public function store(Request $request, Vehicle $vehicle)
    {
        $vehicle->load('citizen.user');
        $this->authorize('update', $vehicle);

        $validatedData = $request->validate([
            'vehicle_class_snapshot' => 'nullable|string|max:255',
            'insurance_type' => 'nullable|string|max:255',
            'company_name' => 'nullable|string|max:255',
            'policy_number' => 'nullable|string|max:255',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'status' => 'nullable|string|max:50',
            'file' => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:2048',
        ]);

        if ($request->hasFile('file')) {
            $validatedData['file_path'] = $request->file('file')->store('insurances', 'public');
        }

        $record = $vehicle->insurances()->create($validatedData);
        return response()->json($record, 201);
    }

    public function show(Vehicle $vehicle, Insurance $insurance)
    {
        $insurance->load('vehicle.citizen.user');
        $this->authorize('view', $insurance);
        return response()->json($insurance);
    }

    public function update(Request $request, Vehicle $vehicle, Insurance $insurance)
    {
        $insurance->load('vehicle.citizen.user');
        $this->authorize('update', $insurance);

        $validatedData = $request->validate([
            'vehicle_class_snapshot' => 'nullable|string|max:255',
            'insurance_type' => 'nullable|string|max:255',
            'company_name' => 'nullable|string|max:255',
            'policy_number' => 'nullable|string|max:255',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'status' => 'nullable|string|max:50',
            'file' => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:2048',
        ]);

        if ($request->hasFile('file')) {
            if ($insurance->file_path) {
                Storage::disk('public')->delete($insurance->file_path);
            }
            $validatedData['file_path'] = $request->file('file')->store('insurances', 'public');
        }

        $insurance->update($validatedData);
        return response()->json($insurance);
    }

    public function destroy(Vehicle $vehicle, Insurance $insurance)
    {
        $insurance->load('vehicle.citizen.user');
        $this->authorize('delete', $insurance);

        if ($insurance->file_path) {
            Storage::disk('public')->delete($insurance->file_path);
        }

        $insurance->delete();
        return response()->json(null, 204);
    }
}
