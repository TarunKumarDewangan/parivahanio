<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Vltd;
use App\Models\Vehicle;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class VltdController extends Controller
{
    public function index(Vehicle $vehicle)
    {
        $vehicle->load('citizen.user');
        $this->authorize('view', $vehicle);
        return response()->json($vehicle->vltds()->latest()->get());
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
            $validatedData['file_path'] = $request->file('file')->store('vltds', 'public');
        }

        $record = $vehicle->vltds()->create($validatedData);
        return response()->json($record, 201);
    }

    public function show(Vehicle $vehicle, Vltd $vltd)
    {
        $vltd->load('vehicle.citizen.user');
        $this->authorize('view', $vltd);
        return response()->json($vltd);
    }

    public function update(Request $request, Vehicle $vehicle, Vltd $vltd)
    {
        $vltd->load('vehicle.citizen.user');
        $this->authorize('update', $vltd);

        $validatedData = $request->validate([
            'issue_date' => 'nullable|date',
            'expiry_date' => 'nullable|date|after_or_equal:issue_date',
            'certificate_number' => 'nullable|string|max:255',
            'file' => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:2048',
        ]);

        if ($request->hasFile('file')) {
            if ($vltd->file_path) {
                Storage::disk('public')->delete($vltd->file_path);
            }
            $validatedData['file_path'] = $request->file('file')->store('vltds', 'public');
        }

        $vltd->update($validatedData);
        return response()->json($vltd);
    }

    public function destroy(Vehicle $vehicle, Vltd $vltd)
    {
        $vltd->load('vehicle.citizen.user');
        $this->authorize('delete', $vltd);

        if ($vltd->file_path) {
            Storage::disk('public')->delete($vltd->file_path);
        }

        $vltd->delete();
        return response()->json(null, 204);
    }
}
