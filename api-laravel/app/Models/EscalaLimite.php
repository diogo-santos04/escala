<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EscalaLimite extends Model
{
    protected $fillable = [
        "escala_turno_id",
        "seg",
        "ter",
        "qua",
        "qui",
        "sex",
        "sab",
        "dom",
        "feriado",
        "data_inicio",
        "data_fim",
        "status",
    ];

    public function escala_turno(){
        return $this->belongsTo(EscalaTurno::class, "id", "escala_turno_id");
    }
}
