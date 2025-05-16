<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->string('tracking_number')->nullable()->after('payment_url');
            $table->string('tracking_url')->nullable()->after('tracking_number');
            $table->string('order_number')->nullable()->after('id');
            $table->text('admin_notes')->nullable()->after('notes');
            $table->decimal('total_amount', 12, 2)->nullable()->after('total_price');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn([
                'tracking_number',
                'tracking_url',
                'order_number',
                'admin_notes',
                'total_amount',
            ]);
        });
    }
};
