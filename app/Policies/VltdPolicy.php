<?php

namespace App\Policies;

use App\Models\Vltd;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class VltdPolicy
{
    private function canManage(User $user, Vltd $vltd): bool
    {
        if ($user->role === 'admin') {
            return true;
        }

        $citizenOwner = $vltd->vehicle->citizen->user;
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

    public function view(User $user, Vltd $vltd): bool
    {
        return $this->canManage($user, $vltd);
    }

    public function update(User $user, Vltd $vltd): bool
    {
        return $this->canManage($user, $vltd);
    }

    public function delete(User $user, Vltd $vltd): bool
    {
        return $this->canManage($user, $vltd);
    }
}
