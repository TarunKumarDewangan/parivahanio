<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('work_takens', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade'); // Who created this record
            $table->foreignId('citizen_id')->nullable()->constrained()->onDelete('set null');
            $table->foreignId('vehicle_id')->nullable()->constrained()->onDelete('set null');

            $table->json('services_list')->nullable(); // For the checkbox list
            $table->text('selected_services')->nullable(); // For the display text area

            $table->decimal('deal_amount', 10, 2)->nullable();
            $table->date('deal_taken_date')->nullable();
            $table->decimal('amount_taken', 10, 2)->nullable();
            $table->decimal('amount_pending', 10, 2)->nullable();
            $table->decimal('balance', 10, 2)->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('work_takens');
    }
};
