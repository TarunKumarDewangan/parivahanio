<?php

namespace App\Policies;

use App\Models\Pucc;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class PuccPolicy
{
    private function canManage(User $user, Pucc $pucc): bool
    {
        if ($user->role === 'admin') {
            return true;
        }

        $citizenOwner = $pucc->vehicle->citizen->user;
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

    public function view(User $user, Pucc $pucc): bool
    {
        return $this->canManage($user, $pucc);
    }

    public function update(User $user, Pucc $pucc): bool
    {
        return $this->canManage($user, $pucc);
    }

    public function delete(User $user, Pucc $pucc): bool
    {
        return $this->canManage($user, $pucc);
    }
}
