<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('vehicles', function (Blueprint $table) {
            $table->id();

            // ✅ RESTORED: A vehicle now belongs to a specific citizen.
            $table->foreignId('citizen_id')->constrained()->onDelete('cascade');

            // ✅ NEW: Associate the vehicle with the group of the citizen.
            $table->foreignId('group_id')->constrained()->onDelete('cascade');

            // Registration number is no longer unique on its own.
            $table->string('registration_no');

            $table->string('type')->nullable();
            $table->string('make_model')->nullable();
            $table->string('chassis_no')->nullable();
            $table->string('engine_no')->nullable();
            $table->timestamps();

            // ✅ NEW: A registration number must be unique WITHIN a group, but can be repeated in different groups.
            $table->unique(['group_id', 'registration_no']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('vehicles');
    }
};
