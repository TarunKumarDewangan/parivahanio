<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use App\Models\User;

class GlobalSearchController extends Controller
{
    public function search(Request $request)
    {
        $user = Auth::user();

        $query = $request->input('query', '');

        // Don't search if the query is too short
        if (strlen($query) < 2) {
            return response()->json([]);
        }

        // Determine the user IDs to scope the search for group managers
        $userIds = [];
        if ($user->role === 'group_manager') {
            $userIds = User::where('group_id', $user->group_id)->pluck('id');
        } elseif ($user->role === 'user') {
            $userIds = [$user->id];
        }

        // 1. Search Citizens
        $citizens = DB::table('citizens')
            ->select('id', 'name as title', DB::raw("'Citizen' as description"), DB::raw("'citizen' as type"), 'user_id')
            ->where(function ($q) use ($query) {
                $q->where('name', 'LIKE', "%{$query}%")
                    ->orWhere('mobile_no', 'LIKE', "%{$query}%")
                    ->orWhere('address', 'LIKE', "%{$query}%");
            });

        // 2. Search Vehicles
        $vehicles = DB::table('vehicles')
            ->join('citizens', 'vehicles.citizen_id', '=', 'citizens.id')
            ->select('vehicles.id', 'vehicles.registration_no as title', DB::raw("CONCAT('Vehicle of ', citizens.name) as description"), DB::raw("'vehicle' as type"), 'citizens.user_id')
            ->where('vehicles.registration_no', 'LIKE', "%{$query}%");

        // 3. Search Learner Licenses
        $learnerLicenses = DB::table('learner_licenses')
            ->select('id', 'll_number as title', DB::raw("CONCAT('LL for ', name) as description"), DB::raw("'learner_license' as type"), 'user_id')
            ->where('ll_number', 'LIKE', "%{$query}%");

        // 4. Search Driving Licenses
        $drivingLicenses = DB::table('driving_licenses')
            ->select('id', 'dl_number as title', DB::raw("CONCAT('DL for ', name) as description"), DB::raw("'driving_license' as type"), 'user_id')
            ->where('dl_number', 'LIKE', "%{$query}%");

        // 5. Search Permits
        $permits = DB::table('permits')
            ->join('vehicles', 'permits.vehicle_id', '=', 'vehicles.id')
            ->join('citizens', 'vehicles.citizen_id', '=', 'citizens.id')
            ->select('permits.id', 'permits.permit_number as title', DB::raw("CONCAT('Permit for ', vehicles.registration_no) as description"), DB::raw("'permit' as type"), 'citizens.user_id')
            ->where('permits.permit_number', 'LIKE', "%{$query}%");

        // --- Combine queries ---
        // (You can add more UNIONs here for insurance policy numbers, PUCC, etc. following the pattern)
        $combinedQuery = $citizens
            ->union($vehicles)
            ->union($learnerLicenses)
            ->union($drivingLicenses)
            ->union($permits);

        // --- Apply Security and Get Results ---
        $finalQuery = DB::query()->fromSub($combinedQuery, 'search_results');

        // If user is not an admin, filter by their user ID or their group's user IDs
        if ($user->role !== 'admin') {
            $finalQuery->whereIn('user_id', $userIds);
        }

        $results = $finalQuery->take(10)->get(); // Limit to 10 results for performance

        return response()->json($results);
    }
}
