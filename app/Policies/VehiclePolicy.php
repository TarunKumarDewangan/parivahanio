<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Vehicle;
use Illuminate\Auth\Access\Response;

class VehiclePolicy
{
    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Vehicle $vehicle): bool
    {
        // Admins can view any vehicle.
        if ($user->role === 'admin') {
            return true;
        }

        // A user can view a vehicle if they created the parent citizen record.
        if ($user->id === $vehicle->citizen->user_id) {
            return true;
        }

        // A group manager can view a vehicle if the parent citizen was created by a user in their group.
        if ($user->role === 'group_manager') {
            $citizen = $vehicle->citizen;
            // Ensure both the manager and the citizen's creator have a group.
            if ($user->group_id && $citizen->user && $citizen->user->group_id) {
                return $user->group_id === $citizen->user->group_id;
            }
        }

        return false;
    }

    /**
     * A user can update a vehicle if they have permission to view it.
     */
    public function update(User $user, Vehicle $vehicle): bool
    {
        return $this->view($user, $vehicle);
    }

    /**
     * A user can delete a vehicle if they have permission to view it.
     */
    public function delete(User $user, Vehicle $vehicle): bool
    {
        return $this->view($user, $vehicle);
    }
}
