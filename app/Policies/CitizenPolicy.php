<?php

namespace App\Policies;

use App\Models\Citizen;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class CitizenPolicy
{
    /**
     * Centralized logic to check if a user can manage a citizen record.
     */
    private function canManage(User $user, Citizen $citizen): bool
    {
        // Admins can do anything.
        if ($user->role === 'admin') {
            return true;
        }

        // Users (including group managers) can manage citizens belonging to their own group.
        // This requires the user to have a group_id.
        if ($user->group_id && $user->group_id === $citizen->group_id) {
            return true;
        }

        return false;
    }

    public function viewAny(User $user): bool
    {
        return true;
    }

    public function view(User $user, Citizen $citizen): bool
    {
        return $this->canManage($user, $citizen);
    }

    public function create(User $user): bool
    {
        // Any authenticated user with a group can create a citizen.
        return !is_null($user->group_id);
    }

    public function update(User $user, Citizen $citizen): bool
    {
        return $this->canManage($user, $citizen);
    }

    public function delete(User $user, Citizen $citizen): bool
    {
        return $this->canManage($user, $citizen);
    }
}
