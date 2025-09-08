<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Insurance extends Model
{
    use HasFactory;
    protected $fillable = [
        'vehicle_id',
        'vehicle_class_snapshot',
        'insurance_type',
        'company_name',
        'policy_number',
        'start_date',
        'end_date',
        'status',
        'file_path',
    ];
    public function vehicle()
    {
        return $this->belongsTo(Vehicle::class);
    }
}
