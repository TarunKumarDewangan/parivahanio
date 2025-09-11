<?php

namespace App\Policies;

use App\Models\Permit;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class PermitPolicy
{
    private function canManage(User $user, Permit $permit): bool
    {
        if ($user->role === 'admin') {
            return true;
        }

        $citizenOwner = $permit->vehicle->citizen->user;
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

    public function view(User $user, Permit $permit): bool
    {
        return $this->canManage($user, $permit);
    }

    public function update(User $user, Permit $permit): bool
    {
        return $this->canManage($user, $permit);
    }

    public function delete(User $user, Permit $permit): bool
    {
        return $this->canManage($user, $permit);
    }
}
