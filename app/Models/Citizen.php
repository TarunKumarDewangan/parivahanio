<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Citizen extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
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

    public function vehicles()
    {
        return $this->hasMany(Vehicle::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
