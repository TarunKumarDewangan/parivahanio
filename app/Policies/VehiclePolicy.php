<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Vehicle;
use Illuminate\Auth\Access\Response;

class VehiclePolicy
{
    /**
     * A user can view a vehicle if they are an admin or they own the parent citizen record.
     */
    public function view(User $user, Vehicle $vehicle): bool
    {
        return $user->role === 'admin' || $user->id === $vehicle->citizen->user_id;
    }

    /**
     * A user can update a vehicle if they are an admin or they own the parent citizen record.
     */
    public function update(User $user, Vehicle $vehicle): bool
    {
        return $user->role === 'admin' || $user->id === $vehicle->citizen->user_id;
    }

    /**
     * A user can delete a vehicle if they are an admin or they own the parent citizen record.
     */
    public function delete(User $user, Vehicle $vehicle): bool
    {
        return $user->role === 'admin' || $user->id === $vehicle->citizen->user_id;
    }
}
