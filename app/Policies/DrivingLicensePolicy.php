<?php

namespace App\Policies;

use App\Models\DrivingLicense;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class DrivingLicensePolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return true;
    }

    /**
     * Centralized logic to determine if a user can manage a specific license.
     */
    private function canManage(User $user, DrivingLicense $drivingLicense): bool
    {
        // Admins can manage any license.
        if ($user->role === 'admin') {
            return true;
        }

        // A user can manage their own license.
        if ($user->id === $drivingLicense->user_id) {
            return true;
        }

        // A group manager can manage licenses created by users in their group.
        if ($user->role === 'group_manager') {
            $licenseCreator = $drivingLicense->user;
            if ($user->group_id && $licenseCreator && $licenseCreator->group_id) {
                return $user->group_id === $licenseCreator->group_id;
            }
        }

        return false;
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, DrivingLicense $drivingLicense): bool
    {
        return $this->canManage($user, $drivingLicense);
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return true;
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, DrivingLicense $drivingLicense): bool
    {
        return $this->canManage($user, $drivingLicense);
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, DrivingLicense $drivingLicense): bool
    {
        return $this->canManage($user, $drivingLicense);
    }
}
