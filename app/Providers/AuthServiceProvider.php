<?php

namespace App\Providers;

// use Illuminate\Support\Facades\Gate;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The model to policy mappings for the application.
     *
     * @var array<class-string, class-string>
     */
    protected $policies = [
        // Existing Policies
        \App\Models\User::class => \App\Policies\UserPolicy::class,
        \App\Models\Group::class => \App\Policies\GroupPolicy::class,
        \App\Models\LearnerLicense::class => \App\Policies\LearnerLicensePolicy::class,

        // ✅ NEW: Citizen and Vehicle Policies
        \App\Models\Citizen::class => \App\Policies\CitizenPolicy::class,
        \App\Models\Vehicle::class => \App\Policies\VehiclePolicy::class,
        \App\Models\FitnessCertificate::class => \App\Policies\FitnessCertificatePolicy::class,
        \App\Models\Insurance::class => \App\Policies\InsurancePolicy::class,
        \App\Models\Permit::class => \App\Policies\PermitPolicy::class,
        \App\Models\Pucc::class => \App\Policies\PuccPolicy::class,
        \App\Models\Sld::class => \App\Policies\SldPolicy::class,
        \App\Models\VehicleTax::class => \App\Policies\VehicleTaxPolicy::class,
        \App\Models\Vltd::class => \App\Policies\VltdPolicy::class,
        \App\Models\DrivingLicense::class => \App\Policies\DrivingLicensePolicy::class,
    ];

    /**
     * Register any authentication / authorization services.
     */
    public function boot(): void
    {
        //
    }
}
