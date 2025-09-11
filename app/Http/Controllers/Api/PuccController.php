<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Pucc;
use App\Models\Vehicle;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class PuccController extends Controller
{
    public function index(Vehicle $vehicle)
    {
        $vehicle->load('citizen.user');
        $this->authorize('view', $vehicle);
        return response()->json($vehicle->puccs()->latest()->get());
    }

    public function store(Request $request, Vehicle $vehicle)
    {
        $vehicle->load('citizen.user');
        $this->authorize('update', $vehicle);

        $validatedData = $request->validate([
            'pucc_number' => 'nullable|string|max:255',
            'valid_from' => 'nullable|date',
            'valid_until' => 'nullable|date|after_or_equal:valid_from',
            'status' => 'nullable|string|max:50',
            'file' => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:2048',
        ]);

        if ($request->hasFile('file')) {
            $validatedData['file_path'] = $request->file('file')->store('puccs', 'public');
        }

        $record = $vehicle->puccs()->create($validatedData);
        return response()->json($record, 201);
    }

    public function show(Vehicle $vehicle, Pucc $pucc)
    {
        $pucc->load('vehicle.citizen.user');
        $this->authorize('view', $pucc);
        return response()->json($pucc);
    }

    public function update(Request $request, Vehicle $vehicle, Pucc $pucc)
    {
        $pucc->load('vehicle.citizen.user');
        $this->authorize('update', $pucc);

        $validatedData = $request->validate([
            'pucc_number' => 'nullable|string|max:255',
            'valid_from' => 'nullable|date',
            'valid_until' => 'nullable|date|after_or_equal:valid_from',
            'status' => 'nullable|string|max:50',
            'file' => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:2048',
        ]);

        if ($request->hasFile('file')) {
            if ($pucc->file_path) {
                Storage::disk('public')->delete($pucc->file_path);
            }
            $validatedData['file_path'] = $request->file('file')->store('puccs', 'public');
        }

        $pucc->update($validatedData);
        return response()->json($pucc);
    }

    public function destroy(Vehicle $vehicle, Pucc $pucc)
    {
        $pucc->load('vehicle.citizen.user');
        $this->authorize('delete', $pucc);

        if ($pucc->file_path) {
            Storage::disk('public')->delete($pucc->file_path);
        }

        $pucc->delete();
        return response()->json(null, 204);
    }
}
