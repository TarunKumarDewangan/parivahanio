<?php
namespace App\Policies;
use App\Models\Permit;
use App\Models\User;
class PermitPolicy
{
    private function canManage(User $user, Permit $permit): bool
    {
        if ($user->role === 'admin')
            return true;
        if ($user->group_id && $user->group_id === $permit->vehicle->group_id)
            return true;
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
