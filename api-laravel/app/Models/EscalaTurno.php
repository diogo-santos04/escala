<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EscalaTurno extends Model
{
    protected $fillable = [
        "escala_id",
        "nome",
        "cor",
        "letra",
        "hora_inicio",
        "hora_fim",
        "horas",
        "status",
    ];

    public function escala()
    {
        return $this->belongsTo(Escala::class, "id", "escala_id");
    }
}
