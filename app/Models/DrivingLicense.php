<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DrivingLicense extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'dl_number',
        'name',
        'father_name',
        'dob',
        'address',
        'mobile_no',
        'validity_from',
        'validity_upto',
        'category',
        'other_category',
        'remarks',
    ];

    /**
     * The attributes that should be cast.
     */
    protected $casts = [
        'category' => 'array',
    ];

    /**
     * Get the user that owns the license.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
