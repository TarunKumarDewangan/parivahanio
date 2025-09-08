<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;

class UserController extends Controller
{
    // List users
    public function index(Request $request)
    {
        $authUser = $request->user();

        if ($authUser->role === 'admin') {
            $users = User::with('group')->get();
        } elseif ($authUser->role === 'group_manager') {
            $users = User::with('group')->where('group_id', $authUser->group_id)->get();
        } else {
            $users = [$authUser]; // normal users see only themselves
        }

        return response()->json([
            'status' => true,
            'users' => $users,
        ]);
    }

    // Create user
    public function store(Request $request)
    {
        $this->authorize('create', User::class);
        $authUser = $request->user();

        $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'required|string|max:20|unique:users',
            'password' => 'required|string|min:6',
            'role' => 'required|in:admin,group_manager,user',
            'group_id' => 'nullable|exists:groups,id',
        ]);

        $user = new User();
        $user->name = $request->name;
        $user->phone = $request->phone;
        $user->password = bcrypt($request->password);

        if ($authUser->role === 'group_manager') {
            $user->role = 'user';
            $user->group_id = $authUser->group_id;
        } else {
            $user->role = $request->role;
            $user->group_id = $request->group_id;
        }

        $user->save();

        return response()->json([
            'status' => true,
            'message' => 'User created successfully',
            'user' => $user
        ]);
    }

    // Show user
    public function show($id)
    {
        $user = User::with('group')->findOrFail($id);
        $this->authorize('view', $user);

        return response()->json([
            'status' => true,
            'user' => $user
        ]);
    }

    // Update user
    public function update(Request $request, $id)
    {
        $authUser = $request->user();
        $user = User::findOrFail($id);

        $this->authorize('update', $user);

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'phone' => 'sometimes|string|max:20|unique:users,phone,' . $id,
            'password' => 'nullable|string|min:6',
            'role' => 'sometimes|string|in:admin,group_manager,user',
            'group_id' => 'nullable|exists:groups,id',
        ]);

        if (!empty($validated['password'])) {
            $validated['password'] = bcrypt($validated['password']);
        } else {
            unset($validated['password']); // don’t overwrite if blank
        }

        $user->update($validated);

        return response()->json([
            'status' => true,
            'message' => 'User updated successfully',
            'user' => $user
        ]);
    }

    // Delete user
    public function destroy(Request $request, $id)
    {
        $user = User::findOrFail($id);
        $this->authorize('delete', $user);

        $user->delete();

        return response()->json([
            'status' => true,
            'message' => 'User deleted successfully'
        ]);
    }
}
