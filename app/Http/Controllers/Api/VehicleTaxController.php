<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Models\VehicleTax;
use App\Models\Vehicle;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class VehicleTaxController extends Controller
{
    public function index(Vehicle $vehicle)
    {
        $this->authorize('view', $vehicle);
        return response()->json($vehicle->vehicleTaxes()->latest()->get());
    }
    public function show(Vehicle $vehicle, VehicleTax $vehicleTax)
    {
        $this->authorize('view', $vehicleTax);
        return response()->json($vehicleTax);
    }

    public function store(Request $request, Vehicle $vehicle)
    {
        $this->authorize('update', $vehicle);
        // ✅ Corrected validation fields
        $validatedData = $request->validate(['vehicle_type' => 'nullable|string|max:255', 'tax_mode' => 'nullable|string|max:255', 'tax_from' => 'nullable|date', 'tax_upto' => 'nullable|date', 'amount' => 'nullable|numeric', 'file' => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:2048',]);
        if ($request->hasFile('file')) {
            $validatedData['file_path'] = $request->file('file')->store('vehicle_taxes', 'public');
        }
        $record = $vehicle->vehicleTaxes()->create($validatedData);
        return response()->json($record, 201);
    }
    public function update(Request $request, Vehicle $vehicle, VehicleTax $vehicleTax)
    {
        $this->authorize('update', $vehicleTax);
        $validatedData = $request->validate(['vehicle_type' => 'nullable|string|max:255', 'tax_mode' => 'nullable|string|max:255', 'tax_from' => 'nullable|date', 'tax_upto' => 'nullable|date', 'amount' => 'nullable|numeric', 'file' => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:2048',]);
        if ($request->hasFile('file')) {
            if ($vehicleTax->file_path) {
                Storage::disk('public')->delete($vehicleTax->file_path);
            }
            $validatedData['file_path'] = $request->file('file')->store('vehicle_taxes', 'public');
        }
        $vehicleTax->update($validatedData);
        return response()->json($vehicleTax);
    }
    public function destroy(Vehicle $vehicle, VehicleTax $vehicleTax)
    {
        $this->authorize('delete', $vehicleTax);
        if ($vehicleTax->file_path) {
            Storage::disk('public')->delete($vehicleTax->file_path);
        }
        $vehicleTax->delete();
        return response()->json(null, 204);
    }
}
