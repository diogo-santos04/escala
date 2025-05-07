<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EscalaSetor extends Model
{
    protected $fillable = [
        "escala_id",
        "nome",
        "status"
    ];

    public function escala(){
        return $this->belongsTo(Escala::class, "id", "escala_id");
    }
}
