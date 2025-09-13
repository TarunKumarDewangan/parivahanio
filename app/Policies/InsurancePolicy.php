<?php
namespace App\Policies;
use App\Models\Insurance;
use App\Models\User;
class InsurancePolicy
{
    private function canManage(User $user, Insurance $insurance): bool
    {
        if ($user->role === 'admin')
            return true;
        if ($user->group_id && $user->group_id === $insurance->vehicle->group_id)
            return true;
        return false;
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
