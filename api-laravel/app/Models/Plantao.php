<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Plantao extends Model
{
    protected $fillable = [
        "escala_mes_id",
        "servidor_id",
        "escala_turno_id",
        "escala_setor_id",
        "data_plantao",
        "horas",
    ];

    public function escala_mes()
    {
        return $this->belongsTo(EscalaMes::class, "id", "escala_mes_id");
    }

    public function servidor()
    {
        return $this->belongsTo(Servidor::class, "id", "servidor_id");
    }
    public function escala_turno()
    {
        return $this->belongsTo(EscalaTurno::class, "id", "escala_turno_id");
    }
    public function escala_setor()
    {
        return $this->belongsTo(EscalaSetor::class, "id", "escala_setor_id");
    }
}
