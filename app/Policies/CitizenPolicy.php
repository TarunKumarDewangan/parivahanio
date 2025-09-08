<?php

namespace App\Policies;

use App\Models\Citizen;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class CitizenPolicy
{
    /**
     * A user can view a citizen record if they are an admin or they created the record.
     */
    public function view(User $user, Citizen $citizen): bool
    {
        return $user->role === 'admin' || $user->id === $citizen->user_id;
    }

    /**
     * A user can update a citizen record if they are an admin or they created the record.
     */
    public function update(User $user, Citizen $citizen): bool
    {
        return $user->role === 'admin' || $user->id === $citizen->user_id;
    }

    /**
     * A user can delete a citizen record if they are an admin or they created the record.
     */
    public function delete(User $user, Citizen $citizen): bool
    {
        return $user->role === 'admin' || $user->id === $citizen->user_id;
    }
}
