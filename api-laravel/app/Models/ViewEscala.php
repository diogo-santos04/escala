<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ViewEscala extends Model
{
    protected $table = 'view_escala_mensal_202506';
    protected $fillable = [
        "descricao_escala",
        "data_plantao",
        "turno",
        "cor_turno",
        "ocupado",
        "limite",

    ];
}
