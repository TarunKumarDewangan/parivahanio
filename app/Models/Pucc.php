<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Pucc extends Model
{
    use HasFactory;
    protected $table = 'puccs';
    // ✅ FIX: Corrected field names to match your migration.
    protected $fillable = [
        'vehicle_id',
        'pucc_number',
        'valid_from',
        'valid_until', // <-- Corrected from valid_upto
        'status',
        'file_path',
    ];
    public function vehicle()
    {
        return $this->belongsTo(Vehicle::class);
    }
}
