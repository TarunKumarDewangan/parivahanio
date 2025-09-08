<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class VehicleTax extends Model
{
    use HasFactory;
    protected $table = 'vehicle_taxes';
    // ✅ FIX: Added all correct fillable fields to match your migration.
    protected $fillable = [
        'vehicle_id',
        'vehicle_type',
        'tax_mode',
        'tax_from',
        'tax_upto',
        'amount',
        'file_path',
    ];
    public function vehicle()
    {
        return $this->belongsTo(Vehicle::class);
    }
}
