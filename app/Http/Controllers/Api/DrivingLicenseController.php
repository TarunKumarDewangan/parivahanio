<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\DrivingLicense;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class DrivingLicenseController extends Controller
{
    public function index(Request $request)
    {
        $this->authorize('viewAny', DrivingLicense::class);
        if ($request->user()->role === 'admin') {
            $licenses = DrivingLicense::latest()->get();
        } else {
            $licenses = DrivingLicense::where('user_id', $request->user()->id)->latest()->get();
        }
        return response()->json(['status' => true, 'licenses' => $licenses]);
    }

    public function store(Request $request)
    {
        $this->authorize('create', DrivingLicense::class);
        $validCategories = ['MCWG', 'LMV', 'MCWOG', 'TRANS', 'ERIK', 'TRACTOR', 'OTHERS'];
        $validatedData = $request->validate([
            'dl_number' => 'nullable|string|max:255|unique:driving_licenses',
            'name' => 'nullable|string|max:255',
            'father_name' => 'nullable|string|max:255',
            'dob' => 'nullable|date',
            'address' => 'nullable|string',
            'mobile_no' => 'nullable|string|max:15',
            'validity_from' => 'nullable|date',
            'validity_upto' => 'nullable|date|after_or_equal:validity_from',
            'category' => 'nullable|array',
            'category.*' => ['string', Rule::in($validCategories)],
            'other_category' => [
                'nullable',
                'string',
                'max:255',
                Rule::requiredIf(function () use ($request) {
                    return in_array('OTHERS', $request->input('category', []));
                })
            ],
            'remarks' => 'nullable|string',
        ]);
        $validatedData['user_id'] = $request->user()->id;
        $license = DrivingLicense::create($validatedData);
        return response()->json(['status' => true, 'message' => 'Driving License created successfully', 'license' => $license], 201);
    }

    public function show(DrivingLicense $drivingLicense)
    {
        $this->authorize('view', $drivingLicense);
        return response()->json(['status' => true, 'license' => $drivingLicense]);
    }

    public function update(Request $request, DrivingLicense $drivingLicense)
    {
        $this->authorize('update', $drivingLicense);
        $validCategories = ['MCWG', 'LMV', 'MCWOG', 'TRANS', 'ERIK', 'TRACTOR', 'OTHERS'];
        $validatedData = $request->validate([
            'dl_number' => ['nullable', 'string', 'max:255', Rule::unique('driving_licenses')->ignore($drivingLicense->id)],
            'name' => 'nullable|string|max:255',
            'father_name' => 'nullable|string|max:255',
            'dob' => 'nullable|date',
            'address' => 'nullable|string',
            'mobile_no' => 'nullable|string|max:15',
            'validity_from' => 'nullable|date',
            'validity_upto' => 'nullable|date|after_or_equal:validity_from',
            'category' => 'nullable|array',
            'category.*' => ['string', Rule::in($validCategories)],
            'other_category' => [
                'nullable',
                'string',
                'max:255',
                Rule::requiredIf(function () use ($request) {
                    return in_array('OTHERS', $request->input('category', []));
                })
            ],
            'remarks' => 'nullable|string',
        ]);
        $drivingLicense->update($validatedData);
        return response()->json(['status' => true, 'message' => 'Driving License updated successfully', 'license' => $drivingLicense]);
    }

    public function destroy(DrivingLicense $drivingLicense)
    {
        $this->authorize('delete', $drivingLicense);
        $drivingLicense->delete();
        return response()->json(['status' => true, 'message' => 'Driving License deleted successfully']);
    }
}
