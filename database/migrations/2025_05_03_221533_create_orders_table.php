<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained();
            $table->string('status')->default('pending');
            $table->decimal('total_price', 10, 2);
            $table->foreignId('shipping_address_id')->constrained();
            $table->json('shipping_method')->nullable();
            $table->decimal('shipping_cost', 10, 2)->default(0);
            $table->string('payment_method')->nullable();
            $table->string('payment_status')->default('pending');
            $table->string('payment_token')->nullable();
            $table->string('payment_url')->nullable();
            $table->decimal('discount', 10, 2)->default(0);
            $table->foreignId('coupon_id')->nullable()->constrained();
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('orders');
    }
};
