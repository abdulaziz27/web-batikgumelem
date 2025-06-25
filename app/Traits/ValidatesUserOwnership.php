<?php

namespace App\Traits;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Support\Facades\Log;

trait ValidatesUserOwnership
{
    protected function validateUserOwnership(Model $model, string $userIdField = 'user_id')
    {
        $authId = auth()->id();
        $user = auth()->user();
        $userRoles = $user ? $user->getRoleNames() : null;

        if ($model->{$userIdField} !== $authId) {
            Log::warning('Ownership check failed', [
                'order_id' => $model->id ?? null,
                'order_user_id' => $model->{$userIdField},
                'auth_id' => $authId,
                'auth_email' => $user ? $user->email : null,
                'auth_roles' => $userRoles,
                'route' => request()->path(),
                'ip' => request()->ip(),
            ]);
            abort(403, 'Anda tidak memiliki akses ke data ini');
        }
    }
}
