<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Group;

class GroupController extends Controller
{
    // List groups
    public function index(Request $request)
    {
        $this->authorize('viewAny', Group::class);

        $groups = Group::all();

        return response()->json([
            'status' => true,
            'groups' => $groups
        ]);
    }

    // Create group
    public function store(Request $request)
    {
        $this->authorize('create', Group::class);

        $request->validate([
            'name' => 'required|string|max:255|unique:groups',
        ]);

        $group = new Group();
        $group->name = $request->name;
        $group->save();

        return response()->json([
            'status' => true,
            'message' => 'Group created successfully',
            'group' => $group
        ]);
    }

    // Show group
    public function show(Group $group)
    {
        $this->authorize('view', $group);

        return response()->json([
            'status' => true,
            'group' => $group
        ]);
    }

    // Update group
    public function update(Request $request, Group $group)
    {
        $this->authorize('update', $group);

        $request->validate([
            'name' => 'required|string|max:255|unique:groups,name,' . $group->id,
        ]);

        $group->name = $request->name;
        $group->save();

        return response()->json([
            'status' => true,
            'message' => 'Group updated successfully',
            'group' => $group
        ]);
    }

    // Delete group
    public function destroy(Group $group)
    {
        $this->authorize('delete', $group);

        $group->delete();

        return response()->json([
            'status' => true,
            'message' => 'Group deleted successfully'
        ]);
    }
}
