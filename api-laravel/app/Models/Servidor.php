<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Servidor extends Model
{
    protected $fillable = [
        "matricula",
        "cpf",
        "nome",
        "status"
    ];
}
