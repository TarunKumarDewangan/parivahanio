<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Vehicle extends Model
{
    use HasFactory;

    protected $fillable = [
        'citizen_id',       // ✅ RESTORED
        'group_id',         // ✅ ADDED
        'registration_no',
        'type',
        'make_model',
        'chassis_no',
        'engine_no',
    ];

    /**
     * ✅ RESTORED: A Vehicle belongs to one Citizen.
     */
    public function citizen()
    {
        return $this->belongsTo(Citizen::class);
    }

    /**
     * The group this vehicle record belongs to.
     */
    public function group()
    {
        return $this->belongsTo(Group::class);
    }

    /**
     * A Vehicle can be part of many WorkTaken records.
     */
    public function workTakens()
    {
        return $this->hasMany(WorkTaken::class);
    }

    // Document relationships remain correct.
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
