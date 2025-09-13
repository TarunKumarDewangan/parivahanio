<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('citizens', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');

            // ✅ NEW: Associate the citizen with the group of the user who created it.
            $table->foreignId('group_id')->constrained()->onDelete('cascade');

            $table->string('name');
            $table->string('mobile_no'); // No longer unique by itself
            $table->string('email')->nullable(); // Unique email constraint removed for flexibility
            $table->date('birth_date')->nullable();
            $table->string('relation_type')->nullable();
            $table->string('relation_name')->nullable();
            $table->text('address')->nullable();
            $table->string('state')->nullable();
            $table->string('city')->nullable();
            $table->timestamps();

            // ✅ NEW: A mobile number must be unique WITHIN a group, but can be repeated in different groups.
            $table->unique(['group_id', 'mobile_no']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('citizens');
    }
};
