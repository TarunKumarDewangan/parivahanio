<?php

namespace App\Policies;

use App\Models\DrivingLicense;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class DrivingLicensePolicy
{
    public function viewAny(User $user): bool
    {
        return true;
    }

    public function view(User $user, DrivingLicense $drivingLicense): bool
    {
        return $user->role === 'admin' || $user->id === $drivingLicense->user_id;
    }

    public function create(User $user): bool
    {
        return true;
    }

    public function update(User $user, DrivingLicense $drivingLicense): bool
    {
        return $user->role === 'admin' || $user->id === $drivingLicense->user_id;
    }

    public function delete(User $user, DrivingLicense $drivingLicense): bool
    {
        return $user->role === 'admin' || $user->id === $drivingLicense->user_id;
    }
}
