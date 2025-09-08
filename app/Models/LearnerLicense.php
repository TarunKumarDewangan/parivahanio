<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LearnerLicense extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'application_no',
        'dob',
        'application_stage',
        'name',
        'father_name',
        'address',
        'mobile_no',
        'll_number',
        'validity_from',
        'validity_upto',
        'category',
        'other_category',
        'remarks',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array
     */
    // ✅ ADD THIS: This tells Laravel to treat the 'category' column as an array.
    protected $casts = [
        'category' => 'array',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
