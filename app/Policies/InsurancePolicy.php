<?php

namespace App\Policies;

use App\Models\Insurance;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class InsurancePolicy
{
    /**
     * A user can manage a document if they are an admin or own the citizen record.
     */
    private function canManage(User $user, $document): bool
    {
        return $user->role === 'admin' || $user->id === $document->vehicle->citizen->user_id;
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
