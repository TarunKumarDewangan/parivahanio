<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Group;
use App\Models\User;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    /**
     * Provide statistics for the admin dashboard.
     */
    public function getStats(Request $request)
    {
        // Using Eloquent's count() is highly efficient as it performs a COUNT(*) query.
        $usersCount = User::count();
        $groupsCount = Group::count();
        $managersCount = User::where('role', 'group_manager')->count();

        return response()->json([
            'status' => true,
            'stats' => [
                'users' => $usersCount,
                'groups' => $groupsCount,
                'managers' => $managersCount,
            ]
        ]);
    }
}
