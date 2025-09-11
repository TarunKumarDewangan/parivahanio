<?php

namespace App\Policies;

use App\Models\Insurance;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class InsurancePolicy
{
    private function canManage(User $user, Insurance $insurance): bool
    {
        if ($user->role === 'admin') {
            return true;
        }

        $citizenOwner = $insurance->vehicle->citizen->user;
        if ($user->id === $citizenOwner->id) {
            return true;
        }

        if ($user->role === 'group_manager') {
            if ($user->group_id && $citizenOwner && $citizenOwner->group_id) {
                return $user->group_id === $citizenOwner->group_id;
            }
        }

        return false;
    }

    public function view(User $user, Insurance $insurance): bool
    {
        return $this->canManage($user, $insurance);
    }

    public function update(User $user, Insurance $insurance): bool
    {
        return $this->canManage($user, $insurance);
    }

    public function delete(User $user, Insurance $insurance): bool
    {
        return $this->canManage($user, $insurance);
    }
}
