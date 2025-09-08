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
        Schema::create('driving_licenses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('dl_number')->unique()->nullable();
            $table->string('name')->nullable();
            $table->string('father_name')->nullable();
            $table->date('dob')->nullable();
            $table->text('address')->nullable();
            $table->string('mobile_no', 15)->nullable();
            $table->date('validity_from')->nullable();
            $table->date('validity_upto')->nullable();
            $table->json('category')->nullable();
            $table->string('other_category')->nullable();
            $table->text('remarks')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('driving_licenses');
    }
};
