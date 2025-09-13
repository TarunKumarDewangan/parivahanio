<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Vehicle;
use Illuminate\Auth\Access\Response;

class VehiclePolicy
{
    /**
     * Centralized logic to check if a user can manage a vehicle record.
     */
    private function canManage(User $user, Vehicle $vehicle): bool
    {
        // Admins can do anything.
        if ($user->role === 'admin') {
            return true;
        }

        // Users can manage vehicles belonging to their own group.
        if ($user->group_id && $user->group_id === $vehicle->group_id) {
            return true;
        }

        return false;
    }

    public function viewAny(User $user): bool
    {
        return true;
    }

    public function view(User $user, Vehicle $vehicle): bool
    {
        return $this->canManage($user, $vehicle);
    }

    public function create(User $user): bool
    {
        // Any authenticated user with a group can create a vehicle record.
        return !is_null($user->group_id);
    }

    public function update(User $user, Vehicle $vehicle): bool
    {
        return $this->canManage($user, $vehicle);
    }

    public function delete(User $user, Vehicle $vehicle): bool
    {
        return $this->canManage($user, $vehicle);
    }
}
