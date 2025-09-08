<?php

namespace App\Policies;

use App\Models\User;

class UserPolicy
{
    /**
     * Determine whether the user can view the list of users.
     */
    public function viewAny(User $authUser): bool
    {
        return in_array($authUser->role, ['admin', 'group_manager']);
    }

    /**
     * Determine whether the user can view a specific user.
     */
    public function view(User $authUser, User $user): bool
    {
        if ($authUser->role === 'admin') {
            return true;
        }
        if ($authUser->role === 'group_manager') {
            return $authUser->group_id === $user->group_id;
        }
        return $authUser->id === $user->id; // users can view themselves
    }

    /**
     * Determine whether the user can create users.
     */
    public function create(User $authUser): bool
    {
        return in_array($authUser->role, ['admin', 'group_manager']);
    }

    /**
     * Determine whether the user can update a user.
     */
    public function update(User $authUser, User $user): bool
    {
        if ($authUser->role === 'admin') {
            return true; // full access
        }
        if ($authUser->role === 'group_manager') {
            return $authUser->group_id === $user->group_id && $user->role === 'user';
        }
        // Normal user can only update themselves (but only via /me/password)
        return $authUser->id === $user->id;
    }

    /**
     * Determine whether the user can reset password.
     */
    public function resetPassword(User $authUser, User $user): bool
    {
        return $authUser->role === 'admin'; // ONLY admin
    }

    /**
     * Determine whether the user can delete a user.
     */
    public function delete(User $authUser, User $user): bool
    {
        if ($authUser->role === 'admin') {
            return true;
        }
        if ($authUser->role === 'group_manager') {
            return $authUser->group_id === $user->group_id && $user->role === 'user';
        }
        return false;
    }
}
