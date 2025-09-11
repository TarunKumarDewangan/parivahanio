<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\FitnessCertificate;
use App\Models\Vehicle;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class FitnessCertificateController extends Controller
{
    public function index(Vehicle $vehicle)
    {
        $vehicle->load('citizen.user');
        $this->authorize('view', $vehicle);
        return response()->json($vehicle->fitnessCertificates()->latest()->get());
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
            $validatedData['file_path'] = $request->file('file')->store('fitness_certificates', 'public');
        }

        $record = $vehicle->fitnessCertificates()->create($validatedData);
        return response()->json($record, 201);
    }

    public function show(Vehicle $vehicle, FitnessCertificate $fitnessCertificate)
    {
        $fitnessCertificate->load('vehicle.citizen.user');
        $this->authorize('view', $fitnessCertificate);
        return response()->json($fitnessCertificate);
    }

    public function update(Request $request, Vehicle $vehicle, FitnessCertificate $fitnessCertificate)
    {
        $fitnessCertificate->load('vehicle.citizen.user');
        $this->authorize('update', $fitnessCertificate);

        $validatedData = $request->validate([
            'issue_date' => 'nullable|date',
            'expiry_date' => 'nullable|date|after_or_equal:issue_date',
            'certificate_number' => 'nullable|string|max:255',
            'file' => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:2048',
        ]);

        if ($request->hasFile('file')) {
            if ($fitnessCertificate->file_path) {
                Storage::disk('public')->delete($fitnessCertificate->file_path);
            }
            $validatedData['file_path'] = $request->file('file')->store('fitness_certificates', 'public');
        }

        $fitnessCertificate->update($validatedData);
        return response()->json($fitnessCertificate);
    }

    public function destroy(Vehicle $vehicle, FitnessCertificate $fitnessCertificate)
    {
        $fitnessCertificate->load('vehicle.citizen.user');
        $this->authorize('delete', $fitnessCertificate);

        if ($fitnessCertificate->file_path) {
            Storage::disk('public')->delete($fitnessCertificate->file_path);
        }

        $fitnessCertificate->delete();
        return response()->json(null, 204);
    }
}
