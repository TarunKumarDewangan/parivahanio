<?php
namespace App\Policies;
use App\Models\VehicleTax;
use App\Models\User;
class VehicleTaxPolicy
{
    private function canManage(User $user, VehicleTax $vehicleTax): bool
    {
        if ($user->role === 'admin')
            return true;
        if ($user->group_id && $user->group_id === $vehicleTax->vehicle->group_id)
            return true;
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
