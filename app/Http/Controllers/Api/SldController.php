<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Sld;
use App\Models\Vehicle;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class SldController extends Controller
{
    public function index(Vehicle $vehicle)
    {
        $vehicle->load('citizen.user');
        $this->authorize('view', $vehicle);
        return response()->json($vehicle->slds()->latest()->get());
    }

    public function store(Request $request, Vehicle $vehicle)
    {
        $vehicle->load('citizen.user');
        $this->authorize('update', $vehicle);

        $validatedData = $request->validate([
            'issue_date' => 'nullable|date',
            'expiry_date' => 'nullable|date|after_or_equal:issue_date',
            'certificate_number' => 'nullable|string|max:255',
            'file' => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:2048',
        ]);

        if ($request->hasFile('file')) {
            $validatedData['file_path'] = $request->file('file')->store('slds', 'public');
        }

        $record = $vehicle->slds()->create($validatedData);
        return response()->json($record, 201);
    }

    public function show(Vehicle $vehicle, Sld $sld)
    {
        $sld->load('vehicle.citizen.user');
        $this->authorize('view', $sld);
        return response()->json($sld);
    }

    public function update(Request $request, Vehicle $vehicle, Sld $sld)
    {
        $sld->load('vehicle.citizen.user');
        $this->authorize('update', $sld);

        $validatedData = $request->validate([
            'issue_date' => 'nullable|date',
            'expiry_date' => 'nullable|date|after_or_equal:issue_date',
            'certificate_number' => 'nullable|string|max:255',
            'file' => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:2048',
        ]);

        if ($request->hasFile('file')) {
            if ($sld->file_path) {
                Storage::disk('public')->delete($sld->file_path);
            }
            $validatedData['file_path'] = $request->file('file')->store('slds', 'public');
        }

        $sld->update($validatedData);
        return response()->json($sld);
    }

    public function destroy(Vehicle $vehicle, Sld $sld)
    {
        $sld->load('vehicle.citizen.user');
        $this->authorize('delete', $sld);

        if ($sld->file_path) {
            Storage::disk('public')->delete($sld->file_path);
        }

        $sld->delete();
        return response()->json(null, 204);
    }
}
