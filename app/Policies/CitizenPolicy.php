<?php

namespace App\Policies;

use App\Models\Citizen;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class CitizenPolicy
{
    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Citizen $citizen): bool
    {
        // Admins can view any citizen.
        if ($user->role === 'admin') {
            return true;
        }

        // A user can view their own created citizen records.
        if ($user->id === $citizen->user_id) {
            return true;
        }

        // A group manager can view citizen records created by users in their group.
        if ($user->role === 'group_manager') {
            // Ensure both the manager and the citizen's creator have a group.
            if ($user->group_id && $citizen->user && $citizen->user->group_id) {
                return $user->group_id === $citizen->user->group_id;
            }
        }

        return false;
    }

    /**
     * A user can update a citizen record if they have permission to view it.
     * The logic is identical to the view method.
     */
    public function update(User $user, Citizen $citizen): bool
    {
        return $this->view($user, $citizen);
    }

    /**
     * A user can delete a citizen record if they have permission to view it.
     * The logic is identical to the view method.
     */
    public function delete(User $user, Citizen $citizen): bool
    {
        return $this->view($user, $citizen);
    }
}
