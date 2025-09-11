<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class WorkTaken extends Model
{
    use HasFactory;

    protected $table = 'work_takens';

    protected $fillable = [
        'user_id',
        'citizen_id',
        'vehicle_id',
        'services_list',
        'selected_services',
        'deal_amount',
        'deal_taken_date',
        'amount_taken',
        'amount_pending',
        'balance',
    ];

    protected $casts = [
        'services_list' => 'array',
    ];

    public function citizen()
    {
        return $this->belongsTo(Citizen::class);
    }

    public function vehicle()
    {
        return $this->belongsTo(Vehicle::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
