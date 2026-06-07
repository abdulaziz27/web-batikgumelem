<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('ai_chat_logs', function (Blueprint $table) {
            $table->id();

            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->string('session_id', 128)->nullable();

            $table->string('model', 64)->nullable();
            $table->string('lang', 8)->nullable();

            $table->text('question')->nullable();
            $table->unsignedSmallInteger('question_length')->nullable();
            $table->unsignedSmallInteger('answer_length')->nullable();

            $table->unsignedInteger('latency_ms')->nullable();
            $table->boolean('success')->default(false);
            $table->string('error_type', 64)->nullable();
            $table->text('error_message')->nullable();

            // Token usage (nullable if provider doesn't expose it)
            $table->unsignedInteger('prompt_tokens')->nullable();
            $table->unsignedInteger('completion_tokens')->nullable();
            $table->unsignedInteger('total_tokens')->nullable();

            $table->string('ip', 45)->nullable();
            $table->string('user_agent', 512)->nullable();

            $table->timestamps();

            $table->index(['created_at']);
            $table->index(['success', 'created_at']);
            $table->index(['user_id', 'created_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ai_chat_logs');
    }
};

