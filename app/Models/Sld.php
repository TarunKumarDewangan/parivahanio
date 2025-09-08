<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Sld extends Model
{
    use HasFactory;
    protected $table = 'slds';
    protected $fillable = [
        'vehicle_id',
        'issue_date',
        'expiry_date',
        'certificate_number',
        'file_path',
    ];
    public function vehicle()
    {
        return $this->belongsTo(Vehicle::class);
    }
}
