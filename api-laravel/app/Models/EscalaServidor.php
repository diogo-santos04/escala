<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EscalaServidor extends Model
{
    protected $fillable = [
        "escala_id",
        "servidor_id",
        "score",
        "status"
    ];

    public function escala(){
        return $this->belongsTo(Escala::class, "id", "escala_id");
    }

    public function servidor(){
        return $this->belongsTo(Servidor::class, "id", "servidor_id");
    }
}
