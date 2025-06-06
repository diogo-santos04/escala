<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Servidor extends Model
{
    protected $fillable = [
        "nome",
        "celular",
        "matricula",
        "cpf",
        "email",
        "codigo",
        "status",
        "user_id"
    ];

    public function user()
    {
        return $this->belongsTo(User::class, "id", "user_id");
    }
}
