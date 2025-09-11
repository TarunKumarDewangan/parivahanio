<?php

namespace App\Policies;

use App\Models\VehicleTax;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class VehicleTaxPolicy
{
    private function canManage(User $user, VehicleTax $vehicleTax): bool
    {
        if ($user->role === 'admin') {
            return true;
        }

        $citizenOwner = $vehicleTax->vehicle->citizen->user;
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

    public function view(User $user, VehicleTax $vehicleTax): bool
    {
        return $this->canManage($user, $vehicleTax);
    }

    public function update(User $user, VehicleTax $vehicleTax): bool
    {
        return $this->canManage($user, $vehicleTax);
    }

    public function delete(User $user, VehicleTax $vehicleTax): bool
    {
        return $this->canManage($user, $vehicleTax);
    }
}
