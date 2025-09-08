<?php

namespace App\Policies;

use App\Models\LearnerLicense;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class LearnerLicensePolicy
{
    /**
     * Any logged-in user can view the list of licenses (it will be filtered in the controller).
     */
    public function viewAny(User $user): bool
    {
        return true;
    }

    /**
     * A user can view a license if they are an admin OR they own the license.
     */
    public function view(User $user, LearnerLicense $learnerLicense): bool
    {
        return $user->role === 'admin' || $user->id === $learnerLicense->user_id;
    }

    /**
     * Any logged-in user can create a license for themselves.
     */
    public function create(User $user): bool
    {
        return true;
    }

    /**
     * A user can update a license if they are an admin OR they own the license.
     */
    public function update(User $user, LearnerLicense $learnerLicense): bool
    {
        return $user->role === 'admin' || $user->id === $learnerLicense->user_id;
    }

    /**
     * A user can delete a license if they are an admin OR they own the license.
     */
    public function delete(User $user, LearnerLicense $learnerLicense): bool
    {
        return $user->role === 'admin' || $user->id === $learnerLicense->user_id;
    }
}
