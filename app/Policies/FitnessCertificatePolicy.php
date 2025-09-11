<?php

namespace App\Policies;

use App\Models\FitnessCertificate;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class FitnessCertificatePolicy
{
    /**
     * Centralized logic to determine if a user can manage a document.
     */
    private function canManage(User $user, FitnessCertificate $fitnessCertificate): bool
    {
        // Admins can do anything.
        if ($user->role === 'admin') {
            return true;
        }

        // The user must own the parent citizen record.
        $citizenOwner = $fitnessCertificate->vehicle->citizen->user;
        if ($user->id === $citizenOwner->id) {
            return true;
        }

        // The user is a group manager and the citizen was created by someone in their group.
        if ($user->role === 'group_manager') {
            if ($user->group_id && $citizenOwner && $citizenOwner->group_id) {
                return $user->group_id === $citizenOwner->group_id;
            }
        }

        return false;
    }

    public function view(User $user, FitnessCertificate $fitnessCertificate): bool
    {
        return $this->canManage($user, $fitnessCertificate);
    }

    public function update(User $user, FitnessCertificate $fitnessCertificate): bool
    {
        return $this->canManage($user, $fitnessCertificate);
    }

    public function delete(User $user, FitnessCertificate $fitnessCertificate): bool
    {
        return $this->canManage($user, $fitnessCertificate);
    }
}
