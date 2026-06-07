<?php

namespace App\Http\Requests\Auth;

use Illuminate\Auth\Events\Lockout;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class LoginRequest extends FormRequest
{
    /**
     * Menentukan apakah user boleh melakukan request ini.
     * Di sini selalu true (siapapun boleh mencoba login).
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Aturan validasi untuk request login.
     */
    public function rules(): array
    {
        return [
            'email' => ['required', 'string', 'email'],
            'password' => ['required', 'string'],
        ];
    }

    /**
     * Mencoba melakukan autentikasi dengan kredensial yang diberikan.
     * Jika gagal, akan menambah hit rate limiter dan melempar error.
     */
    public function authenticate(): void
    {
        $this->ensureIsNotRateLimited();

        if (! Auth::attempt($this->only('email', 'password'), $this->boolean('remember'))) {
            RateLimiter::hit($this->throttleKey());

            throw ValidationException::withMessages([
                'email' => __('auth.failed'),
            ]);
        }

        RateLimiter::clear($this->throttleKey());
    }

    /**
     * Memastikan request login tidak melebihi batas percobaan (rate limit).
     * Jika terlalu banyak percobaan gagal, user akan dikunci sementara.
     */
    public function ensureIsNotRateLimited(): void
    {
        if (! RateLimiter::tooManyAttempts($this->throttleKey(), 5)) {
            return;
        }

        event(new Lockout($this));

        $seconds = RateLimiter::availableIn($this->throttleKey());

        throw ValidationException::withMessages([
            'email' => __('auth.throttle', [
                'seconds' => $seconds,
                'minutes' => ceil($seconds / 60),
            ]),
        ]);
    }

    /**
     * Membuat key unik untuk rate limiter berdasarkan email dan IP user.
     */
    public function throttleKey(): string
    {
        return Str::transliterate(Str::lower($this->string('email')).'|'.$this->ip());
    }

    /**
     * Pesan validasi custom untuk login.
     */
    public function messages()
    {
        return [
            'email.required' => 'Email wajib diisi.',
            'email.email' => 'Format email tidak valid.',
            'password.required' => 'Password wajib diisi.',
            'email.exists' => 'Email tidak ditemukan.',
            'auth.failed' => 'Kredensial yang Anda masukkan tidak cocok dengan data kami.',
            'auth.throttle' => 'Terlalu banyak upaya login. Silakan coba lagi dalam :seconds detik atau :minutes menit.',
        ];
    }
}
