<?php
namespace App\Policies;
use App\Models\Vltd;
use App\Models\User;
class VltdPolicy
{
    private function canManage(User $user, Vltd $vltd): bool
    {
        if ($user->role === 'admin')
            return true;
        if ($user->group_id && $user->group_id === $vltd->vehicle->group_id)
            return true;
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
