<?php
namespace App\Policies;
use App\Models\FitnessCertificate;
use App\Models\User;
class FitnessCertificatePolicy
{
    private function canManage(User $user, FitnessCertificate $fitnessCertificate): bool
    {
        if ($user->role === 'admin')
            return true;
        if ($user->group_id && $user->group_id === $fitnessCertificate->vehicle->group_id)
            return true;
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
