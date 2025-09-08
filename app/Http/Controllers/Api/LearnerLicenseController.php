<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\LearnerLicense;
use Illuminate\Validation\Rule;

class LearnerLicenseController extends Controller
{
    /**
     * Display a listing of the resource.
     * Admins see all licenses; other users see only their own.
     */
    public function index(Request $request)
    {
        $this->authorize('viewAny', LearnerLicense::class);

        if ($request->user()->role === 'admin') {
            $licenses = LearnerLicense::latest()->get();
        } else {
            $licenses = LearnerLicense::where('user_id', $request->user()->id)->latest()->get();
        }

        return response()->json([
            'status' => true,
            'licenses' => $licenses
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $this->authorize('create', LearnerLicense::class);

        $validCategories = ['MCWG', 'LMV', 'MCWOG', 'TRANS', 'ERIK', 'TRACTOR', 'OTHERS'];

        $validatedData = $request->validate([
            'application_no' => 'nullable|string|max:255|unique:learner_licenses',
            'name' => 'nullable|string|max:255',
            'dob' => 'nullable|date',
            'application_stage' => 'nullable|string|max:255',
            'father_name' => 'nullable|string|max:255',
            'address' => 'nullable|string',
            'mobile_no' => 'nullable|string|max:15',
            'll_number' => 'nullable|string|max:255',
            'validity_from' => 'nullable|date',
            'validity_upto' => 'nullable|date|after_or_equal:validity_from',
            'remarks' => 'nullable|string',
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
        ]);

        $validatedData['user_id'] = $request->user()->id;
        $license = LearnerLicense::create($validatedData);

        return response()->json([
            'status' => true,
            'message' => 'Learner License created successfully',
            'license' => $license
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $license = LearnerLicense::findOrFail($id);
        $this->authorize('view', $license);

        return response()->json(['status' => true, 'license' => $license]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $license = LearnerLicense::findOrFail($id);
        $this->authorize('update', $license);

        $validCategories = ['MCWG', 'LMV', 'MCWOG', 'TRANS', 'ERIK', 'TRACTOR', 'OTHERS'];

        $validatedData = $request->validate([
            'application_no' => ['nullable', 'string', 'max:255', Rule::unique('learner_licenses')->ignore($id)],
            'name' => 'nullable|string|max:255',
            'dob' => 'nullable|date',
            'application_stage' => 'nullable|string|max:255',
            'father_name' => 'nullable|string|max:255',
            'address' => 'nullable|string',
            'mobile_no' => 'nullable|string|max:15',
            'll_number' => 'nullable|string|max:255',
            'validity_from' => 'nullable|date',
            'validity_upto' => 'nullable|date|after_or_equal:validity_from',
            'remarks' => 'nullable|string',
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
        ]);

        $license->update($validatedData);

        return response()->json([
            'status' => true,
            'message' => 'Learner License updated successfully',
            'license' => $license
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $license = LearnerLicense::findOrFail($id);
        $this->authorize('delete', $license);

        $license->delete();

        return response()->json([
            'status' => true,
            'message' => 'Learner License deleted successfully'
        ]);
    }
}
