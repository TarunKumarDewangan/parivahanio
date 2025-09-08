<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Group;
use Illuminate\Support\Facades\Hash;

class InitialSetupSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Create Admin
        $admin = User::updateOrCreate(
            ['phone' => '9999999999'],
            [
                'name' => 'Super Admin',
                'password' => Hash::make('admin123'),
                'role' => 'admin',
                'group_id' => null,
            ]
        );

        // 2. Create Group
        $group = Group::updateOrCreate(
            ['name' => 'RTO Agent Sit 1']
        );

        // 3. Create Group Manager inside that group
        $manager = User::updateOrCreate(
            ['phone' => '8888888888'],
            [
                'name' => 'Group Manager',
                'password' => Hash::make('manager123'),
                'role' => 'group_manager',
                'group_id' => $group->id,
            ]
        );

        // 4. Create normal User under same group
        $user = User::updateOrCreate(
            ['phone' => '7777777777'],
            [
                'name' => 'Employee 1',
                'password' => Hash::make('user123'),
                'role' => 'user',
                'group_id' => $group->id,
            ]
        );
    }
}
