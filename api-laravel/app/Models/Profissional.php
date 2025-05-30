<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Profissional extends Model
{
    protected $table = "profissionais";

    protected $fillable = [
        'nome',
        'celular',
        'cpf',
        'email',
        'codigo',
        'user_id',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, "id", "user_id");
    }
}
