<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EscalaMes extends Model
{
    protected $fillable = [
        "unidade_id",
        "escala_id",
        "mes_ano",
        "inicio_selecao",
        "publicidade",
        "configuracao",
        "status"
    ];

    public function unidade(){
        return $this->belongsTo(Unidade::class, "id", "unidade_id");
    }

    
    public function escala(){
        return $this->belongsTo(Escala::class, "id", "escala_id");
    }
}
