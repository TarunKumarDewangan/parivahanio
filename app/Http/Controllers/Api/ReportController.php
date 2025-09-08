<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

class ReportController extends Controller
{
    /**
     * Fetch a consolidated report of expiring documents.
     */
    public function expiringDocuments(Request $request)
    {
        $user = Auth::user();

        $validated = $request->validate([
            'name' => 'nullable|string',
            'mobile_no' => 'nullable|string',
            'vehicle_no' => 'nullable|string',
            'll_no' => 'nullable|string',
            'from_date' => 'nullable|date',
            'to_date' => 'nullable|date|after_or_equal:from_date',
        ]);

        // Base query for Learner Licenses
        $learnerLicenses = DB::table('learner_licenses')
            ->select(
                'name as holder_name',
                'mobile_no',
                DB::raw('NULL as vehicle_no'),
                DB::raw("'Learner License' as document_type"),
                'll_number as document_details',
                'validity_upto as expiry_date',
                'user_id'
            )
            // ✅ REMOVED: ->whereNotNull('validity_upto') to include all records
            ->when($request->filled('ll_no'), function ($query) use ($validated) {
                $query->where('ll_number', 'like', '%' . $validated['ll_no'] . '%');
            });

        // Base queries for other documents
        $insurances = $this->getBaseVehicleDocumentQuery('insurances', 'Insurance', 'policy_number', 'end_date');
        $fitness = $this->getBaseVehicleDocumentQuery('fitness_certificates', 'Fitness', 'certificate_number', 'expiry_date');
        $permits = $this->getBaseVehicleDocumentQuery('permits', 'Permit', 'permit_number', 'expiry_date');
        $puccs = $this->getBaseVehicleDocumentQuery('puccs', 'PUCC', 'pucc_number', 'valid_until');
        $slds = $this->getBaseVehicleDocumentQuery('slds', 'SLD', 'certificate_number', 'expiry_date');
        $vltds = $this->getBaseVehicleDocumentQuery('vltds', 'VLTD', 'certificate_number', 'expiry_date');

        $taxes = DB::table('vehicle_taxes')
            ->join('vehicles', "vehicle_taxes.vehicle_id", '=', 'vehicles.id')
            ->join('citizens', 'vehicles.citizen_id', '=', 'citizens.id')
            ->select(
                'citizens.name as holder_name',
                'citizens.mobile_no',
                'vehicles.registration_no as vehicle_no',
                DB::raw("'Tax' as document_type"),
                DB::raw("CONCAT('Mode: ', tax_mode, ', Amount: ', amount) as document_details"),
                'tax_upto as expiry_date',
                'citizens.user_id'
            );
        // ✅ REMOVED: ->whereNotNull('tax_upto') to include all records

        // Combine all queries using UNION ALL
        $combinedQuery = $learnerLicenses
            ->unionAll($insurances)->unionAll($fitness)->unionAll($permits)
            ->unionAll($puccs)->unionAll($slds)->unionAll($taxes)->unionAll($vltds);

        // Create a final query from the combined union to apply global filters
        $finalQuery = DB::query()->fromSub($combinedQuery, 'reports')
            ->when($user->role !== 'admin', function ($query) use ($user) {
                $query->where('user_id', $user->id);
            })
            ->when($request->filled('name'), function ($query) use ($validated) {
                $query->where('holder_name', 'like', '%' . $validated['name'] . '%');
            })
            ->when($request->filled('mobile_no'), function ($query) use ($validated) {
                $query->where('mobile_no', 'like', '%' . $validated['mobile_no'] . '%');
            })
            ->when($request->filled('vehicle_no'), function ($query) use ($validated) {
                $query->where('vehicle_no', 'like', '%' . $validated['vehicle_no'] . '%');
            })
            // This date filter will now only apply if dates are provided by the user
            ->when($request->filled('from_date') && $request->filled('to_date'), function ($query) use ($validated) {
                $query->whereBetween('expiry_date', [$validated['from_date'], $validated['to_date']]);
            })
            ->orderBy('expiry_date', 'asc');

        $results = $finalQuery->get();

        return response()->json($results);
    }

    /**
     * Helper function to build a standardized query for a vehicle document type.
     */
    private function getBaseVehicleDocumentQuery(string $tableName, string $documentType, string $detailsColumn, string $expiryColumn)
    {
        return DB::table($tableName)
            ->join('vehicles', "{$tableName}.vehicle_id", '=', 'vehicles.id')
            ->join('citizens', 'vehicles.citizen_id', '=', 'citizens.id')
            ->select(
                'citizens.name as holder_name',
                'citizens.mobile_no',
                'vehicles.registration_no as vehicle_no',
                DB::raw("'{$documentType}' as document_type"),
                "{$detailsColumn} as document_details",
                "{$expiryColumn} as expiry_date",
                'citizens.user_id'
            );
        // ✅ REMOVED: ->whereNotNull($expiryColumn) to include all records
    }
}
