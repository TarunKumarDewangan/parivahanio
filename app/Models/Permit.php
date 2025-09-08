<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Permit extends Model
{
    use HasFactory;
    // ✅ FIX: Added the correct fillable fields to match your migration.
    protected $fillable = [
        'vehicle_id',
        'issue_date',
        'expiry_date',
        'permit_number', // <-- Was missing
        'file_path',
    ];
    public function vehicle()
    {
        return $this->belongsTo(Vehicle::class);
    }
}
