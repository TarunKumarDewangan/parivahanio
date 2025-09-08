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
        Schema::create('fitness_certificates', function (Blueprint $table) {
            $table->id();

            // Foreign key to the vehicles table.
            // If a vehicle is deleted, all its fitness certificates are also deleted.
            $table->foreignId('vehicle_id')->constrained()->onDelete('cascade');

            // Document-specific details.
            $table->date('issue_date')->nullable();
            $table->date('expiry_date')->nullable();
            $table->string('certificate_number')->nullable();
            $table->string('file_path')->nullable(); // To store the path to a scanned document

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('fitness_certificates');
    }
};
