<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Group;

class GroupPolicy
{
    /**
     * Only Admins can view all groups.
     */
    public function viewAny(User $authUser): bool
    {
        return $authUser->role === 'admin';
    }

    /**
     * Only Admins can view a single group.
     */
    public function view(User $authUser, Group $group): bool
    {
        return $authUser->role === 'admin';
    }

    /**
     * Only Admins can create groups.
     */
    public function create(User $authUser): bool
    {
        return $authUser->role === 'admin';
    }

    /**
     * Only Admins can update groups.
     */
    public function update(User $authUser, Group $group): bool
    {
        return $authUser->role === 'admin';
    }

    /**
     * Only Admins can delete groups.
     */
    public function delete(User $authUser, Group $group): bool
    {
        return $authUser->role === 'admin';
    }
}
