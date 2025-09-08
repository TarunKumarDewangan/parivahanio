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
        $this->authorize('view', $vehicle);
        return response()->json($vehicle->fitnessCertificates()->latest()->get());
    }
    public function show(Vehicle $vehicle, FitnessCertificate $fitnessCertificate)
    {
        $this->authorize('view', $fitnessCertificate);
        return response()->json($fitnessCertificate);
    }

    public function store(Request $request, Vehicle $vehicle)
    {
        $this->authorize('update', $vehicle);
        $validatedData = $request->validate(['issue_date' => 'nullable|date', 'expiry_date' => 'nullable|date', 'certificate_number' => 'nullable|string|max:255', 'file' => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:2048',]);
        if ($request->hasFile('file')) {
            $validatedData['file_path'] = $request->file('file')->store('fitness_certificates', 'public');
        }
        $record = $vehicle->fitnessCertificates()->create($validatedData);
        return response()->json($record, 201);
    }
    public function update(Request $request, Vehicle $vehicle, FitnessCertificate $fitnessCertificate)
    {
        $this->authorize('update', $fitnessCertificate);
        $validatedData = $request->validate(['issue_date' => 'nullable|date', 'expiry_date' => 'nullable|date', 'certificate_number' => 'nullable|string|max:255', 'file' => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:2048',]);
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
        $this->authorize('delete', $fitnessCertificate);
        if ($fitnessCertificate->file_path) {
            Storage::disk('public')->delete($fitnessCertificate->file_path);
        }
        $fitnessCertificate->delete();
        return response()->json(null, 204);
    }
}
