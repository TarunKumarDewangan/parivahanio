<?php

namespace App\Policies;

use App\Models\Sld;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class SldPolicy
{
    private function canManage(User $user, Sld $sld): bool
    {
        if ($user->role === 'admin') {
            return true;
        }

        $citizenOwner = $sld->vehicle->citizen->user;
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

    public function view(User $user, Sld $sld): bool
    {
        return $this->canManage($user, $sld);
    }

    public function update(User $user, Sld $sld): bool
    {
        return $this->canManage($user, $sld);
    }

    public function delete(User $user, Sld $sld): bool
    {
        return $this->canManage($user, $sld);
    }
}
