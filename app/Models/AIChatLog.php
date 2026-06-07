<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AIChatLog extends Model
{
    protected $table = 'ai_chat_logs';

    protected $fillable = [
        'user_id',
        'session_id',
        'model',
        'lang',
        'question',
        'question_length',
        'answer_length',
        'latency_ms',
        'success',
        'error_type',
        'error_message',
        'prompt_tokens',
        'completion_tokens',
        'total_tokens',
        'ip',
        'user_agent',
    ];

    protected $casts = [
        'success' => 'boolean',
        'latency_ms' => 'integer',
        'prompt_tokens' => 'integer',
        'completion_tokens' => 'integer',
        'total_tokens' => 'integer',
    ];
}

