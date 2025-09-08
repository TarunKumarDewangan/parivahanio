<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Vehicle extends Model
{
    use HasFactory;

    protected $fillable = [
        'citizen_id',
        'registration_no',
        'type',
        'make_model',
        'chassis_no',
        'engine_no',
    ];

    public function citizen()
    {
        return $this->belongsTo(Citizen::class);
    }
    public function fitnessCertificates()
    {
        return $this->hasMany(FitnessCertificate::class);
    }
    public function insurances()
    {
        return $this->hasMany(Insurance::class);
    }
    public function permits()
    {
        return $this->hasMany(Permit::class);
    }
    public function puccs()
    {
        return $this->hasMany(Pucc::class);
    }
    public function slds()
    {
        return $this->hasMany(Sld::class);
    }
    public function vehicleTaxes()
    {
        return $this->hasMany(VehicleTax::class);
    }
    public function vltds()
    {
        return $this->hasMany(Vltd::class);
    }
}
