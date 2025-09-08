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
        Schema::create('citizens', function (Blueprint $table) {
            $table->id();

            // Foreign key to the users table. Tracks which system user created this citizen record.
            // If the user is deleted, all their created citizen records are also deleted.
            $table->foreignId('user_id')->constrained()->onDelete('cascade');

            // Citizen's personal details
            $table->string('name');
            $table->string('mobile_no')->unique();
            $table->string('email')->nullable()->unique();
            $table->date('birth_date')->nullable();
            $table->string('relation_type')->nullable(); // e.g., 'S/O', 'W/O', 'D/O'
            $table->string('relation_name')->nullable();
            $table->text('address')->nullable();
            $table->string('state')->nullable();
            $table->string('city')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('citizens');
    }
};
