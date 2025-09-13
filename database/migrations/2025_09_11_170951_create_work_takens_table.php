<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('work_takens', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('citizen_id')->constrained()->onDelete('cascade'); // A job must have a citizen

            // ✅ CHANGED: A job must be for a specific vehicle.
            $table->foreignId('vehicle_id')->constrained()->onDelete('cascade');

            $table->json('services_list')->nullable();
            $table->text('selected_services')->nullable();
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
