<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Escala extends Model
{
    protected $fillable = [
        "unidade_id",
        "categoria_id",
        "nome",
        "status"
    ];

    public function unidade(){
        return $this->belongsTo(Unidade::class, "id", "unidade_id");
    }

    
    public function categoria(){
        return $this->belongsTo(Categoria::class, "id", "categoria_id");
    }
}
