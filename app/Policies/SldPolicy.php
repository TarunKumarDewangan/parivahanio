<?php
namespace App\Policies;
use App\Models\Sld;
use App\Models\User;
class SldPolicy
{
    private function canManage(User $user, Sld $sld): bool
    {
        if ($user->role === 'admin')
            return true;
        if ($user->group_id && $user->group_id === $sld->vehicle->group_id)
            return true;
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
