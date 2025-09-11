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
        $type = $request->input('type', null);

        if (strlen($query) < 2) {
            return response()->json([]);
        }

        $userIds = [];
        if ($user->role === 'group_manager') {
            $userIds = User::where('group_id', $user->group_id)->pluck('id');
        } elseif ($user->role === 'user') {
            $userIds = [$user->id];
        }

        // --- Base Queries with formatted labels ---

        $citizens = DB::table('citizens')
            // ✅ UPDATED: The label is now constructed in the SQL query
            ->select('id as value', DB::raw("CONCAT(name, ' (Mobile: ', mobile_no, ')') as label"), DB::raw("'citizen' as type"), 'user_id')
            ->where(function ($q) use ($query) {
                $q->where('name', 'LIKE', "%{$query}%")
                    ->orWhere('mobile_no', 'LIKE', "%{$query}%");
            });

        $vehicles = DB::table('vehicles')
            ->join('citizens', 'vehicles.citizen_id', '=', 'citizens.id')
            // ✅ UPDATED: The label is now constructed in the SQL query
            ->select('vehicles.id as value', DB::raw("CONCAT(vehicles.registration_no, ' (Owner: ', citizens.name, ')') as label"), DB::raw("'vehicle' as type"), 'citizens.user_id')
            ->where('vehicles.registration_no', 'LIKE', "%{$query}%");

        // --- Combine queries based on type ---
        $firstQuery = null;
        $otherQueries = [];

        if (!$type || $type === 'citizen') {
            if (!$firstQuery)
                $firstQuery = $citizens;
            else
                $otherQueries[] = $citizens;
        }
        if (!$type || $type === 'vehicle') {
            if (!$firstQuery)
                $firstQuery = $vehicles;
            else
                $otherQueries[] = $vehicles;
        }

        if (!$firstQuery) {
            return response()->json([]);
        }

        foreach ($otherQueries as $q) {
            $firstQuery->union($q);
        }

        // --- Apply Security and Get Final Results ---
        $finalQuery = DB::query()->fromSub($firstQuery, 'search_results');

        if ($user->role !== 'admin') {
            $finalQuery->whereIn('user_id', $userIds);
        }

        $results = $finalQuery->take(10)->get();

        return response()->json($results);
    }
}
