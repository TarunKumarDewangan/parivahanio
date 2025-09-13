<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Citizen extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'group_id', // ✅ ADDED
        'name',
        'mobile_no',
        'email',
        'birth_date',
        'relation_type',
        'relation_name',
        'address',
        'state',
        'city',
    ];

    /**
     * ✅ RESTORED: A Citizen can have many Vehicles.
     */
    public function vehicles()
    {
        return $this->hasMany(Vehicle::class);
    }

    /**
     * A Citizen can be associated with many historical WorkTaken records.
     */
    public function workTakens()
    {
        return $this->hasMany(WorkTaken::class);
    }

    /**
     * The system user who created this citizen record.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * The group this citizen record belongs to.
     */
    public function group()
    {
        return $this->belongsTo(Group::class);
    }
}
