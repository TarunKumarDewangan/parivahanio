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

            // Foreign key to the citizens table. This is the crucial link.
            // If a citizen is deleted, all their associated vehicles will also be deleted.
            $table->foreignId('citizen_id')->constrained()->onDelete('cascade');

            // Core vehicle details as you specified.
            $table->string('registration_no')->unique();
            $table->string('type')->nullable();
            $table->string('make_model')->nullable();
            $table->string('chassis_no')->nullable();
            $table->string('engine_no')->nullable();

            $table->timestamps();
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
