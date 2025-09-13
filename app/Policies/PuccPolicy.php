<?php
namespace App\Policies;
use App\Models\Pucc;
use App\Models\User;
class PuccPolicy
{
    private function canManage(User $user, Pucc $pucc): bool
    {
        if ($user->role === 'admin')
            return true;
        if ($user->group_id && $user->group_id === $pucc->vehicle->group_id)
            return true;
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
