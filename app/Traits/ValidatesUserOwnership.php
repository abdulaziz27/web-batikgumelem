<?php

namespace App\Traits;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Exceptions\HttpResponseException;

trait ValidatesUserOwnership
{
    protected function validateUserOwnership(Model $model, string $userIdField = 'user_id')
    {
        if ($model->{$userIdField} !== auth()->id()) {
            throw new HttpResponseException(
                redirect()->back()->with('error', 'Anda tidak memiliki akses ke data ini')
            );
        }
    }
}
