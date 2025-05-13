<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('plantaos', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('escala_mes_id')->nullable();
            $table->foreign('escala_mes_id')->references('id')->on('escala_mes')->onUpdate('cascade')->onDelete('set null');   
            $table->unsignedBigInteger('servidor_id')->nullable();
            $table->foreign('servidor_id')->references('id')->on('servidors')->onUpdate('cascade')->onDelete('set null');   
            $table->unsignedBigInteger('escala_turno_id')->nullable();
            $table->foreign('escala_turno_id')->references('id')->on('escala_turnos')->onUpdate('cascade')->onDelete('set null'); 
            $table->unsignedBigInteger('escala_setor_id')->nullable();
            $table->foreign('escala_setor_id')->references('id')->on('escala_setors')->onUpdate('cascade')->onDelete('set null');     
            $table->dateTime('data_plantao')->nullable();
            $table->integer('horas')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('plantaos');
    }
};
