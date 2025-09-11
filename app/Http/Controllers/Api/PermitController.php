<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Permit;
use App\Models\Vehicle;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class PermitController extends Controller
{
    public function index(Vehicle $vehicle)
    {
        $vehicle->load('citizen.user');
        $this->authorize('view', $vehicle);
        return response()->json($vehicle->permits()->latest()->get());
    }

    public function store(Request $request, Vehicle $vehicle)
    {
        $vehicle->load('citizen.user');
        $this->authorize('update', $vehicle);

        $validatedData = $request->validate([
            'issue_date' => 'nullable|date',
            'expiry_date' => 'nullable|date|after_or_equal:issue_date',
            'permit_number' => 'nullable|string|max:255',
            'file' => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:2048',
        ]);

        if ($request->hasFile('file')) {
            $validatedData['file_path'] = $request->file('file')->store('permits', 'public');
        }

        $record = $vehicle->permits()->create($validatedData);
        return response()->json($record, 201);
    }

    public function show(Vehicle $vehicle, Permit $permit)
    {
        $permit->load('vehicle.citizen.user');
        $this->authorize('view', $permit);
        return response()->json($permit);
    }

    public function update(Request $request, Vehicle $vehicle, Permit $permit)
    {
        $permit->load('vehicle.citizen.user');
        $this->authorize('update', $permit);

        $validatedData = $request->validate([
            'issue_date' => 'nullable|date',
            'expiry_date' => 'nullable|date|after_or_equal:issue_date',
            'permit_number' => 'nullable|string|max:255',
            'file' => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:2048',
        ]);

        if ($request->hasFile('file')) {
            if ($permit->file_path) {
                Storage::disk('public')->delete($permit->file_path);
            }
            $validatedData['file_path'] = $request->file('file')->store('permits', 'public');
        }

        $permit->update($validatedData);
        return response()->json($permit);
    }

    public function destroy(Vehicle $vehicle, Permit $permit)
    {
        $permit->load('vehicle.citizen.user');
        $this->authorize('delete', $permit);

        if ($permit->file_path) {
            Storage::disk('public')->delete($permit->file_path);
        }

        $permit->delete();
        return response()->json(null, 204);
    }
}
